import React from "react";
import { useMakeStandardAutosuggestionFunction } from "../../hooks/make-autosuggestions-function/use-make-standard-autosuggestions-function";
import { HTMLCopilotTextAreaElement } from "../../types";
import { BaseCopilotTextareaProps } from "../../types/base/base-copilot-textarea-props";
import { BaseCopilotTextarea } from "../base-copilot-textarea/base-copilot-textarea";

// Like the base copilot textarea props,
// but with baseAutosuggestionsConfig replaced with autosuggestionsConfig.
export interface CopilotTextareaProps
  extends Omit<BaseCopilotTextareaProps, "baseAutosuggestionsConfig"> {
  /**
   * The purpose of the textarea, used to guide autosuggestions.
   */
  textareaPurpose: string;

  /**
   * Function to create suggestions.
   */
  createSuggestionFunction: (...args: any[]) => Promise<string>;

  /**
   * Function for insertion or editing.
   */
  insertionOrEditingFunction: (...args: any[]) => Promise<ReadableStream<string>>;

  /**
   * Debounce time for autosuggestions.
   */
  debounceTime?: number;

  /**
   * Whether to disable autosuggestions when the textarea is empty.
   */
  disableWhenEmpty?: boolean;

  /**
   * Whether to show the generate shortcut.
   */
  showGenerateShortcut?: boolean;

  /**
   * The shortcut key to use.
   */
  shortcutKey?: string;

  /**
   * The language to use for autosuggestions.
   */
  language?: "en" | "es";

  /**
   * Determines whether the textarea should allow multiple rows based on content.
   * If false (default), the textarea will always stay as a single row regardless of content.
   * If true, the textarea will grow with content based on the number of lines.
   * Default is `false`.
   */
  allowMultipleRows?: boolean;
}

export const CopilotTextarea = React.forwardRef(
  (props: CopilotTextareaProps, ref: React.Ref<HTMLCopilotTextAreaElement>) => {
    const {
      createSuggestionFunction,
      insertionOrEditingFunction,
      textareaPurpose,
      debounceTime,
      disableWhenEmpty,
      showGenerateShortcut,
      shortcutKey,
      language,
      ...forwardedProps
    } = props;

    const autosuggestionsFunction = useMakeStandardAutosuggestionFunction(createSuggestionFunction);

    return (
      <>
        <BaseCopilotTextarea
          ref={ref}
          {...forwardedProps}
          baseAutosuggestionsConfig={{
            debounceTime,
            disableWhenEmpty,
            textareaPurpose,
            showGenerateShortcut,
            shortcutKey,
            language,
            apiConfig: {
              autosuggestionsFunction: autosuggestionsFunction,
              insertionOrEditingFunction: insertionOrEditingFunction,
            },
          }}
        />
      </>
    );
  },
);
