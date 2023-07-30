import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from 'apollo-upload-client'

const httpLink = new createUploadLink({
  uri: import.meta.env.VITE_BASE_API + "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem("accessToken"));
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export { client };
