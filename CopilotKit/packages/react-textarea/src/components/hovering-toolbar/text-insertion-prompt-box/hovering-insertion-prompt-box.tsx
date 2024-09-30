import {
  EditingEditorState,
  InsertionEditorApiConfig,
} from "../../../types/base/autosuggestions-bare-function";
import { HoveringInsertionPromptBoxCore } from "./hovering-insertion-prompt-box-core";

export interface Props {
  editorState: EditingEditorState;
  apiConfig: InsertionEditorApiConfig;
  performInsertion: (insertedText: string) => void;
  language: "en" | "es";
  closeWindow: () => void;
}

export const HoveringInsertionPromptBox = (props: Props) => {
  return (
    <HoveringInsertionPromptBoxCore
      state={{
        editorState: props.editorState,
      }}
      language={props.language}
      insertionOrEditingFunction={props.apiConfig.insertionOrEditingFunction}
      performInsertion={props.performInsertion}
    />
  );
};
