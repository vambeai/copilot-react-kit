import { CopilotTextarea } from "copilot-react-textarea";
import { useState } from "react";

export function VacationNotes() {
  const [text, setText] = useState("");

  return (
    <>
      <CopilotTextarea
        className="px-4 py-4"
        value={text}
        onValueChange={(value: string) => setText(value)}
        placeholder="What are your plans for your vacation?"
        textareaPurpose="Travel notes from the user's previous vacations. Likely written in a colloquial style, but adjust as needed."
        createSuggestionFunction={async (editorState: any): Promise<string> => {
          const lastWord = editorState.textBeforeCursor.split(" ").pop() || "";
          const suggestions: { [key: string]: string } = {
            Hello: " world",
            CopilotTextarea: " is awesome",
            The: " quick brown fox",
            AI: " is revolutionizing",
          };
          // set a timeout to simulate a slow API call
          return new Promise((resolve) =>
            setTimeout(() => {
              resolve(suggestions[lastWord] || ` ${lastWord}...`);
            }, 10000),
          );
        }}
        insertionOrEditingFunction={async (editorState: any): Promise<ReadableStream<string>> => {
          console.log("insertionOrEditingFunction", editorState);
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue("Hello world");
              controller.close();
            },
          });
          return stream;
        }}
        //shortcutKey="k"
        showGenerateShortcut={true}
        language="es"
        // I want to be able to accept this props on the future
        //debounceTime={250}
        //disableWhenEmpty={true}
        //// Accept on tab is the default behavior, but we can override it if we wanted to, as so:
        //shouldAcceptAutosuggestionOnKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
        //  // if tab, accept the autosuggestion
        //  if (event.key === "Tab") {
        //    return true;
        //  }
        //  return false;
        //}}
      />
    </>
  );
}
