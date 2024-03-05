import ReactQrCode from "@devmehq/react-qr-code";
import { Logo } from "./Logo";
import { Name } from "./Name";
import { QrCode } from "./QRCode";
import { Title } from "./Title";
import { useEffect, useState } from "react";
import { GET_SITE_ITEM } from "../certificate/gql";
import { useGetUser } from "../../../utility/gqlHelpers/useGetUser";
import { useLazyQuery, useQuery } from "@apollo/client";
import "./print.css"; // Import your CSS file
import { GET_CERTIFICATE } from "./gql";
import moment from "jalali-moment";
import "./print.css"; // Import your CSS file

const styles = {
  width: 1177,
  height: 872,
  position: "relative",
};

const PrintableCertificate = ({ event, url, itemUser, type }) => {
  const { user } = useGetUser();
  const [site, setSite] = useState(null);
  const [elements, setElements] = useState([]);

  const { data } = useQuery(GET_CERTIFICATE, {
    notifyOnNetworkStatusChange: true,
    //@ts-ignore
    variables: { type: type },
    fetchPolicy: "network-only",
    onCompleted: async ({ getCertificate }) => {
      setElements(JSON.parse(getCertificate.itemLayout));
    },
  });

  const [getWebsite] = useLazyQuery(GET_SITE_ITEM, {
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

  return (
    <div
      style={{
        position: "relative",
        ...styles,
        ...(data?.getCertificate?.image && {
          backgroundImage: `url('${import.meta.env.VITE_BASE_API}/${
            data?.getCertificate?.image
          }')`,
          backgroundSize: "100%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          transform: "rotate(90deg) scale(1.345)",
          marginTop: 355,
        }),
      }}
    >
      <div
        className="print-page"
        style={{
          position: "relative",
          ...styles,
        }}
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
                      value={url}
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
            } else if (type === "date") {
              return (
                <Title key={key} id={key} left={left} top={top}>
                  {moment().locale("fa").format("D MMM YYYY")}
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
                <Title key={key} id={key} left={left} top={top}>
                  {itemUser?.user?.firstNameen} {itemUser?.user?.lastNameen}
                </Title>
              );
            } else if (type === "categoryen") {
              return (
                <Title key={key} id={key} left={left} top={top}>
                  {itemUser?.user?.category?.titleen}
                </Title>
              );
            } else if (type === "category") {
              return (
                <Title key={key} id={key} left={left} top={top}>
                  {itemUser?.user?.category?.title}
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
    </div>
  );
};

export default PrintableCertificate;
