import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_ITEM_QUERY } from "../../views/apps/setting/gql";

const useGetSetting = () => {
  const [setting, setSetting] = useState();

  useQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: ({ getSetting }) => {
      if (getSetting) {
        setSetting(getSetting);
      }
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return setting;
};

export default useGetSetting;
