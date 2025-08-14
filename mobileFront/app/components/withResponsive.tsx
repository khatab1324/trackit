import React from "react";
import { Screen, Feed, ResponsiveContainer } from "./Responsive";

type Options = {
  mode?: "screen" | "feed" | "raw"; 
  fullBleed?: boolean;              
};

export function withResponsive<P extends object>(
  Wrapped: React.ComponentType<P>,
  options: Options = { mode: "screen" }
) {
  const { mode = "screen", fullBleed = false } = options;

  const WrappedWithResponsive: React.FC<P> = (props) => {
    if (fullBleed) {
      return <Wrapped {...(props as P)} />;
    }

    if (mode === "raw") {
      return (
        <ResponsiveContainer>
          <Wrapped {...(props as P)} />
        </ResponsiveContainer>
      );
    }

    if (mode === "feed") {
      return (
        <Feed>
          <Wrapped {...(props as P)} />
        </Feed>
      );
    }

    return (
      <Screen>
        <Wrapped {...(props as P)} />
      </Screen>
    );
  };

  (WrappedWithResponsive as any).displayName =
    `withResponsive(${(Wrapped as any).displayName || Wrapped.name || "Component"})`;

  return WrappedWithResponsive;
}
