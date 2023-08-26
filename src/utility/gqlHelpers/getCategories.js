import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/category/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

export const getCategoriesSelect = (type) => {
  const [items, setItems] = useState([
    { value: "", label: `${t("Select")} ${t("Category")}...` },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        type: type,
      },
    },
    onCompleted: ({ categories }) => {
      categories?.categories?.map((category) =>
        setItems((prev) => [
          ...prev,
          { value: category.id, label: category.title },
        ])
      );
    },
  });

  return items;
};
