import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/course/gql";
import { useQuery } from "@apollo/client";

export const useGetCourses = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState([]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
      },
    },
    onCompleted: ({ courses }) => {
      setData(courses?.courses);
      setCount(courses?.count);
    },
  });

  return { courses: data, courseCount: count };
};
