import { useState } from "react";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { GET_ITEMS_QUERY } from "../../views/apps/shipping/gql";
import { thousandSeperator } from "../Utils";

export const getShippingsSelect = (type) => {
  const [shippingsData, setShippingsData] = useState([
    { value: null, label: `${t("Select")} ${t("Shipping")}...`, cost: null },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        usertype: type,
      },
    },
    onCompleted: ({ shippings }) => {
      shippings?.shippings?.map((shipping) => {
        setShippingsData((prev) => [
          ...prev,
          {
            value: shipping.id,
            label: `(${thousandSeperator(shipping.cost)}) ` + shipping.title,
            cost: shipping.cost,
          },
        ]);
      });
    },
  });

  return shippingsData;
};
