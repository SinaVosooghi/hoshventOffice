import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/product/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

export const useGetProducts = (limit) => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
        limit,
      },
    },
    onCompleted: ({ products }) => {
      setItems(products);
      setCount(products?.count);
    },
  });

  return { products: items, productsCount: count };
};
