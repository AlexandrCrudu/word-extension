import type { Breakpoint } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Query = "up" | "down" | "between" | "only";
type Value = Breakpoint | number;

export default function useResponsive(query: Query, key?: Value, start?: Value, end?: Value) {
  const theme = useTheme();
  const mediaUp = useMediaQuery(theme.breakpoints.up(key as Value));
  const mediaDown = useMediaQuery(theme.breakpoints.down(key as Value));
  const mediaBetween = useMediaQuery(theme.breakpoints.between(start as Value, end as Value));
  const mediaOnly = useMediaQuery(theme.breakpoints.only(key as Breakpoint));

  if (query === "up") {
    return mediaUp;
  }
  if (query === "down") {
    return mediaDown;
  }
  if (query === "between") {
    return mediaBetween;
  }
  if (query === "only") {
    return mediaOnly;
  }

  return null;
}

type BreakpointOrNull = Breakpoint | null;

export function useWidth() {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, null) || "xs"
  );
}
