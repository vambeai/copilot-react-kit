import { RenderElementProps } from "slate-react";

export type RenderElementFunction = (props: RenderElementProps) => JSX.Element;

export function makeRenderElementFunction(
  suggestionsStyle: React.CSSProperties,
  showGenerateShortcut: boolean,
  shortcutKey: string,
): RenderElementFunction {
  return (props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <DefaultElement {...props} />;
      case "suggestion":
        return (
          <SuggestionElement
            {...props}
            suggestionsStyle={suggestionsStyle}
            showGenerateShortcut={showGenerateShortcut}
            shortcutKey={shortcutKey}
          />
        );
      default:
        return <DefaultElement {...props} />;
    }
  };
}

const DefaultElement = (props: RenderElementProps) => {
  return <div {...props.attributes}>{props.children}</div>;
};

interface SuggestionElementProps extends RenderElementProps {
  suggestionsStyle: React.CSSProperties;
  showGenerateShortcut: boolean;
  shortcutKey: string;
}

const SuggestionElement = (props: SuggestionElementProps) => {
  const isMac = navigator.userAgent.includes("Mac OS X");
  return (
    <span
      {...props.attributes}
      style={{
        ...props.suggestionsStyle,
      }}
      contentEditable={false}
    >
      {props.children /* https://github.com/ianstormtaylor/slate/issues/3930 */}
      {props.element.type === "suggestion" && props.element.content}
      {props.element.type !== "suggestion" &&
        props.showGenerateShortcut &&
        `${isMac ? "⌘" : "Ctrl+"}${props.shortcutKey.toUpperCase()} to generate`}
    </span>
  );
};
