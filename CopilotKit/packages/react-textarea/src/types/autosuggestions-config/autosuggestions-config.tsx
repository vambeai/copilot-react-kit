import { BaseAutosuggestionsConfig, defaultBaseAutosuggestionsConfig } from "../base";
import { InsertionEditorState } from "../base/autosuggestions-bare-function";

export interface AutosuggestionsConfig extends Omit<BaseAutosuggestionsConfig, "apiConfig"> {
  createSuggestion: (editorState: InsertionEditorState) => string | Promise<string>;
}

export const defaultAutosuggestionsConfig: Omit<
  AutosuggestionsConfig,
  "textareaPurpose" | "createSuggestion"
> = {
  ...defaultBaseAutosuggestionsConfig,
};
