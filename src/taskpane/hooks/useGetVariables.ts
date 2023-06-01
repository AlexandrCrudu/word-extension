import { useApolloClient } from "@apollo/client";
import { useCallback } from "react";

import type { Node } from "../components/TemplateTreeView";
import { fieldToNode } from "../utils/legendNodes";
import { GET_FIELDS } from "../utils/queries";
import type { PDFTemplateCategory } from "../utils/types";
import { fieldsResponseSuccessful } from "../utils/types";

export function useGetVariables(category: PDFTemplateCategory): { getVariables: () => Promise<Node[] | null> } {
  const apolloClient = useApolloClient();
  const getVariables = useCallback(async (): Promise<Node[] | null> => {
    const response = await apolloClient.query({
      query: GET_FIELDS,
      variables: {
        typeName: category.name,
      },
    });

    if (!fieldsResponseSuccessful(response.data)) {
      return null;
    }

    const fieldsRetrieved = response.data.__type.fields;
    const result = fieldsRetrieved.map((field: any) => fieldToNode(field)).filter(Boolean);

    if (result.length === 0) {
      return null;
    }

    return result;
  }, [apolloClient, category.name]);

  return { getVariables };
}
