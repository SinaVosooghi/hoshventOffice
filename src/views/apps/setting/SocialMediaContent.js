// ** React Imports
import { Fragment, useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.us";
// ** Custom Components
import Avatar from "@components/avatar";
import { showImage } from "@utils";
import toast from "react-hot-toast";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
} from "reactstrap";

// ** Utils
import { useMutation } from "@apollo/client";

// ** Demo Components
import { t } from "i18next";
import { GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "./gql";
import axios from "axios";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../utility/Utils";
import { convertHtmlToDraft } from "../../../utility/Utils";

const SocialMediaContent = ({ data }) => {
  // ** Hooks
  const defaultValues = {
    title: data?.title?.split(" ")[0],
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        setValue(key, value);
      }
    }
  }, [data]);

  // ** States
  const [update, { loading }] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: (data) => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    delete data.__typename;
    delete data.created;
    delete data.updated;
    delete data.id;
    delete data.logo;

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
        },
      },
    });
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("Social media setting")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="instagram">
                  {t("Instagram")}
                </Label>
                <Controller
                  name="instagram"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="instagram"
                      placeholder={t("Instagram")}
                      invalid={errors.title && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="twitter">
                  {t("Twitter")}
                </Label>
                <Controller
                  name="twitter"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="twitter"
                      placeholder={t("Twitter")}
                      invalid={errors.title && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="linkedin">
                  {t("Linkedin")}
                </Label>
                <Controller
                  name="linkedin"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="linkedin"
                      placeholder={t("Linkedin")}
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="facebook">
                  {t("Facebook")}
                </Label>
                <Controller
                  name="facebook"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name="facebook"
                      placeholder={t("Facebook")}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="Youtube">
                  {t("Youtube")}
                </Label>
                <Controller
                  name="youtube"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name="youtube"
                      placeholder={t("Youtube")}
                      {...field}
                    />
                  )}
                />
              </Col>

              <Col className="mt-2" sm="12">
                <Button type="submit" className="me-1" color="primary">
                  {t("Save changes")}
                </Button>
                <Button color="secondary" outline>
                  {t("Discard")}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default SocialMediaContent;
