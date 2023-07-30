import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/product/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { thousandSeperator } from "../Utils";

export const getProductsSelect = (type) => {
  const [productData, setProductsData] = useState([
    { value: "", label: `${t("Select")} ${t("Product")}...` },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        usertype: type,
      },
    },
    onCompleted: ({ products }) => {
      products?.products?.map((product) => {
        setProductsData((prev) => [
          ...prev,
          {
            value: product.id,
            label:
              `(${thousandSeperator(product.price)}) ` +
              product.title +
              ` -- [${thousandSeperator(product.offprice)}] `,
            price: product.price,
            offprice: product.offprice,
          },
        ]);
      });
    },
  });

  return productData;
};
