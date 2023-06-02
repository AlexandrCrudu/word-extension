// prettier-ignore
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import React, { ReactNode, useMemo } from "react";

import typography from "../utils/typography";

type Props = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      typography,
    }),
    []
  );

  const theme = createTheme(themeOptions);
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
}
