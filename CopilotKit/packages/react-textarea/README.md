# CopilotTextarea

CopilotTextarea is a React component that provides an AI-powered textarea with autocompletion functionality. It's a fork of CopilotKit, designed to allow for more flexible and custom implementations without being tied to a specific cloud solution.

## Installation

To install CopilotTextarea, run the following command:

```bash
npm install copilot-react-textarea
```

or if you're using yarn:

```bash
yarn add copilot-react-textarea
```

## Usage

Here's an example of how to use the CopilotTextarea component:

```tsx
import { CopilotTextarea } from "copilot-react-textarea";
import { useState, type ChangeEvent } from "react";

function YourComponent() {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <CopilotTextarea
      placeholder="Enter text here..."
      className="min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      rows={5}
      cols={50}
      onChange={handleChange}
      value={value}
      textareaPurpose="chat"
      createSuggestionFunction={async (data: {
        textAfterCursor: string;
        textBeforeCursor: string;
      }): Promise<string> => {
        // Implement your autocomplete logic here
        return "Autocomplete suggestion";
      }}
      insertionOrEditingFunction={async (editorState: any): Promise<ReadableStream<string>> => {
        // Implement your insertion or editing logic here
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue("Inserted text");
            controller.close();
          },
        });
        return stream;
      }}
      onKeyDown={(event) => {
        // Handle key down events
      }}
      disableWhenEmpty={true}
    />
  );
}
```

## Props

The `CopilotTextarea` component accepts the following props:

- `placeholder`: Placeholder text for the textarea
- `className`: CSS class for styling the textarea
- `rows`: Number of visible text lines
- `cols`: Visible width of the textarea
- `onChange`: Function to handle changes in the textarea
- `value`: Current value of the textarea
- `textareaPurpose`: Purpose of the textarea (e.g., "chat")
- `createSuggestionFunction`: Async function to generate autocomplete suggestions
- `insertionOrEditingFunction`: Async function to handle text insertion or editing
- `onKeyDown`: Function to handle keydown events
- `disableWhenEmpty`: Boolean to disable the textarea when empty

## Features

- AI-powered autocompletion
- Customizable styling
- Flexible autocomplete and text insertion functions
- Key event handling

## Motivation

CopilotTextarea is a fork of CopilotKit, created with the motivation to provide more flexibility in custom implementations. The original CopilotKit was tightly coupled with their cloud solution, which limited its use in projects that required custom backend integrations or self-hosted solutions.

By forking the project, we've made it possible to use these open-source components with your own implementation of autocomplete and text generation functions. This allows developers to integrate CopilotTextarea with their preferred AI services or custom backend solutions without being locked into a specific cloud provider.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
