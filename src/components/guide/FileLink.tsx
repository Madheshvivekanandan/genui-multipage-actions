/**
 * FRONTEND · components/guide/FileLink.tsx — a repo file path that opens the file on GitHub.
 */
import { Fragment } from "react";

const REPO = "https://github.com/Madheshvivekanandan/genui-multipage-actions/blob/master/";

export function FileLink({ path }: { path: string }) {
  return (
    <a
      href={REPO + path}
      target="_blank"
      rel="noreferrer"
      className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[11.5px] text-[var(--ink)] hover:bg-white/15"
    >
      {/* A narrow card wraps the path after a slash, not inside a file name. */}
      {path.split("/").map((part, i) => (
        <Fragment key={i}>
          {i > 0 && "/"}
          {i > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </a>
  );
}
