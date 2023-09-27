// ** React Imports

import { t } from "i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Container } from "./Container";
import { useEffect, useState } from "react";
import { GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "../gql";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useGetUser } from "../../../../utility/gqlHelpers/useGetUser";

const PrintCard = ({ prevBoxes }) => {
  const { user, error } = useGetUser();

  const [boxes, setBoxes] = useState();

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    update({
      variables: {
        input: {
          id: user?.site[0].id,
          cardlayout: JSON.stringify(boxes),
        },
      },
    });
  };

  useEffect(() => {
    if (prevBoxes) {
      setBoxes(JSON.parse(prevBoxes));
    } else {
      setBoxes({
        a: { top: 20, left: 80, title: "عنوان رویداد", type: "title" },
        b: { top: 180, left: 20, title: "نام ونام خانوادگی", type: "name" },
        c: { top: 150, left: 190, title: "QRCODE", type: "qr" },
        d: { top: 250, left: 390, title: "لوگو رویداد", type: "logo" },
      });
    }
  }, [prevBoxes]);

  return (
    <Row>
      <Col md={8}>
        <Card>
          <CardHeader className="border-bottom d-flex justify-content-between w-100 flex-row">
            <CardTitle tag="h4">{t("Card setting")}</CardTitle>
            <div>
              <Button color="success" className="me-1" onClick={onSubmit}>
                {t("Update")}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="my-1 py-25">
            <DndProvider backend={HTML5Backend}>
              {boxes && <Container boxes={boxes} setBoxes={setBoxes} />}
            </DndProvider>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default PrintCard;
