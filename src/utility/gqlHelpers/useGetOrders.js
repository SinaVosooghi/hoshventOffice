import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/order/gql";
import { useQuery } from "@apollo/client";

export const useGetOrders = (limit) => {
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
    onCompleted: ({ orders }) => {
      setData(orders?.orders);
      setCount(orders?.count);
    },
  });

  return { orders: data, ordersCount: count };
};
