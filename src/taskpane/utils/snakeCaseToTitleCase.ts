export function snakeCaseToTitleCase(stringToConvert: string) {
  if (!stringToConvert) return "";
  return stringToConvert === stringToConvert.toUpperCase()
    ? stringToConvert
        .toLowerCase()
        .replace(/^_*(.)|_+(.)/g, (_s, c: string, d: string) => (c ? c.toUpperCase() : ` ${d.toUpperCase()}`))
    : stringToConvert.replace(/^_*(.)|_+(.)/g, (_s, c: string, d: string) =>
        c ? c.toUpperCase() : ` ${d.toUpperCase()}`
      );
}
