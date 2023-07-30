import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/ticket/gql";
import { useQuery } from "@apollo/client";

export const useGetChats = (limit) => {
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
    onCompleted: ({ chats }) => {
      setData(chats?.chats);
      setCount(chats?.count);
    },
  });

  return { chats: data, count };
};
