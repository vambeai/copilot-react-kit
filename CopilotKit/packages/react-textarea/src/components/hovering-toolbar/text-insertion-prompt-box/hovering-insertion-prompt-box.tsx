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
    <div
      className="flex flex-col justify-center items-center space-y-4 rounded-md border shadow-lg p-4 border-gray- bg-white"
      style={{ width: "35rem" }}
      onClick={(e) => e.stopPropagation()} // Prevent click event from propagating
    >
      <HoveringInsertionPromptBoxCore
        state={{
          editorState: props.editorState,
        }}
        language={props.language}
        insertionOrEditingFunction={props.apiConfig.insertionOrEditingFunction}
        performInsertion={props.performInsertion}
      />
    </div>
  );
};
