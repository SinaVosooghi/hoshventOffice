import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/coupon/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

export const getCouponsSelect = (type) => {
  const [couponsData, setCouponsData] = useState([
    { value: "", label: `${t("Select")} ${t("Discount")}...`, data: null },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        usertype: type,
      },
    },
    onCompleted: ({ coupons }) => {
      coupons?.coupons?.map((coupon) => {
        setCouponsData((prev) => [
          ...prev,
          {
            value: coupon.id,
            label: `(${coupon.percent}%) ` + coupon.title,
            data: coupon.percent,
          },
        ]);
      });
    },
  });

  return couponsData;
};
