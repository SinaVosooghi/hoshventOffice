import React, { useMemo, useState, useEffect } from "react";
import PrintableCard from "../../apps/workshops/PrintableCard";
import { GET_ITEM_QUERY } from "../../apps/site/gql";
import { useGetUser } from "../../../utility/gqlHelpers/useGetUser";
import { useLazyQuery } from "@apollo/client";

const PrintableCards = React.forwardRef(({ data, seminarTitle }, ref) => {
  const { user } = useGetUser();
  const [site, setSite] = useState(null);
  
  const [getWebsite] = useLazyQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: async ({ site: fetchedSite }) => {
      if (fetchedSite && fetchedSite.id !== site?.id) {
        setSite(fetchedSite);
      }
    },
  });

  useEffect(() => {
    if (user?.site && !site) {
      getWebsite({
        variables: {
          id: user?.site[0]?.id ?? 38,
        },
      });
    }
  }, [user, site, getWebsite])
  
  const cards = useMemo(() => {
    return (
      <div
        ref={ref}
        style={{
          width: "8.27in",
          backgroundClip: "white",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {data?.map((user) => (
          <PrintableCard itemUser={user} event={seminarTitle} key={user.id} externalSite={site} externalUser={user}/>
        ))}
      </div>
    );
  }, [data, seminarTitle]);

  return cards;
});

export default PrintableCards;
