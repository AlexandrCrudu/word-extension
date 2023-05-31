export const VARIABLE_START = `{{ `;
export const VARIABLE_END = ` }}`;

const TAG = `p`;
export const EACH_START = `{{#each `;
export const EACH_MID = `}}<${TAG}>{{this.`;
export const EACH_END = `}}</${TAG}>{{/each}}`;
export function generateEachLoop(parents: string[], child: string, format: "html" | "docx" | "raw"): string {
  switch (format) {
    case "html":
      return `<div>${EACH_START}${parents.join(".")}${EACH_MID}${child}${EACH_END}</div>`;
    case "docx":
      return `${parents
        .map((parent) => `${VARIABLE_START}#${parent}${VARIABLE_END}`)
        .join("")}${VARIABLE_START}${child}${VARIABLE_END}${parents
        .reverse()
        .map((parent) => `${VARIABLE_START}/${parent}${VARIABLE_END}`)
        .join("")}`;
    case "raw":
      return `${[...parents, child].join(".")}`;
    default:
      return "";
  }
}

export function generateVariable(parents: string[], child: string, format: "html" | "docx" | "raw"): string {
  switch (format) {
    case "html":
      return `<div>${VARIABLE_START}${[...parents, child].join(".")}${VARIABLE_END}</div>`;
    case "docx":
      return `${parents
        .map((parent) => `${VARIABLE_START}#${parent}${VARIABLE_END}`)
        .join("")}${VARIABLE_START}${child}${VARIABLE_END}${parents
        .reverse()
        .map((parent) => `${VARIABLE_START}/${parent}${VARIABLE_END}`)
        .join("")}`;
    case "raw":
      return `${[...parents, child].join(".")}`;
    default:
      return "";
  }
}
function escapeRegExp(string: string): string {
  return string.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
}

export function extractVariables(html: string): string[] {
  const encapsulatedStrings: string[] = [];
  const htmlCopy = html;

  const arrayRegex = new RegExp(
    `(?:${EACH_START})(.*?)(?:${EACH_MID.split(`<${TAG}>`).join(`\\s*<${TAG}>\\s*`)})(.*?)(?:}})`,
    "gs"
  );

  let arrayMatch: RegExpExecArray | null = arrayRegex.exec(htmlCopy);

  while (arrayMatch && arrayMatch.length >= 3) {
    encapsulatedStrings.push(`${arrayMatch[1]}.${arrayMatch[2]}`);
    arrayMatch = arrayRegex.exec(htmlCopy);
  }

  const regex = new RegExp(`${escapeRegExp(VARIABLE_START)}(.*?)${escapeRegExp(VARIABLE_END)}`, "g");

  let match: RegExpExecArray | null = regex.exec(html);
  while (match !== null) {
    encapsulatedStrings.push(match[1]);
    match = regex.exec(html);
  }

  return encapsulatedStrings.filter((string, index) => encapsulatedStrings.indexOf(string) === index);
}
