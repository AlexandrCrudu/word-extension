import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import AuthorizedApolloProvider from "./components/AuthorizedApolloProvider";

/* global document, Office, module */

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const App = React.lazy(() => import("./components/App"));

const render = (Component) => {
  ReactDOM.render(
    <React.Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <ClerkProvider
          polling
          frontendApi=""
          appearance={{
            layout: {
              socialButtonsVariant: "iconButton",
              helpPageUrl: "https://opusflow.io",
              privacyPageUrl: "https://opusflow.io",
              termsPageUrl: "https://opusflow.io",
              socialButtonsPlacement: "top",
              showOptionalFields: true,
            },
          }}
        >
          <AuthorizedApolloProvider>
            <Component title={title} isOfficeInitialized={isOfficeInitialized} />
          </AuthorizedApolloProvider>
        </ClerkProvider>
      </ThemeProvider>
    </React.Suspense>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = React.lazy(() => import("./components/App"));
    render(NextApp);
  });
}
