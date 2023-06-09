import { useCallback } from "react";
import { GET_PDF_CATEGORIES } from "../utils/queries";
import { categoriesResponseSuccessful } from "../utils/types";
import { useAuth, useClerk } from "@clerk/clerk-react";
import fetch from "node-fetch";
import { CategoryType } from "../types/categories";

export function useGetCategories(): { getCategories: () => Promise<CategoryType[] | null> } {
  const {
    organization: {
      publicMetadata: { endpoint },
    },
  } = useClerk();
  const { getToken } = useAuth();
  const getCategories = useCallback(async (): Promise<CategoryType[] | null> => {
    if (!endpoint || typeof endpoint !== "string") {
      return null;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        query: GET_PDF_CATEGORIES,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken({ template: "hasura" })}`,
      },
    });

    const jsonRes = await response.json();

    if (!categoriesResponseSuccessful(jsonRes.data)) {
      return null;
    }

    const fieldsRetrieved = jsonRes.data.pdf_category;

    if (fieldsRetrieved.length === 0) {
      return null;
    }

    return fieldsRetrieved;
  }, []);

  return { getCategories };
}
