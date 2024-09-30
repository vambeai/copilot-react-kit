import React, { useEffect, useRef, useState } from "react";
import { Editor, Location, Transforms } from "slate";
import { useSlate, useSlateSelection } from "slate-react";
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
  const dialogRef = useRef<HTMLDivElement>(null); // Reference to the dialog

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

    let x = rect.left + window.scrollX + rect.width / 2;
    let y = rect.top + window.scrollY;

    if (dialogRef.current) {
      const dialogRect = dialogRef.current.getBoundingClientRect();
      x -= dialogRect.left;
      y -= dialogRect.top;
    }

    setPosition({ x, y });

    console.log("Toolbar position:", { x, y, rect });
  }, [editor, selection, isDisplayed]);

  if (!isClient) {
    return null;
  }

  return (
    <div ref={dialogRef}>
      <Popover open={isDisplayed} onOpenChange={setIsDisplayed}>
        <PopoverContent
          className={
            props.hoverMenuClassname ||
            "z-50 flex flex-col justify-center items-center space-y-4 rounded-md border shadow-lg p-4 border-gray- bg-white"
          }
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            //transform: "translate(-50%, -100%)",
            width: "30rem",
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
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
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
