import { TextareaHTMLAttributes } from "react";
import { Editable } from "slate-react";
import { BaseAutosuggestionsConfig } from ".";
import { BaseCopilotTextareaApiConfig } from "./autosuggestions-bare-function";
import { CustomEditor } from "./custom-editor";

type EditableProps = React.ComponentProps<typeof Editable>;

/**
 * `BaseCopilotTextareaProps` defines the properties for the `BaseCopilotTextarea` component.
 */
export interface BaseCopilotTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange" | "onKeyDown"> {
  /**
   * Determines whether the textarea should allow multiple rows based on content.
   * If false (default), the textarea will always stay as a single row regardless of content.
   * If true, the textarea will grow with content based on the number of lines.
   * Default is `false`.
   */
  allowMultipleRows?: boolean;
  /**
   * Determines whether the CopilotKit branding should be disabled. Default is `false`.
   */
  disableBranding?: boolean;

  /**
   * Specifies the CSS styles to apply to the placeholder text.
   */
  placeholderStyle?: React.CSSProperties;

  /**
   * Specifies the CSS styles to apply to the suggestions list.
   */
  suggestionsStyle?: React.CSSProperties;

  /**
   * A class name to apply to the editor popover window.
   */
  hoverMenuClassname?: string;

  /**
   * The initial value of the textarea. Can be controlled via `onValueChange`.
   */
  value?: string;

  /**
   * Callback invoked when the value of the textarea changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Callback invoked when a `change` event is triggered on the textarea element.
   */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /**
   * The shortcut to use to open the editor popover window. Default is `"Cmd-k"`.
   */
  shortcut?: string;

  /**
   * Callback invoked when a `keydown` event is triggered on the textarea element.
   */
  onKeyDown?: (
    event: Partial<React.KeyboardEvent<HTMLTextAreaElement>> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;

  /**
   * Configuration settings for the autosuggestions feature.
   * Includes a mandatory `textareaPurpose` to guide the autosuggestions.
   */
  baseAutosuggestionsConfig: Partial<BaseAutosuggestionsConfig> & {
    textareaPurpose: string;
    apiConfig: BaseCopilotTextareaApiConfig;
  };

  /**
   * Slate `decorate` function forwarded to the underlying `Editable`.
   * Allows consumers to attach ephemeral ranges (e.g. spellcheck underlines)
   * without modifying the document.
   */
  decorate?: EditableProps["decorate"];

  /**
   * Slate `renderLeaf` function forwarded to the underlying `Editable`.
   * Allows consumers to render decorated ranges produced by `decorate`.
   */
  renderLeaf?: EditableProps["renderLeaf"];

  /**
   * Callback invoked with the underlying Slate editor instance on mount,
   * and again if the callback identity changes — memoize it. Called with
   * `null` on unmount so consumers can drop their reference.
   * Allows consumers to apply programmatic edits (e.g. Transforms).
   */
  editorRef?: (editor: CustomEditor | null) => void;
}
