import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// Web only: the page behind the app is black too, so there is no white flash while loading.
// The video rule makes the web <video> fill its box (it keeps its own 540x960 size otherwise).
// The snap rule makes the vertical episode feed stop at every episode, even after a hard flick or a
// trackpad swipe: React Native Web wraps each paged item in an element with this class.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style>
          {
            'body { background-color: #000000; } video { width: 100%; height: 100%; } [class*="r-scrollSnapAlign"] { scroll-snap-stop: always; }'
          }
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
