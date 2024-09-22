import { useCallback } from "react";
import { AutosuggestionsBareFunction } from "../../types";
import { InsertionEditorState } from "../../types/base/autosuggestions-bare-function";

/**
 * Returns a memoized function that uses the provided createSuggestion function to generate an autosuggestion for the user's input.
 * The function takes in the text before and after the cursor, and an abort signal.
 * It calls the createSuggestion function with the editor state and returns the result.
 *
 * @param createSuggestion - A function that takes an InsertionEditorState and returns a string suggestion.
 * @returns A memoized function that generates an autosuggestion for the user's input.
 */
export function useMakeStandardAutosuggestionFunction(
  createSuggestion: (editorState: InsertionEditorState) => Promise<string>,
): AutosuggestionsBareFunction {
  return useCallback(
    async (editorState: InsertionEditorState, abortSignal: AbortSignal): Promise<string> => {
      try {
        if (abortSignal.aborted) {
          return "";
        }

        if (typeof createSuggestion !== "function") {
          console.error(
            "createSuggestion is not a function. Received type:",
            typeof createSuggestion,
          );
          throw new TypeError("createSuggestion is not a function");
        }

        const suggestion = await createSuggestion(editorState);

        if (abortSignal.aborted) {
          return "";
        }

        return suggestion;
      } catch (error) {
        console.error("Error generating suggestion:", error);
        return "";
      }
    },
    [createSuggestion],
  );
}
