import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ITEM_QUERY } from "../../views/apps/user/gql";

export const useGetUser = () => {
  const data = localStorage.getItem("userData");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  if (data) {
    const { uid } = JSON.parse(data);

    useQuery(GET_ITEM_QUERY, {
      fetchPolicy: "cache-first",
      variables: {
        id: parseInt(uid),
      },
      onCompleted: ({ user }) => {
        if (user && user.usertype === "tenant") {
          setUser({
            ...user,
            site: user.site.length ? user.site : [user.siteid],
          });
        }
      },
      onError: (err) => {
        if (err.message === "Unauthorized") setError("Unauthorized");
      },
    });
  }

  return { user, error };
};
