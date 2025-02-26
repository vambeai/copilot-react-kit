# Auto-Resize CopilotTextarea

This component extends the CopilotTextarea component from CopilotKit with auto-resize functionality.

## Features

- By default has only one row
- Auto-fits the text content
- Only resizes to more than one row if the `allowMultipleRows` prop is set to `true`

## Implementation

The `AutoResizeCopilotTextarea` component wraps the original `CopilotTextarea` component and adds the following functionality:

1. Tracks the number of lines in the text content
2. Adjusts the number of rows based on the content and the `allowMultipleRows` prop
3. Controls the resize and overflow behavior based on the `allowMultipleRows` prop

## Usage

```jsx
import { AutoResizeCopilotTextarea } from './path/to/auto-resize-textarea';

// Example usage with single row (default)
<AutoResizeCopilotTextarea
  textareaPurpose="Your purpose here"
  createSuggestionFunction={yourCreateSuggestionFunction}
  insertionOrEditingFunction={yourInsertionOrEditingFunction}
  value={value}
  onValueChange={setValue}
  placeholder="Type something..."
  className="your-custom-class"
  // allowMultipleRows is false by default, so it will stay as one row
/>

// Example usage with multiple rows
<AutoResizeCopilotTextarea
  textareaPurpose="Your purpose here"
  createSuggestionFunction={yourCreateSuggestionFunction}
  insertionOrEditingFunction={yourInsertionOrEditingFunction}
  value={value}
  onValueChange={setValue}
  placeholder="Type something..."
  className="your-custom-class"
  allowMultipleRows={true} // This will allow the textarea to grow with content
/>
```

## Props

The component accepts all props from the original `CopilotTextarea` component, plus:

| Prop                | Type    | Default | Description                                                               |
| ------------------- | ------- | ------- | ------------------------------------------------------------------------- |
| `allowMultipleRows` | boolean | `false` | Whether to allow the textarea to resize to multiple rows based on content |

## Styling

You can add custom styling to the component using the `className` and `style` props. The component also adds an `auto-resize-textarea` class that you can target for additional styling.

For optimal appearance, you may want to add some CSS:

```css
.auto-resize-textarea {
  min-height: 38px;
  transition: height 0.2s ease;
}
```

## Demo

The repository includes several demo files:

1. `demo.html` - A simple HTML demo with vanilla JavaScript
2. `index.html` - A React demo using CDN links
3. `auto-resize-textarea.jsx` - A React component demo
4. `auto-resize-copilot-textarea.jsx` - A demo specifically for the CopilotKit integration
5. `final-auto-resize-textarea.jsx` - The final implementation with example usage

To see the demos in action, open the HTML files in a browser or integrate the component into your React application.
