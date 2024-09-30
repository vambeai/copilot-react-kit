"use client"; // need use client to use useRef
import {
  CopilotKit,
  DocumentPointer,
  useCopilotReadable,
  useMakeCopilotDocumentReadable,
} from "@copilotkit/react-core";
import { CopilotTextarea, HTMLCopilotTextAreaElement } from "copilot-react-textarea";
import { useRef } from "react";
import { useStateWithLocalStorage } from "../utils";

export default function CopilotTextareaDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <TextAreas />
    </CopilotKit>
  );
}

const clientTranscriptSummaryDocument: DocumentPointer = {
  id: "clientTranscriptSummary",
  name: "Client Call Gong Transcript",
  sourceApplication: "Gong",
  iconImageUri: "https://asset.brandfetch.io/idHyhmcKvT/idRu6db2HA.jpeg?updated=1690987844207",
  getContents: () => {
    return "This is the client transcript summary";
  },
};

function TextAreas() {
  const [detailsText, setDetailsText] = useStateWithLocalStorage("", "cacheKey_detailsText");
  const [copilotText, setCopilotText] = useStateWithLocalStorage("", "cacheKey_copilotText");

  const [textareaPurpose, setTextareaPurpose] = useStateWithLocalStorage(
    "A COOL & SMOOTH announcement post about CopilotTextarea. No pomp, no fluff, no BS. Just the facts. Be brief, be clear, be concise. Be cool.",
    "cacheKey_textareaPurpose",
  );

  const salesReplyCategoryId = "sales_reply";
  useCopilotReadable({
    description: "Details Text",
    value: detailsText,
    categories: [salesReplyCategoryId],
  });

  const copilotTextareaRef = useRef<HTMLCopilotTextAreaElement>(null);

  useMakeCopilotDocumentReadable(clientTranscriptSummaryDocument, [salesReplyCategoryId], []);

  return (
    <div className="w-full h-full gap-10 flex flex-col items-center p-10">
      <div className="flex w-1/2 items-start gap-3">
        <span className="text-3xl text-white whitespace-nowrap">Textarea Purpos matiassse:</span>
        <textarea
          className="p-2 h-12 rounded-lg flex-grow overflow-x-auto overflow-y-hidden whitespace-nowrap"
          value={textareaPurpose}
          onChange={(event) => setTextareaPurpose(event.target.value)}
        />
      </div>
      <CopilotTextarea
        value={copilotText}
        ref={copilotTextareaRef}
        onChange={(event) => setCopilotText(event.target.value)}
        className="p-4 w-1/2 aspect-square font-bold text-3xl bg-slate-800 text-white rounded-lg resize-none"
        placeholderStyle={{
          color: "white",
          opacity: 0.5,
        }}
        textareaPurpose={textareaPurpose}
        createSuggestionFunction={async (editorState: any): Promise<string> => {
          console.log("editorState", editorState);
          const lastWord = editorState.textBeforeCursor.split(" ").pop() || "";
          const suggestions: { [key: string]: string } = {
            Hello: " world",
            CopilotTextarea: " is awesome",
            The: " quick brown fox",
            AI: " is revolutionizing",
          };
          return suggestions[lastWord] || ` ${lastWord}...`;
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
        //debounceTime: 250,
      />

      <textarea
        className="p-4 w-1/2 h-80 rounded-lg"
        value={detailsText}
        placeholder="the normal textarea"
        onChange={(event) => setDetailsText(event.target.value)}
      />

      <button
        className="p-4 w-1/2 bg-slate-800 text-white rounded-lg"
        onClick={() => {
          if (copilotTextareaRef.current) {
            copilotTextareaRef.current.focus();
          }
        }}
      >
        Focus CopilotTextarea
      </button>
    </div>
  );
}
