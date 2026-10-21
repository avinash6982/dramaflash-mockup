import { useRouter } from "expo-router";

// Back button handler. After a reload on web there is no history to go back to,
// so fall back to Home instead of raising "GO_BACK was not handled".
export function useGoBack() {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };
}
