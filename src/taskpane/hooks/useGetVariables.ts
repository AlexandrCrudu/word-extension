import { useCallback } from "react";
import type { Node } from "../components/TemplateTreeView";
import { fieldToNode } from "../utils/legendNodes";
import { GET_FIELDS } from "../utils/queries";
import type { PDFTemplateCategory } from "../utils/types";
import { fieldsResponseSuccessful } from "../utils/types";
import { useAuth, useClerk } from "@clerk/clerk-react";
// import { useApolloClient } from "@apollo/client";
// import fetch from "node-fetch";

export function useGetVariables(category: PDFTemplateCategory): { getVariables: () => Promise<Node[] | null> } {
  // const apolloClient = useApolloClient();
  const {
    organization: {
      publicMetadata: { endpoint },
    },
  } = useClerk();
  const { getToken } = useAuth();
  const getVariables = useCallback(async (): Promise<Node[] | null> => {
    if (!endpoint || typeof endpoint !== "string") {
      return null;
    }
    // const response = await apolloClient.query({
    //   query: GET_FIELDS,
    //   variables: {
    //     typeName: category.name,
    //   },
    // });
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        query: GET_FIELDS,
        variables: {
          typeName: category.name,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken({ template: "hasura" })}`,
      },
    }).then((res) => res.json());

    if (!fieldsResponseSuccessful(response)) {
      return null;
    }

    const fieldsRetrieved = response.__type.fields;
    const result = fieldsRetrieved.map((field: any) => fieldToNode(field)).filter(Boolean);

    if (result.length === 0) {
      return null;
    }

    return result;
  }, [category.name]);

  return { getVariables };
}
