import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Descendant, Editor } from "slate";
import { Editable, Slate } from "slate-react";
import { twMerge } from "tailwind-merge";
import { useAutosuggestions } from "../../hooks/base-copilot-textarea-implementation/use-autosuggestions";
import { useCopilotTextareaEditor } from "../../hooks/base-copilot-textarea-implementation/use-copilot-textarea-editor";
import { usePopulateCopilotTextareaRef } from "../../hooks/base-copilot-textarea-implementation/use-populate-copilot-textarea-ref";
import {
  getFullEditorTextWithNewlines,
  getTextAroundCollapsedCursor,
} from "../../lib/get-text-around-cursor";
import { addAutocompletionsToEditor } from "../../lib/slatejs-edits/add-autocompletions";
import { clearAutocompletionsFromEditor } from "../../lib/slatejs-edits/clear-autocompletions";
import { replaceEditorText } from "../../lib/slatejs-edits/replace-text";
import { BaseAutosuggestionsConfig, defaultBaseAutosuggestionsConfig } from "../../types/base";
import { AutosuggestionState } from "../../types/base/autosuggestion-state";
import { BaseCopilotTextareaProps } from "../../types/base/base-copilot-textarea-props";
import {
  HoveringEditorProvider,
  useHoveringEditorContext,
} from "../hovering-toolbar/hovering-editor-provider";
import { HoveringToolbar } from "../hovering-toolbar/hovering-toolbar";
import { makeRenderElementFunction } from "./render-element";
import { makeRenderPlaceholderFunction } from "./render-placeholder";
import { TrackerTextEditedSinceLastCursorMovement } from "./track-cursor-moved-since-last-text-change";

/**
 * Purpose: to be used as the `ref` type for `CopilotTextarea` and `BaseCopilotTextarea`.
 *
 * This interface extends `HTMLElement`, and is the subset of `HTMLTextAreaElement` that "actually matters".
 * It provides the core functionality that consumers of `HTMLTextAreaElement` need 99.9% of the time:
 * - `value`: the current value of the textarea
 * - `focus`: make the textarea focused
 * - `blur`: make the textarea unfocused
 */
export interface HTMLCopilotTextAreaElement extends HTMLElement {
  /**
   * The current value of the textarea.
   */
  value: string;

  /**
   * focus on the textarea
   */
  focus: () => void;

  /**
   * unfocus the textarea.
   *
   * Called `blur` for syntactic compatibility with `HTMLTextAreaElement`.
   */
  blur: () => void;
}

/**
 * Not intended for direct use. Use CopilotTextarea instead.
 *
 * The `BaseCopilotTextarea` includes the basic UX component,
 * without the business logic / AI logic that makes the content useful and coherent.
 *
 * It is useful if you want to build your own backend, with fully custom business logic
 * for figuring out which contnet to fill in.
 */
export const BaseCopilotTextarea = React.forwardRef(
  (props: BaseCopilotTextareaProps, ref: React.Ref<HTMLCopilotTextAreaElement>) => {
    return (
      <HoveringEditorProvider>
        <BaseCopilotTextareaWithHoveringContext {...props} ref={ref} />
      </HoveringEditorProvider>
    );
  },
);

/**
 * Not intended for direct use. Use `CopilotTextarea` instead.
 *
 * This is the private core of the `BaseCopilotTextarea` component.
 * For practical purposes the implementation is cleaner assuming containment in a `HoveringEditorProviderContext`.
 *
 * Therefore we separate the core logic into this component,
 * and wrap it in a `HoveringEditorProviderContext` in `BaseCopilotTextarea`.
 */
const BaseCopilotTextareaWithHoveringContext = React.forwardRef(
  (props: BaseCopilotTextareaProps, ref: React.Ref<HTMLCopilotTextAreaElement>) => {
    const autosuggestionsConfig: BaseAutosuggestionsConfig = {
      ...defaultBaseAutosuggestionsConfig,
      ...props.baseAutosuggestionsConfig,
    };

    const valueOnInitialRender = useMemo(() => props.value ?? "", []);
    const [lastKnownFullEditorText, setLastKnownFullEditorText] = useState(valueOnInitialRender);
    const [cursorMovedSinceLastTextChange, setCursorMovedSinceLastTextChange] = useState(false);
    const [rows, setRows] = useState(1);

    // Function to calculate and set rows based on content
    const updateRows = useCallback(
      (value: string) => {
        if (!value) {
          setRows(1);
          return;
        }

        // Count newlines in the text
        const lineCount = (value.match(/\n/g) || []).length + 1;

        // If allowMultipleRows is false, always keep it at 1 row
        if (props.allowMultipleRows === false) {
          setRows(1);
        } else {
          // Otherwise, set rows based on content (with a minimum of 1)
          setRows(Math.max(1, lineCount));
        }
      },
      [props.allowMultipleRows],
    );

    // Update rows when value changes
    useEffect(() => {
      updateRows(props.value || "");
    }, [props.value, updateRows]);

    // // When the editor text changes, we want to reset the `textEditedSinceLastCursorMovement` state.
    // useEffect(() => {
    //   setCursorMovedSinceLastTextChange(false);
    // }, [lastKnownFullEditorText]);

    const initialValue: Descendant[] = useMemo(() => {
      return [
        {
          type: "paragraph",
          children: [{ text: valueOnInitialRender }],
        },
      ];
    }, [valueOnInitialRender]);

    const editor = useCopilotTextareaEditor();

    const { isDisplayed: hoveringEditorIsDisplayed, setIsDisplayed: setHoveringEditorIsDisplayed } =
      useHoveringEditorContext();

    const insertText = useCallback(
      (autosuggestion: AutosuggestionState) => {
        Editor.insertText(editor, autosuggestion.text, {
          at: autosuggestion.point,
        });
      },
      [editor],
    );

    const shouldDisableAutosuggestions =
      // textarea is manually disabled:
      autosuggestionsConfig.disabled ||
      // hovering editor is displayed:
      hoveringEditorIsDisplayed ||
      // the cursor has moved since the last text change AND we are configured to disable autosuggestions in this case:
      (cursorMovedSinceLastTextChange &&
        autosuggestionsConfig.temporarilyDisableWhenMovingCursorWithoutChangingText);

    const {
      currentAutocompleteSuggestion,
      onChangeHandler: onChangeHandlerForAutocomplete,
      onKeyDownHandler: onKeyDownHandlerForAutocomplete,
      onTouchStartHandler: onTouchStartHandlerForAutocomplete,
    } = useAutosuggestions(
      autosuggestionsConfig.debounceTime,
      autosuggestionsConfig.shouldAcceptAutosuggestionOnKeyPress,
      autosuggestionsConfig.shouldAcceptAutosuggestionOnTouch,
      autosuggestionsConfig.apiConfig.autosuggestionsFunction,
      insertText,
      autosuggestionsConfig.disableWhenEmpty,
      shouldDisableAutosuggestions,
      autosuggestionsConfig.showGenerateShortcut,
      autosuggestionsConfig.shortcutKey ?? "k",
      autosuggestionsConfig.language ?? "en",
    );

    const onKeyDownHandlerForHoveringEditor = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          autosuggestionsConfig.shouldToggleHoveringEditorOnKeyPress(
            event,
            autosuggestionsConfig.shortcutKey ?? "k",
          )
        ) {
          event.preventDefault();
          setHoveringEditorIsDisplayed(!hoveringEditorIsDisplayed);
        }
      },
      [
        hoveringEditorIsDisplayed,
        setHoveringEditorIsDisplayed,
        autosuggestionsConfig.shouldToggleHoveringEditorOnKeyPress,
      ],
    );

    // sync autosuggestions state with the editor
    useEffect(() => {
      clearAutocompletionsFromEditor(editor);
      if (currentAutocompleteSuggestion) {
        addAutocompletionsToEditor(
          editor,
          currentAutocompleteSuggestion.text,
          currentAutocompleteSuggestion.point,
        );
      }
    }, [currentAutocompleteSuggestion]);

    const suggestionStyleAugmented: React.CSSProperties = useMemo(() => {
      return {
        fontStyle: "italic",
        color: "gray",
        ...props.suggestionsStyle,
      };
    }, [props.suggestionsStyle]);

    const renderElementMemoized = useMemo(() => {
      return makeRenderElementFunction(suggestionStyleAugmented);
    }, [suggestionStyleAugmented]);

    const renderPlaceholderMemoized = useMemo(() => {
      // For some reason slateJS specifies a top value of 0, which makes for strange styling. We override this here.
      const placeholderStyleSlatejsOverrides: React.CSSProperties = {
        top: undefined,
      };

      const placeholderStyleAugmented: React.CSSProperties = {
        ...placeholderStyleSlatejsOverrides,
        ...props.placeholderStyle,
      };

      return makeRenderPlaceholderFunction(placeholderStyleAugmented);
    }, [props.placeholderStyle]);

    // update the editor text, but only when the value changes from outside the component
    useEffect(() => {
      if (props.value === lastKnownFullEditorText) {
        return;
      }

      setLastKnownFullEditorText(props.value ?? "");
      replaceEditorText(editor, props.value ?? "");
    }, [props.value]);

    // separate into TextareaHTMLAttributes<HTMLDivElement> and CopilotTextareaProps
    const {
      placeholderStyle,
      value,
      hoverMenuClassname,
      onValueChange,
      baseAutosuggestionsConfig: autosuggestionsConfigFromProps,
      className,
      onChange,
      onKeyDown,
      disableBranding,
      decorate,
      renderLeaf,
      editorRef,
      ...propsToForward
    } = props;

    usePopulateCopilotTextareaRef(editor, ref);

    useEffect(() => {
      editorRef?.(editor);
    }, [editor, editorRef]);

    const moddedClassName = (() => {
      const baseClassName = "copilot-textarea";
      const brandingClass = disableBranding ? "no-branding" : "with-branding";
      const defaultTailwindClassName = "bg-white";
      // Set overflow and resize based on allowMultipleRows
      const overflowClass = props.allowMultipleRows ? "overflow-y-auto" : "overflow-hidden";
      const resizeClass = props.allowMultipleRows ? "resize-y" : "resize-none";
      // Add word-wrap and white-space properties to handle long text
      const textWrapClass = "break-words whitespace-pre-wrap";
      const mergedClassName = twMerge(
        `${defaultTailwindClassName} ${overflowClass} ${resizeClass} ${textWrapClass}`,
        className ?? "",
      );
      return `${baseClassName} ${brandingClass} ${mergedClassName}`;
    })();

    return (
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const newEditorState = getTextAroundCollapsedCursor(editor);

          const fullEditorText = newEditorState
            ? newEditorState.textBeforeCursor + newEditorState.textAfterCursor
            : getFullEditorTextWithNewlines(editor); // we don't double-parse the editor. When `newEditorState` is null, we didn't parse the editor yet.

          setLastKnownFullEditorText((prev) => {
            if (prev !== fullEditorText) {
              setCursorMovedSinceLastTextChange(false);
              // Update rows when text changes
              updateRows(fullEditorText);
            }
            return fullEditorText;
          });
          onChangeHandlerForAutocomplete(newEditorState);

          props.onValueChange?.(fullEditorText);
          props.onChange?.(makeSemiFakeReactTextAreaEvent(fullEditorText));
        }}
      >
        <TrackerTextEditedSinceLastCursorMovement
          setCursorMovedSinceLastTextChange={setCursorMovedSinceLastTextChange}
        />
        <HoveringToolbar
          apiConfig={autosuggestionsConfig.apiConfig}
          hoverMenuClassname={hoverMenuClassname}
          language={autosuggestionsConfig.language ?? "en"}
        />
        <Editable
          renderElement={renderElementMemoized}
          renderPlaceholder={renderPlaceholderMemoized}
          decorate={decorate}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            onKeyDownHandlerForHoveringEditor(event); // forward the event for internal use
            onKeyDownHandlerForAutocomplete(event); // forward the event for internal use
            props.onKeyDown?.(event); // forward the event for external use
          }}
          onTouchStart={(event) => {
            onTouchStartHandlerForAutocomplete(event); // forward the event for internal use
          }}
          className={moddedClassName}
          onBlur={(ev) => {
            // clear autocompletion on blur
            props.onBlur?.(ev);
            clearAutocompletionsFromEditor(editor);
          }}
          rows={props.rows ?? rows}
          {...propsToForward}
        />
      </Slate>
    );
  },
);

// Consumers of <textarea> expect a `onChange: (React.ChangeEvent<HTMLTextAreaElement>) => void` event handler to be passed in.
// This is *extremely* common, and we want to support it.
//
// We can't support the full functionality, but in 99% of cases, the consumer only cares about the `event.target.value` property --
// that's how they get the new value of the textarea.
//
// So, the tradeoff we are making is minimizing compiler complaint, with a small chance of runtime error.
// The alternative would be defining a different onChange entrypoint (we actually do have that in `onValueChange`),
// And starting to explain subtleties to users the moment they try to use the component for the first time for very basic functionality.
//
// If this proves problematic, we can always revisit this decision.
function makeSemiFakeReactTextAreaEvent(
  currentText: string,
): React.ChangeEvent<HTMLTextAreaElement> {
  return {
    target: {
      value: currentText,
      type: "copilot-textarea",
    },
    currentTarget: {
      value: currentText,
      type: "copilot-textarea",
    },
  } as React.ChangeEvent<HTMLTextAreaElement>;
}
