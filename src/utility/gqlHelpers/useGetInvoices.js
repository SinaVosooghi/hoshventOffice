import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/invoice/gql";
import { useQuery } from "@apollo/client";

export const useGetInvoices = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState([]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
      },
    },
    onCompleted: ({ invoices }) => {
      setData(invoices?.invoices);
      setCount(invoices?.count);
    },
  });

  return { invoices: data, invoiceCount: count };
};
