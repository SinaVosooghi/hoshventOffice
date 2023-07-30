import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/payment/gql";
import { useQuery } from "@apollo/client";

export const useGetPayments = (limit) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        limit,
      },
    },
    onCompleted: ({ payments }) => {
      setData(payments?.payments);
      setCount(payments?.count);
    },
  });

  return { payments: data, paymentsCount: count };
};
