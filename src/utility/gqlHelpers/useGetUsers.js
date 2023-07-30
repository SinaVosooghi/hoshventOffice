import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/user/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

export const useGetUsers = (limit) => {
  const [usersData, setUsersData] = useState();
  const [count, setCount] = useState(0);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
        limit,
      },
    },
    onCompleted: ({ users }) => {
      setUsersData(users);
      setCount(users?.count);
    },
  });

  return { users: usersData, usersCount: count };
};
