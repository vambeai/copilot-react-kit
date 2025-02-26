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

export default function TestUpdatedTextarea() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Updated CopilotTextarea Demo</h1>

      <div className="mb-4">
        <h2 className="text-lg mb-2">
          Single Row Textarea (allowMultipleRows=false)
        </h2>
        <p className="text-gray-600 mb-2">
          This textarea will always remain a single row, regardless of content.
        </p>
        <CopilotTextarea
          textareaPurpose="Testing"
          createSuggestionFunction={mockCreateSuggestion}
          insertionOrEditingFunction={mockInsertionOrEditing}
          value={value1}
          onValueChange={setValue1}
          placeholder="Type something... (will stay as one row)"
          className="border p-2 w-full"
          allowMultipleRows={false}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg mb-2">
          Multi-row Textarea (allowMultipleRows=true)
        </h2>
        <p className="text-gray-600 mb-2">
          This textarea will grow with content as you type.
        </p>
        <CopilotTextarea
          textareaPurpose="Testing"
          createSuggestionFunction={mockCreateSuggestion}
          insertionOrEditingFunction={mockInsertionOrEditing}
          value={value2}
          onValueChange={setValue2}
          placeholder="Type something... (will grow with content)"
          className="border p-2 w-full"
          allowMultipleRows={true}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Values:</h3>
        <div className="mb-2">
          <strong>Single Row:</strong>{" "}
          <span className="font-mono">{value1}</span>
        </div>
        <div>
          <strong>Multi Row:</strong>{" "}
          <pre className="font-mono bg-gray-200 p-2 rounded mt-1">{value2}</pre>
        </div>
      </div>
    </div>
  );
}
