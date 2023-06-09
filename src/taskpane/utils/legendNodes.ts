import type { Node } from "../components/TemplateTreeView";
import { snakeCaseToTitleCase } from "./snakeCaseToTitleCase";

export const blacklist = ["_id", "updated"];

export function fieldToNode(field: any, inArray = false): Node | null {
  const { key, type } = field;
  if (!key || typeof key !== "string") {
    return null;
  }
  const arrayFields = type?.ofType?.ofType?.ofType?.children;
  const fields = arrayFields ?? (type ? type.children : null);
  if (blacklist.some((substring) => key.toUpperCase().includes(substring.toUpperCase()))) return null;
  if (!fields || !Array.isArray(fields)) {
    if (type?.kind === "SCALAR" || type?.ofType?.kind === "SCALAR") {
      return {
        key,
        label: snakeCaseToTitleCase(key),
        inArray,
      };
    }
    return null;
  }
  const children = fields.map(($0: unknown) => fieldToNode($0, !!arrayFields)).filter(Boolean);
  return children.length === 0
    ? null
    : {
        key,
        label: snakeCaseToTitleCase(key),
        children,
      };
}
