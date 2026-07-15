import { Suspense } from "react";
import { IssuesView } from "@/components/views/IssuesView";

export default function IssuesPage() {
  return (
    <Suspense fallback={null}>
      <IssuesView />
    </Suspense>
  );
}
