import { useEffect, useRef, useState } from "react";
import { Editor, Location, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection } from "slate-react";
import {
  getFullEditorTextWithNewlines,
  getTextAroundSelection,
} from "../../lib/get-text-around-cursor";
import {
  EditingEditorState,
  InsertionEditorApiConfig,
} from "../../types/base/autosuggestions-bare-function";
import { useHoveringEditorContext } from "./hovering-editor-provider";
import { Popover, PopoverContent } from "./popover";
import { HoveringInsertionPromptBox } from "./text-insertion-prompt-box";

export interface HoveringToolbarProps {
  apiConfig: InsertionEditorApiConfig;
  hoverMenuClassname: string | undefined;
  language: "en" | "es";
}

export const HoveringToolbar = (props: HoveringToolbarProps) => {
  const editor = useSlate();
  const selection = useSlateSelection();
  const { isDisplayed, setIsDisplayed } = useHoveringEditorContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  // only render on client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!selection || !isDisplayed) {
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    if (rect.top === 0 && rect.left === 0 && rect.width === 0 && rect.height === 0) {
      return;
    }

    const editorEl = ReactEditor.toDOMNode(editor, editor);
    const editorRect = editorEl.getBoundingClientRect();

    let x = rect.left + 5;
    let y = rect.top;

    const isInsideDialog = editorEl.closest('[role="dialog"]');
    if (isInsideDialog) {
      const dialogRect = isInsideDialog.getBoundingClientRect();
      y -= dialogRect.top;
      x -= dialogRect.left;
    }

    // Adjust position based on the middle of the viewport
    const viewportHeight = window.innerHeight;
    if (rect.top > viewportHeight / 2) {
      y -= 100;
    } else {
      y += 20;
    }

    if (y < 0) {
      y = 5;
    }

    setPosition({ x, y });

    console.log("Toolbar position:", { x, y, rect, editorRect });
  }, [editor, selection, isDisplayed]);

  if (!isClient) {
    return null;
  }

  return (
    <Popover open={isDisplayed} onOpenChange={setIsDisplayed}>
      <PopoverContent
        ref={popoverRef}
        className={
          props.hoverMenuClassname ||
          "z-50 flex flex-col justify-center items-center space-y-4 rounded-md border shadow-lg p-4 border-gray- bg-white"
        }
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "30rem",
          overflowY: "auto",
        }}
      >
        {isDisplayed && selection && (
          <HoveringInsertionPromptBox
            editorState={editorState(editor, selection)}
            apiConfig={props.apiConfig}
            closeWindow={() => setIsDisplayed(false)}
            language={props.language}
            performInsertion={(insertedText) => {
              Transforms.delete(editor, { at: selection });
              Transforms.insertText(editor, insertedText, { at: selection });
              setIsDisplayed(false);
            }}
            beginAdjustementCallback={() => {
              setPosition((prevPosition) => ({
                ...prevPosition,
                y: prevPosition.y - 220,
              }));
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

function editorState(editor: Editor, selection: Location): EditingEditorState {
  const textAroundCursor = getTextAroundSelection(editor);
  return (
    textAroundCursor || {
      textBeforeCursor: getFullEditorTextWithNewlines(editor),
      textAfterCursor: "",
      selectedText: "",
    }
  );
}
