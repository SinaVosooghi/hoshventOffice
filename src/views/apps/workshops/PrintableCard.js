import ReactQrCode from "@devmehq/react-qr-code";
import { Logo } from "./Logo";
import { Name } from "./Name";
import { QrCode } from "./QRCode";
import { Title } from "./Title";
import { useEffect, useMemo, useState } from "react";
import { GET_ITEM_QUERY } from "../site/gql";
import { useGetUser } from "../../../utility/gqlHelpers/useGetUser";
import { useLazyQuery } from "@apollo/client";
import "./print.css"; // Import your CSS file
import { Direction } from "react-data-table-component";

const styles = {
  width: "7in",
  height: "9.25in",
  position: "relative",
};

const PrintableCard = ({
  event,
  url,
  itemUser,
  showCard = true,
  externalSite = null,
  externalUser = null,
}) => {
  if (!showCard) {
    return;
  }
  const { user } = externalUser ?? useGetUser();
  const [site, setSite] = useState(externalSite);
  const [elements, setElements] = useState([]);

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
  }, [user, site, getWebsite]);

  useEffect(() => {
    if (site?.cardlayout) {
      const parsedElements = JSON.parse(site.cardlayout);
      if (JSON.stringify(parsedElements) !== JSON.stringify(elements)) {
        setElements(parsedElements);
      }
    }
  }, [site, elements]);

  const printElemenets = useMemo(
    () =>
      elements &&
      Object.keys(elements).map((key) => {
        const { type } = elements[key];
        const { left, top } = { left: 0, top: 0 };

        if (type === "qr") {
          return (
            <QrCode
              key={key}
              id={key}
              left={left + 5}
              top={top + 10}
              metaStyle={{ position: "relative" }}
            >
              <div
                style={{
                  width: 113,
                  textAlign: "center",
                  margin: "0 auto",
                }}
              >
                <ReactQrCode
                  value={`${
                    import.meta.env.VITE_BASE_API + "/graphql"
                  }/scan&u=${itemUser?.user?.id}`}
                  size={113}
                  viewBox={`0 0 113 113`}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#fff",
                  }}
                  renderAs="canvas"
                  id="qr"
                />
              </div>
            </QrCode>
          );
        } else if (type === "titleen") {
          return (
            <Title
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ color: "#000", position: "relative" }}
            >
              {itemUser?.user?.titleen ?? itemUser?.titleen}
            </Title>
          );
        } else if (type === "name") {
          return (
            <Name
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ position: "relative" }}
            >
              {itemUser?.user?.firstName} {itemUser?.user?.lastName}
            </Name>
          );
        } else if (type === "title") {
          return (
            <Title
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ position: "relative" }}
            >
              {event ?? site.title}
            </Title>
          );
        } else if (
          type === "nameen" &&
          (itemUser?.user?.firstNameen || itemUser?.user?.lastNameen)
        ) {
          return (
            <Title
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ fontWeight: "bold", position: "relative" }}
            >
              {itemUser?.user?.firstNameen} {itemUser?.user?.lastNameen}
            </Title>
          );
        } else if (type === "categoryen" && itemUser?.user?.category?.titleen) {
          return (
            <Title
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ position: "relative" }}
            >
              {itemUser?.user?.category?.titleen}
            </Title>
          );
        } else if (type === "usertitle") {
          return (
            <Title
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ position: "relative" }}
            >
              {itemUser?.user?.title ?? user?.title}
            </Title>
          );
        } else if (type === "category") {
          return (
            <Title
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ position: "relative" }}
            >
              {itemUser?.user?.category?.title}
            </Title>
          );
        } else if (type === "parent") {
          return (
            <Title
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ position: "relative" }}
            >
              {itemUser?.user?.category?.category?.title ||
                user?.category?.category?.title}
            </Title>
          );
        } else if (type === "logo") {
          return (
            <Logo
              key={key}
              id={key}
              left={left}
              top={top}
              styles={{ position: "relative" }}
            >
              <img
                src={`${import.meta.env.VITE_BASE_API + "/" + site?.logo}`}
                width="100%"
                alt={"Logo"}
                style={{ margin: "0 auto" }}
              />
            </Logo>
          );
        }
      }),
    [elements]
  );

  return (
    <div
      style={{
        ...styles,
        transform: "scale(.94)",
        position: "relative",
      }}
      className="print-page"
    >
      {printElemenets}
    </div>
  );
};

export default PrintableCard;
