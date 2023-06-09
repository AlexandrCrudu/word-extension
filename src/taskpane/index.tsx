/* eslint-disable */

import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
// import { AuthorizedApolloProvider } from "./components/AuthorizedApolloProvider";
import * as React from "react";
import { ClerkProvider, SignedIn, SignIn, SignedOut } from "@clerk/clerk-react";
import { createRoot } from "react-dom/client";

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const App = React.lazy(() => import("./components/App"));

const container = document.getElementById("container");

if (!container) {
  throw new Error("no container to render to");
}

const root = createRoot(container);

const RootComponent = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <ClerkProvider publishableKey="pk_test_Y2xlcmsuc291Z2h0LmFpcmVkYWxlLTM4LmxjbC5kZXYk">
          <SignedIn>
            <App title={title} isOfficeInitialized={isOfficeInitialized} />
          </SignedIn>
          <SignedOut>
            <SignIn redirectUrl="/successLogin.html" />
          </SignedOut>
        </ClerkProvider>
      </ThemeProvider>
    </React.Suspense>
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  root.render(<RootComponent />);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = React.lazy(() => import("./components/App"));
    root.render(NextApp);
  });
}
