import React, { useMemo } from "react";
import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth, useClerk } from "@clerk/clerk-react";

type Props = {
  children: React.ReactNode;
};

export const AuthorizedApolloProvider = ({ children }: Props) => {
  const { getToken, userId } = useAuth();
  const { organization } = useClerk();
  const endpoint = useMemo(() => {
    const { endpoint } = organization?.publicMetadata ?? {};
    return endpoint as string;
  }, [organization]);
  const httpLink = createHttpLink({});
  const authLink = setContext(async () => {
    if (userId) {
      return {
        uri: endpoint,
        headers: {
          Authorization: `Bearer ${await getToken({ template: "hasura" })}`,
        },
      };
    }
    return {
      uri: `https://app.opusflow.io`,
      headers: {},
    };
  });
  const apolloClient = new ApolloClient({
    link: from([authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
