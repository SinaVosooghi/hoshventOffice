import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/user/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

export const getUsersSelect = (type) => {
  const [usersData, setUsersData] = useState([
    { value: "", label: `${t("Select")} ${t("User")}...` },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        usertype: type,
      },
    },
    onCompleted: ({ users }) => {
      users?.users?.map((user) => {
        setUsersData((prev) => [
          ...prev,
          {
            value: user.id,
            label: `(${user.id}) ` + user.firstName + " " + user.lastName,
            user: user,
          },
        ]);
      });
    },
  });

  return usersData;
};
