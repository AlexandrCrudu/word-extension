import { gql } from "@apollo/client";

export const GET_FIELDS = gql`
  query GetFields($typeName: String!) {
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
