import * as React from "react";
export const H1 = (p: React.HTMLAttributes<HTMLHeadingElement>) =>
  <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }} {...p} />;
