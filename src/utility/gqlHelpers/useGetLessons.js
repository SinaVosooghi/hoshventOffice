import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/lesson/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

export const useGetLessons = (limit) => {
  const [data, setData] = useState();
  const [count, setCount] = useState(0);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
        limit,
      },
    },
    onCompleted: ({ lessons }) => {
      setData(lessons.lessons);
      setCount(lessons?.count);
    },
  });

  return { lessons: data, lessonsCount: count };
};
