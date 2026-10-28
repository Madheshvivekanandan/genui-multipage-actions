/**
 * ROUTING · app/page.tsx — the URL  /.
 *
 * Only wiring: read the document on the server, show it in the FlowScreen.
 */
import { FlowScreen } from "@/components/FlowScreen";
import { loadSampleDocument } from "@/server/documents";

export default function Page() {
  return <FlowScreen doc={loadSampleDocument()} />;
}
