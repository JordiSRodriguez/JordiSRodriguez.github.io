import * as React from "react";

interface VisuallyHiddenProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function VisuallyHidden({
  children,
  asChild = false,
}: VisuallyHiddenProps) {
  const Component = asChild ? React.Fragment : "span";

  const style: React.CSSProperties = {
    position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal",
  };

  if (asChild) {
    return <>{children}</>;
  }

  return <Component style={style}>{children}</Component>;
}
