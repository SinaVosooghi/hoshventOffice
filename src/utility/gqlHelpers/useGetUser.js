import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/coupon/gql";
import { useQuery } from "@apollo/client";
import { GET_ITEM_QUERY } from "../../views/apps/user/gql";

export const useGetUser = () => {
  const data = localStorage.getItem("userData");

  if (data) {
    const { uid } = JSON.parse(data);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useQuery(GET_ITEM_QUERY, {
      fetchPolicy: "cache-first",
      variables: {
        id: parseInt(uid),
      },
      onCompleted: ({ user }) => {
        setUser(user);
      },
      onError: (err) => {
        if (err.message === "Unauthorized") setError("Unauthorized");
      },
    });

    return { user, error };
  }
  return { user: null };
};
