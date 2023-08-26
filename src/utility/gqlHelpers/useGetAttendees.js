import { useState } from "react";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { GET_ATTENDEES_ITEMS } from "../../views/extensions/import-export/gql";

export const useGetAttendees = (limit) => {
  const [usersData, setUsersData] = useState();
  const [count, setCount] = useState(0);

  useQuery(GET_ATTENDEES_ITEMS, {
    fetchPolicy: "cache-first",
    variables: {
      input: {
        skip: 0,
        limit,
      },
    },
    onCompleted: ({ attendees }) => {
      setUsersData(attendees.attends);
      setCount(attendees?.count);
    },
  });

  return { attendees: usersData, count: count };
};
