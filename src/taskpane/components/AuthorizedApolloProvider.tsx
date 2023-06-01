/* eslint-disable @typescript-eslint/no-non-null-assertion -- //TODO: @Author: Please remove this line and remove all occurrences of `!` in your files, making sure to follow Joeys Telegram message from 02-03-23 11:18 */
import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { useAuth, useClerk } from "@clerk/nextjs";
import type { ReactNode } from "react";
import React, { useMemo } from "react";
import { createClient } from "graphql-ws";

const AuthorizedApolloProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, userId } = useAuth();
  const { organization } = useClerk();

  const endpoint = useMemo(() => {
    const { endpoint } = organization?.publicMetadata ?? {};
    return endpoint as string;
  }, [organization]);

  const cachingEndpoint = useMemo(() => {
    const { cachingEndpoint } = organization?.publicMetadata ?? {};
    return cachingEndpoint as string;
  }, [organization]);

  const wsUrl = useMemo(() => {
    if (endpoint.includes("http://")) {
      return endpoint.replace("http://", "ws://");
    }
    return endpoint.replace("https://", "wss://");
  }, [organization]);

  const httpLink = createHttpLink({});

  const linkChain = useMemo(() => httpLink, [cachingEndpoint]);

  //   const errorLink = onError(({ graphQLErrors, networkError }) => {
  //     if (graphQLErrors)
  //       for (const { message } of graphQLErrors) {
  //         if (message === "Could not verify JWT: JWSError JWSInvalidSignature") {
  //           push(ROUTES[503].root.path);
  //           return;
  //         }
  //         if (process.env.NODE_ENV !== "production") {
  //           enqueueSnackbar(`[API error]: Message: ${message}`, {
  //             variant: "warning",
  //           });
  //         }
  //       }
  //     if (networkError) {
  //       enqueueSnackbar(`[Network error]: ${networkError}`, { variant: "error" });
  //     }
  //   });

  const authLink = setContext(async (operation) => {
    const hasOperationName = operation.operationName !== undefined;
    const hasCachingEndpoint = cachingEndpoint !== undefined;
    const shouldUseCachingEndpoint = hasOperationName && hasCachingEndpoint;
    if (userId) {
      return {
        uri: shouldUseCachingEndpoint ? cachingEndpoint : endpoint,
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

  const wsLink =
    typeof window === "undefined"
      ? null
      : new GraphQLWsLink(
          createClient({
            url: () => wsUrl,
            connectionParams: async () => ({
              authorization: `Bearer ${await getToken({ template: "hasura" })}`,

              headers: {
                Authorization: `Bearer ${await getToken({ template: "hasura" })}`,
              },
            }),
          }) as any
        );

  const link =
    typeof window !== "undefined" && wsLink !== null
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return definition.kind === "OperationDefinition" && definition.operation === "subscription";
          },
          wsLink,
          linkChain
        )
      : linkChain;

  const apolloClient = new ApolloClient({
    link: from([authLink.concat(link)]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;
