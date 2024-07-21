import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRINT_ITEMS } from "../../views/ui-elements/cards/statistics/gql";

export const useGetPrints = (limit, startDate, endDate) => {
  const [count, setCount] = useState(0);

  useQuery(GET_PRINT_ITEMS, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
        limit,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      },
    },
    onCompleted: ({ prints }) => {
      setCount(prints?.count);
    },
  });

  return { count: count };
};
