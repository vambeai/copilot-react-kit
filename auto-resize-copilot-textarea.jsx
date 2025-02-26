import React, { useEffect, useRef, useState } from "react";
import { CopilotTextarea } from "./CopilotKit/packages/react-textarea/src/components/copilot-textarea/copilot-textarea";

/**
 * AutoResizeCopilotTextarea component that extends CopilotTextarea with auto-resize functionality
 *
 * @param {Object} props - Component props
 * @param {boolean} props.allowMultipleRows - Whether to allow the textarea to resize to multiple rows (default: false)
 * @param {React.Ref} ref - Forwarded ref
 */
export const AutoResizeCopilotTextarea = React.forwardRef(
  ({ allowMultipleRows = false, ...props }, ref) => {
    const [rows, setRows] = useState(1);
    const textareaRef = useRef(null);

    // Combine refs
    const setRefs = (element) => {
      textareaRef.current = element;
      if (ref) {
        if (typeof ref === "function") {
          ref(element);
        } else {
          ref.current = element;
        }
      }
    };

    // Function to calculate and set rows based on content
    const updateRows = (value) => {
      if (!value) {
        setRows(1);
        return;
      }

      // Count newlines in the text
      const lineCount = (value.match(/\n/g) || []).length + 1;

      // If allowMultipleRows is false, always keep it at 1 row
      if (!allowMultipleRows) {
        setRows(1);
      } else {
        // Otherwise, set rows based on content (with a minimum of 1)
        setRows(Math.max(1, lineCount));
      }
    };

    // Update rows when value changes
    useEffect(() => {
      updateRows(props.value);
    }, [props.value]);

    // Handle value change
    const handleValueChange = (value) => {
      updateRows(value);
      if (props.onValueChange) {
        props.onValueChange(value);
      }
    };

    return (
      <CopilotTextarea
        {...props}
        ref={setRefs}
        rows={rows}
        onValueChange={handleValueChange}
        className={`auto-resize-textarea ${props.className || ""}`}
        style={{
          resize: allowMultipleRows ? "vertical" : "none",
          overflow: allowMultipleRows ? "auto" : "hidden",
          ...props.style,
        }}
      />
    );
  }
);

// Example usage
export default function AutoResizeCopilotTextareaExample() {
  // Mock functions for testing
  const mockCreateSuggestion = async () => "suggestion";
  const mockInsertionOrEditing = async () =>
    new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Auto-Resize CopilotTextarea Demo</h1>

      <div className="mb-4">
        <h2 className="text-lg mb-2">
          Single Row Textarea (allowMultipleRows=false)
        </h2>
        <p className="text-gray-600 mb-2">
          This textarea will always remain a single row, regardless of content.
        </p>
        <AutoResizeCopilotTextarea
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
        <AutoResizeCopilotTextarea
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
    </div>
  );
}
