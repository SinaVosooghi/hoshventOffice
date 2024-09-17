import ReactQrCode from "@devmehq/react-qr-code";
import { Logo } from "./Logo";
import { Name } from "./Name";
import { QrCode } from "./QRCode";
import { Title } from "./Title";
import { useEffect, useState } from "react";
import { GET_ITEM_QUERY } from "../site/gql";
import { useGetUser } from "../../../utility/gqlHelpers/useGetUser";
import { useLazyQuery } from "@apollo/client";
import "./print.css"; // Import your CSS file

const styles = {
  width: "7in",
  height: "9.25in",
  position: "relative",
};

const PrintableCard = ({ event, url, itemUser, showCard = false }) => {
  const { user } = useGetUser();
  const [site, setSite] = useState(null);
  const [elements, setElements] = useState([]);

  const [getWebsite] = useLazyQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: async ({ site }) => {
      if (site) {
        setSite(site);
      }
    },
  });

  useEffect(() => {
    if (user?.site) {
      getWebsite({
        variables: {
          id: user?.site[0].id,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (site?.cardlayout) {
      setElements(JSON.parse(site?.cardlayout));
    }
  }, [site]);

  return (
    <div
      style={{
        ...styles,
        marginLeft: 110,
        transform: "scale(.94)",
        position: "relative",
      }}
      className="print-page"
    >
      {elements &&
        Object.keys(elements).map((key) => {
          const { left, top, title, type } = elements[key];

          if (type === "qr") {
            return (
              <QrCode key={key} id={key} left={left} top={top}>
                <div
                  style={{
                    width: 180,
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  <ReactQrCode
                    value={`${
                      import.meta.env.VITE_BASE_API + "/graphql"
                    }/scan&u=${itemUser?.user?.id}`}
                    size={100}
                    viewBox={`0 0 100 100`}
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
                styles={{ color: "#000" }}
              >
                {itemUser?.user?.titleen ?? itemUser?.titleen}
              </Title>
            );
          } else if (type === "name") {
            return (
              <Name key={key} id={key} left={left} top={top}>
                {itemUser?.user?.firstName} {itemUser?.user?.lastName}
              </Name>
            );
          } else if (type === "title") {
            return (
              <Title key={key} id={key} left={left} top={top}>
                {event ?? site.title}
              </Title>
            );
          } else if (type === "nameen") {
            return (
              <Title
                key={key}
                id={key}
                left={left}
                top={top}
                style={{ fontWeight: "bold" }}
              >
                {itemUser?.user?.firstNameen} {itemUser?.user?.lastNameen}
              </Title>
            );
          } else if (type === "categoryen") {
            return (
              <Title key={key} id={key} left={left} top={top}>
                {itemUser?.user?.category?.titleen}
              </Title>
            );
          } else if (type === "usertitle") {
            return (
              <Title key={key} id={key} left={left} top={top}>
                {itemUser?.user?.title ?? user?.title}
              </Title>
            );
          } else if (type === "category") {
            return (
              <Title key={key} id={key} left={left} top={top}>
                {itemUser?.user?.category?.title}
              </Title>
            );
          } else if (type === "parent") {
            return (
              <Title key={key} id={key} left={left} top={top}>
                {itemUser?.user?.category?.category?.title ||
                  user?.category?.category?.title}
              </Title>
            );
          } else if (type === "logo") {
            return (
              <Logo key={key} id={key} left={left} top={top}>
                <img
                  src={`${import.meta.env.VITE_BASE_API + "/" + site?.logo}`}
                  width="100%"
                  alt={"Logo"}
                />
              </Logo>
            );
          }
        })}
    </div>
  );
};

export default PrintableCard;
