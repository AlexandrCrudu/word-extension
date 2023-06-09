// import { gql } from "@apollo/client";

export const GET_FIELDS = `
  query GetFields($typeName: String! = "quote") {
    __type(name: $typeName) {
      fields {
        key: name
        type {
          kind
          ofType {
            kind
            name
            ofType {
              ofType {
                kind
                name
                children: fields {
                  key: name
                  type {
                    kind
                    ofType {
                      kind
                    }
                  }
                }
              }
            }
          }
          children: fields {
            key: name
            type {
              kind
              ofType {
                kind
                name
                ofType {
                  ofType {
                    kind
                    name
                    children: fields {
                      key: name
                      type {
                        kind
                        ofType {
                          kind
                        }
                      }
                    }
                  }
                }
              }
              children: fields {
                key: name
                type {
                  kind
                  ofType {
                    kind
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PDF_CATEGORIES = `
	query GET_PDF_CATEGORIES {
		pdf_category {
			id
			name
		}
	}
`;
