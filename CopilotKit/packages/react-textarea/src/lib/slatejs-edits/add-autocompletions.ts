import { BasePoint, Point, Range, Transforms } from "slate";
import { CustomEditor } from "../../types/base/custom-editor";

export function addAutocompletionsToEditor(
  editor: CustomEditor,
  newSuggestion: string,
  point: BasePoint,
) {
  const editorPosition = editor.selection;

  // the suggestion is stale if the cursor moved since it was requested
  if (
    !editorPosition ||
    !Range.isCollapsed(editorPosition) ||
    !Point.equals(editorPosition.anchor, point)
  ) {
    return;
  }

  Transforms.insertNodes(
    editor,
    [
      {
        type: "suggestion",
        inline: true,
        content: newSuggestion,
        children: [{ text: "" }],
      },
    ],
    {
      at: point,
    },
  );

  // restore cursor position
  editor.selection = editorPosition;
}
