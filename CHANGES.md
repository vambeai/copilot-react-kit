# CopilotTextarea Auto-Resize Feature

## Overview

The CopilotTextarea component has been enhanced with auto-resize functionality. By default, it now has only one row and will stay as a single row regardless of content. However, if the `allowMultipleRows` prop is set to `true`, it will resize to fit the content based on the number of lines.

## Changes Made

1. Added a new `allowMultipleRows` prop to the `BaseCopilotTextareaProps` interface
2. Added the same prop to the `CopilotTextareaProps` interface
3. Implemented auto-resize functionality in the `BaseCopilotTextarea` component:
   - Added state to track the number of rows
   - Added logic to calculate rows based on content and the `allowMultipleRows` prop
   - Updated the style properties based on the `allowMultipleRows` prop
   - Updated the rows prop to use the calculated rows value

## Usage

```jsx
// Single row textarea (default)
<CopilotTextarea
  textareaPurpose="Your purpose"
  createSuggestionFunction={yourFunction}
  insertionOrEditingFunction={yourFunction}
  value={value}
  onValueChange={setValue}
  // allowMultipleRows is false by default, so it will stay as one row
/>

// Multi-row textarea
<CopilotTextarea
  textareaPurpose="Your purpose"
  createSuggestionFunction={yourFunction}
  insertionOrEditingFunction={yourFunction}
  value={value}
  onValueChange={setValue}
  allowMultipleRows={true} // This will allow the textarea to grow with content
/>
```

## Files Modified

1. `CopilotKit/packages/react-textarea/src/types/base/base-copilot-textarea-props.tsx`

   - Added the `allowMultipleRows` prop to the `BaseCopilotTextareaProps` interface

2. `CopilotKit/packages/react-textarea/src/components/base-copilot-textarea/base-copilot-textarea.tsx`

   - Added state to track the number of rows
   - Added logic to calculate rows based on content and the `allowMultipleRows` prop
   - Updated the style properties based on the `allowMultipleRows` prop
   - Updated the rows prop to use the calculated rows value

3. `CopilotKit/packages/react-textarea/src/components/copilot-textarea/copilot-textarea.tsx`
   - Added the `allowMultipleRows` prop to the `CopilotTextareaProps` interface

## Testing

A test component has been created to demonstrate the functionality:

- `test-updated-textarea.jsx` - Shows both single row and multi-row textareas

## Benefits

1. **Improved User Experience**: The textarea now adapts to the content, making it easier for users to see what they're typing without having to scroll.
2. **Flexibility**: Developers can choose whether they want a fixed single-row textarea or a multi-row textarea that grows with content.
3. **Consistency**: The default behavior (single row) ensures that the textarea takes up minimal space by default, which is often desirable in UI design.
