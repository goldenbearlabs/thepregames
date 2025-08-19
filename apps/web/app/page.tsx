import { hello } from "@thepregames/shared";
import { H1 } from "@thepregames/ui";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <H1>thepregames — Web</H1>
      <p>{hello()}</p>
    </main>
  );
}
