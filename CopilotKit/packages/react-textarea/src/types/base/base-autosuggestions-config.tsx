import { BaseCopilotTextareaApiConfig } from "./autosuggestions-bare-function";

/**
 * @interface BaseAutosuggestionsConfig
 *
 * @property {string} textareaPurpose - The purpose of the textarea. This is used to guide the autosuggestions.
 *
 * @property {string[]} contextCategories - The categories of context to consider when providing autosuggestions.
 *
 * @property {number} debounceTime - The amount of time (in milliseconds) to wait before triggering autosuggestions after the user has stopped typing.
 *
 * @property {BaseCopilotTextareaApiConfig} apiConfig - The configuration for the API that provides the autosuggestions.
 *
 * @property {boolean} disableWhenEmpty - Whether to disable autosuggestions when the textarea is empty.
 *
 * @property {boolean} disabled - Whether to disable autosuggestions entirely.
 *
 * @property {boolean} temporarilyDisableWhenMovingCursorWithoutChangingText - Whether to temporarily disable autosuggestions when the user moves the cursor without changing the text.
 *
 * @property {(event: React.KeyboardEvent<HTMLDivElement>) => boolean} shouldAcceptAutosuggestionOnKeyPress - A function that determines whether to accept the current autosuggestion based on a key press event. By default, the Tab key is used to accept the autosuggestion. Example code:
 *
 * ```typescript
 * const defaultShouldAcceptAutosuggestionOnKeyPress =  (event: React.KeyboardEvent<HTMLDivElement>) => {
 *   // if tab, accept the autosuggestion
 *   if (event.key === "Tab") {
 *     return true;
 *   }
 *   return false;
 * }
 * ```
 *
 * @property {(event: React.TouchEvent<HTMLDivElement>) => boolean} shouldAcceptAutosuggestionOnTouch - A function that determines whether to accept the current autosuggestion based on a mobile touch event. By default, the touching the end of a suggestion will accept it. Example code:
 *
 * ```typescript
 * const shouldAcceptAutosuggestionOnTouch =  (event: React.TouchEvent<HTMLDivElement>) => {
 *   // if tab, accept the autosuggestion
 *   if (event.type === "touchstart") {
 *     return true;
 *   }
 *   return false;
 * }
 * ```
 *
 * @property {(event: React.KeyboardEvent<HTMLDivElement>) => boolean} shouldToggleHoveringEditorOnKeyPress - A function that determines whether to toggle the hovering editor based on a key press event. By default, the Command + K key combination is used to toggle the hovering editor. Example code:
 *
 * ```typescript
 * const defaultShouldToggleHoveringEditorOnKeyPress =  (event: React.KeyboardEvent<HTMLDivElement>) => {
 *   // if command-k, toggle the hovering editor
 *   if (event.key === "k" && event.metaKey) {
 *     return true;
 *   }
 *   return false;
 * }
 * ```
 */
export interface BaseAutosuggestionsConfig {
  textareaPurpose: string;
  debounceTime: number;
  apiConfig: BaseCopilotTextareaApiConfig;
  showGenerateShortcut: boolean;
  shortcutKey: string;
  language: "en" | "es";

  disableWhenEmpty: boolean;
  disabled: boolean;
  temporarilyDisableWhenMovingCursorWithoutChangingText: boolean;
  shouldAcceptAutosuggestionOnKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
  shouldAcceptAutosuggestionOnTouch: (event: React.TouchEvent<HTMLDivElement>) => boolean;
  shouldToggleHoveringEditorOnKeyPress: (
    event: React.KeyboardEvent<HTMLDivElement>,
    shortcut: string,
  ) => boolean;
}

// by default, command-k toggles the hovering editor
const defaultShouldToggleHoveringEditorOnKeyPress = (
  event: React.KeyboardEvent<HTMLDivElement>,
  shortcut: string,
) => {
  // if command-k, toggle the hovering editor
  if (event.key === shortcut && event.metaKey) {
    return true;
  }
  return false;
};

const defaultShouldAcceptAutosuggestionOnKeyPress = (
  event: React.KeyboardEvent<HTMLDivElement>,
) => {
  // if tab, accept the autosuggestion
  if (event.key === "Tab") {
    return true;
  }
  return false;
};

const defaultShouldAcceptAutosuggestionOnTouch = () => false;

/**
 * Default configuration for the BaseAutosuggestions.
 *
 * @property {number} debounceTime - The amount of time to wait before triggering the autosuggestions API call.
 * @property {string[]} contextCategories - The categories to use for context when making the autosuggestions API call.
 * @property {boolean} disableWhenEmpty - Whether to disable the autosuggestions when the textarea is empty.
 * @property {boolean} disabled - Whether to disable the autosuggestions feature entirely.
 * @property {boolean} temporarilyDisableWhenMovingCursorWithoutChangingText - Whether to temporarily disable the autosuggestions when the cursor is moved without changing the text.
 * @property {(event: React.KeyboardEvent<HTMLDivElement>) => boolean} shouldToggleHoveringEditorOnKeyPress - A function that determines whether to toggle the hovering editor based on a key press event.
 * @property {(event: React.KeyboardEvent<HTMLDivElement>) => boolean} shouldAcceptAutosuggestionOnKeyPress - A function that determines whether to accept the autosuggestion based on a key press event.
 * @property {() => boolean} defaultShouldAcceptAutosuggestionOnTouch - A function that determines whether to accept the autosuggestion based on a mobile touch event.
 */

export const defaultBaseAutosuggestionsConfig: Omit<
  BaseAutosuggestionsConfig,
  "textareaPurpose" | "apiConfig"
> = {
  debounceTime: 250,
  disableWhenEmpty: true,
  disabled: false,
  showGenerateShortcut: true,
  shortcutKey: "k",
  language: "en",
  temporarilyDisableWhenMovingCursorWithoutChangingText: true,
  shouldToggleHoveringEditorOnKeyPress: defaultShouldToggleHoveringEditorOnKeyPress,
  shouldAcceptAutosuggestionOnKeyPress: defaultShouldAcceptAutosuggestionOnKeyPress,
  shouldAcceptAutosuggestionOnTouch: defaultShouldAcceptAutosuggestionOnTouch,
};
