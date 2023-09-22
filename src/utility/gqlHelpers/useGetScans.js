import { useState } from "react";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { GET_SCANS_ITEMS } from "../../views/ui-elements/cards/statistics/gql";

export const useGetScans = (limit) => {
  const [usersData, setUsersData] = useState();
  const [count, setCount] = useState(0);

  useQuery(GET_SCANS_ITEMS, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
        limit,
      },
    },
    onCompleted: ({ scans }) => {
      setUsersData(scans.scans);
      setCount(scans?.count);
    },
  });

  return { scans: usersData, count: count };
};
