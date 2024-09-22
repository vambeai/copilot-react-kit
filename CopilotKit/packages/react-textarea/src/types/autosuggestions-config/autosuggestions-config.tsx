import { defaultCopilotContextCategories } from "@copilotkit/react-core";
import { BaseAutosuggestionsConfig, defaultBaseAutosuggestionsConfig } from "../base";
import { InsertionEditorState } from "../base/autosuggestions-bare-function";
import { EditingApiConfig, defaultEditingApiConfig } from "./editing-api-config";
import { InsertionsApiConfig, defaultInsertionsApiConfig } from "./insertions-api-config";

export interface AutosuggestionsConfig extends Omit<BaseAutosuggestionsConfig, "apiConfig"> {
  contextCategories: string[];
  createSuggestion: (editorState: InsertionEditorState) => string | Promise<string>;
  chatApiConfigs: {
    insertionApiConfig: InsertionsApiConfig;
    editingApiConfig: EditingApiConfig;
  };
}

export const defaultAutosuggestionsConfig: Omit<
  AutosuggestionsConfig,
  "textareaPurpose" | "createSuggestion"
> = {
  ...defaultBaseAutosuggestionsConfig,
  contextCategories: defaultCopilotContextCategories,
  chatApiConfigs: {
    insertionApiConfig: defaultInsertionsApiConfig,
    editingApiConfig: defaultEditingApiConfig,
  },
};
