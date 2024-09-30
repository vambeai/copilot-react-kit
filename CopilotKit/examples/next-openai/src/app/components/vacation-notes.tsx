import { CopilotTextarea } from "copilot-react-textarea";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

export function VacationNotes() {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    // <Dialog open={isOpen} onOpenChange={setIsOpen}>
    //   <DialogTrigger>
    //     <Button>Open</Button>
    //   </DialogTrigger>
    //   <DialogContent className="mx-auto max-h-[80vh] max-w-xl overflow-y-auto p-6 bg-slate-50">
    //     <DialogTitle>Hola mundo</DialogTitle>
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
                //lolrem ipsum
                controller.enqueue("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
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
    //   </DialogContent>
    // </Dialog>
  );
}

export function VacationNotesDialog() {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent className="mx-auto max-h-[80vh] max-w-xl overflow-y-auto p-6 bg-slate-50">
        <DialogTitle>Hola mundo</DialogTitle>
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
                //lolrem ipsum
                controller.enqueue("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
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
       </DialogContent>
     </Dialog>
  );
}
