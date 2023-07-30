import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/department/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { thousandSeperator } from "../Utils";

export const useGetSelectDepartments = (type) => {
  const [departmentsData, setDepartmentsData] = useState([
    { value: null, label: `${t("Select")} ${t("Department")}...` },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        status: true,
      },
    },
    onCompleted: ({ departments }) => {
      departments?.departments?.map((department) => {
        setDepartmentsData((prev) => [
          ...prev,
          {
            value: department.id,
            label: department.title,
          },
        ]);
      });
    },
  });

  return departmentsData;
};
