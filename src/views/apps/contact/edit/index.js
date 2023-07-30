// ** React Import
import { useState } from "react";

// ** Custom Components
import { useNavigate, useParams } from "react-router-dom";

// ** Third Party Components
import { useForm } from "react-hook-form";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  DropdownMenu,
  CardTitle,
  CardBody,
  Row,
  Col,
  DropdownToggle,
  UncontrolledDropdown,
  Table,
} from "reactstrap";
// ** Store & Actions/ReactDropzoneUploader";
import moment from "moment";
import { useQuery } from "@apollo/client";

import { GET_ITEM_QUERY } from "../gql.js";
import { t } from "i18next";

const Add = ({ toggleSidebar }) => {
  const { id } = useParams();
  // ** Vars
  const {
    setValue,
    formState: { errors },
  } = useForm();

  // ** States

  const { data, loading } = useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    onCompleted: ({ contact }) => {
      if (contact) {
        for (const [key, value] of Object.entries(contact)) {
          setValue(key, value);
        }
      }
    },
  });

  return (
    <Row>
      <Col md={12}>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">{t("Contacts")}</CardTitle>
            <CardBody>{data?.contact?.subject}</CardBody>
          </CardHeader>
          <CardHeader className="email-detail-head">
            <div className="user-details d-flex justify-content-between align-items-center flex-wrap">
              <div className="mail-items">
                <h5 className="mb-0">{data?.contact.name}</h5>
                <UncontrolledDropdown className="email-info-dropup">
                  <DropdownToggle
                    className="font-small-3 text-muted cursor-pointer"
                    tag="span"
                    caret
                  >
                    <span className="me-25">{data?.contact.email}</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <Table className="font-small-3" size="sm" borderless>
                      <tbody>
                        <tr>
                          <td className="text-end text-muted align-top">
                            From:
                          </td>
                          <td>{data?.contact.email}</td>
                        </tr>
                        <tr>
                          <td className="text-end text-muted align-top">
                            Date:
                          </td>
                          <td>
                            {moment(data?.contact.created)
                              .locale("fa")
                              .format("YYYY/MM/D")}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
            <div className="mail-meta-item d-flex align-items-center">
              <small className="mail-date-time text-muted">
                {moment(data?.contact.created).locale("fa").format("YYYY/MM/D")}
              </small>
            </div>
          </CardHeader>
          <CardBody className="mail-message-wrapper pt-2">
            <div
              className="mail-message"
              dangerouslySetInnerHTML={{ __html: data?.contact.body }}
            ></div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Add;
