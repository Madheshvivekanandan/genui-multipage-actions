/**
 * ROUTING · app/page.tsx — the URL  /.
 *
 * Only wiring: "when someone opens /, show the FlowScreen".
 */
import { FlowScreen } from "@/components/FlowScreen";

export default function Page() {
  return <FlowScreen />;
}
