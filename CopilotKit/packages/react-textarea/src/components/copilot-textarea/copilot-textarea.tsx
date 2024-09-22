import React from "react";
import { useMakeStandardAutosuggestionFunction } from "../../hooks/make-autosuggestions-function/use-make-standard-autosuggestions-function";
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
  debounceTime?: number;
  disableWhenEmpty?: boolean;
}

export const CopilotTextarea = React.forwardRef(
  (props: CopilotTextareaProps, ref: React.Ref<HTMLCopilotTextAreaElement>) => {
    const {
      createSuggestionFunction,
      insertionOrEditingFunction,
      textareaPurpose,
      debounceTime,
      disableWhenEmpty,
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
