import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ClerkProvider, SignedIn, SignIn, SignedOut } from "@clerk/clerk-react";
// import "dotenv/config";

/* global document, Office, module */

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const App = React.lazy(() => import("./components/App"));

const render = (Component) => {
  ReactDOM.render(
    <React.Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        {/* <ClerkProvider
          publishableKey={
            // eslint-disable-next-line no-undef
            process.env.CLERK_DEV_PUB_KEY
          }
        > */}
        <ClerkProvider publishableKey="pk_test_Y2xlcmsuc291Z2h0LmFpcmVkYWxlLTM4LmxjbC5kZXYk">
          <SignedIn>
            {/* <AuthorizedApolloProvider> */}
            <Component title={title} isOfficeInitialized={isOfficeInitialized} />
            {/* </AuthorizedApolloProvider> */}
          </SignedIn>
          <SignedOut>
            <SignIn redirectUrl="/taskpane" />
          </SignedOut>
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
