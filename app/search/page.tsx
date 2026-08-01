import { Suspense } from "react";
import SearchPage from "@/components/Search";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchPage />
    </Suspense>
  );
}