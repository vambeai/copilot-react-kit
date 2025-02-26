import React, { useState } from "react";
import { CopilotTextarea } from "./CopilotKit/packages/react-textarea/src/components/copilot-textarea/copilot-textarea";

// Mock functions for testing
const mockCreateSuggestion = async () => "suggestion";
const mockInsertionOrEditing = async () =>
  new ReadableStream({
    start(controller) {
      controller.close();
    },
  });

export default function TestTextarea() {
  const [value, setValue] = useState("");

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Textarea Test</h1>

      <div className="mb-4">
        <h2 className="text-lg mb-2">
          Default Textarea (should be 1 row by default)
        </h2>
        <CopilotTextarea
          textareaPurpose="Testing"
          createSuggestionFunction={mockCreateSuggestion}
          insertionOrEditingFunction={mockInsertionOrEditing}
          value={value}
          onValueChange={setValue}
          placeholder="Type something..."
          className="border p-2 w-full"
          rows={1} // Setting to 1 row
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg mb-2">
          Multi-row Textarea (with allowMultipleRows=true)
        </h2>
        <CopilotTextarea
          textareaPurpose="Testing"
          createSuggestionFunction={mockCreateSuggestion}
          insertionOrEditingFunction={mockInsertionOrEditing}
          value={value}
          onValueChange={setValue}
          placeholder="Type something..."
          className="border p-2 w-full"
          rows={3} // Setting to 3 rows
        />
      </div>
    </div>
  );
}
