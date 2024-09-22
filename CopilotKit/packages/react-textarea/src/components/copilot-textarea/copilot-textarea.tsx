import React, { useEffect } from "react";
import { useMakeStandardAutosuggestionFunction } from "../../hooks/make-autosuggestions-function/use-make-standard-autosuggestions-function";
import { useMakeStandardInsertionOrEditingFunction } from "../../hooks/make-autosuggestions-function/use-make-standard-insertion-function";
import { HTMLCopilotTextAreaElement } from "../../types";
import { BaseCopilotTextareaProps } from "../../types/base/base-copilot-textarea-props";
import { BaseCopilotTextarea } from "../base-copilot-textarea/base-copilot-textarea";

// Like the base copilot textarea props,
// but with baseAutosuggestionsConfig replaced with autosuggestionsConfig.
export interface CopilotTextareaProps
  extends Omit<BaseCopilotTextareaProps, "baseAutosuggestionsConfig"> {
  textareaPurpose: string;
  createSuggestionFunction: (...args: any[]) => Promise<string>;
  insertionOrEditingFunction: (...args: any[]) => Promise<ReadableStream<string>>;
}

export const CopilotTextarea = React.forwardRef(
  (props: CopilotTextareaProps, ref: React.Ref<HTMLCopilotTextAreaElement>) => {
    const {
      createSuggestionFunction,
      insertionOrEditingFunction,
      textareaPurpose,
      ...forwardedProps
    } = props;

    console.log("CopilotTextarea: Full props", props);
    console.log("CopilotTextarea: createSuggestionFunction", createSuggestionFunction);
    console.log("CopilotTextarea: insertionOrEditingFunction", insertionOrEditingFunction);

    useEffect(() => {
      console.log(
        "CopilotTextarea: useEffect - createSuggestionFunction",
        createSuggestionFunction,
      );
      console.log(
        "CopilotTextarea: useEffect - insertionOrEditingFunction",
        insertionOrEditingFunction,
      );
    }, [createSuggestionFunction, insertionOrEditingFunction]);

    const autosuggestionsFunction = useMakeStandardAutosuggestionFunction(createSuggestionFunction);

    console.log("CopilotTextarea: autosuggestionsFunction", autosuggestionsFunction);

    if (!createSuggestionFunction || !insertionOrEditingFunction) {
      console.log("CopilotTextarea: Required functions are not available yet");
      return null; // or return a loading state
    }

    return (
      <>
        <BaseCopilotTextarea
          ref={ref}
          {...forwardedProps}
          baseAutosuggestionsConfig={{
            textareaPurpose,
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
