import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";

/* global document, Office, module */

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

const App = React.lazy(() => import("./components/App"));

const render = (Component) => {
  ReactDOM.render(
    <React.Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <Component title={title} isOfficeInitialized={isOfficeInitialized} />
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
