import { useTheme } from "@mui/material/styles";
import useResponsive from "./useResponsive";

export type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "button"
  | "overline";

/**
 * A hook that returns the current width of the screen based on the active breakpoint defined in the theme.
 *
 * @returns The name of the active breakpoint, or "xs" if none matches.
 */
function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    // @ts-ignore not sure what is this
    keys.reduce((output, key) => {
      const matches = useResponsive("up", key);
      return !output && matches ? key : output;
    }, null) || "xs"
  );
}

/**
 * Converts a rem value to px.
 *
 * @param value - The rem value to convert.
 * @returns The converted px value.
 */
export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

/**
 * Converts a px value to rem.
 *
 * @param value - The px value to convert.
 * @returns The converted rem value.
 */
export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

/**
 * Generates responsive font sizes based on the provided sm, md, and lg values.
 *
 * @param sm - The font size for small devices.
 * @param md - The font size for medium devices.
 * @param lg - The font size for large devices.
 * @returns An object containing responsive font sizes.
 */
export function responsiveFontSizes({ sm, md, lg }: { sm: number; md: number; lg: number }) {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

/**
 * Retrieves the font value for a given variant.
 *
 * @param variant - The variant for which to retrieve font values.
 * @returns An object containing fontSize, lineHeight, fontWeight, and letterSpacing.
 */
export default function getFontValues(variant: Variant): any {
  const theme = useTheme();
  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === "xl" ? "lg" : breakpoints);

  const hasResponsive =
    variant === "h1" ||
    variant === "h2" ||
    variant === "h3" ||
    variant === "h4" ||
    variant === "h5" ||
    variant === "h6";

  const getFont: any =
    hasResponsive && theme.typography[variant][key] ? theme.typography[variant][key] : theme.typography[variant];

  const fontSize = remToPx(getFont.fontSize);
  const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;
  const { fontWeight, letterSpacing } = theme.typography[variant];

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}
