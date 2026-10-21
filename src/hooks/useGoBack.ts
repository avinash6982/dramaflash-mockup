import { useRouter } from "expo-router";
import { useCallback } from "react";

// Back button handler. After a reload on web there is no history to go back to,
// so fall back to Home instead of raising "GO_BACK was not handled".
// useCallback keeps the function the same between renders, which the swipe-to-close gesture needs.
export function useGoBack() {
  const router = useRouter();

  return useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);
}
