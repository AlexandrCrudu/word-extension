export type PDFTemplate = {
  id: number;
  name: string;
  description: string | null;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  attachment_id: number | null;
  attachment: any;
  template_attachments: {
    attachment_id: number;
  }[];
  format_id: number;
  format: {
    id: number;
    name: string;
    display_name: string;
  };
};

export type PDFTemplateCategory = PDFTemplate["category"];

export type FieldsSuccessfulResponse = {
  __type: {
    fields: any[];
  };
};

type CategoriesSuccessfulResponse = {
  pdf_category: PDFTemplateCategory[];
};

export function categoriesResponseSuccessful(response: unknown): response is CategoriesSuccessfulResponse {
  return (
    !!response && typeof response === "object" && "pdf_category" in response && Array.isArray(response.pdf_category)
  );
}

export function fieldsResponseSuccessful(responseData: unknown): responseData is FieldsSuccessfulResponse {
  return (
    !!responseData &&
    typeof responseData === "object" &&
    "__type" in responseData &&
    typeof responseData.__type === "object" &&
    !!responseData.__type &&
    "fields" in responseData.__type &&
    Array.isArray(responseData.__type.fields)
  );
}
