import { useState } from "react";
import { GET_ITEM_QUERY } from "../../views/apps/site/gql";
import { useQuery } from "@apollo/client";

export const useGetSite = () => {
  const [data, setData] = useState([]);

  useQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: ({ site }) => {
      setData(site);
    },
  });

  return { site: data };
};
