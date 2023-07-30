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
} from "reactstrap";

// ** Utils
import { useMutation } from "@apollo/client";

// ** Demo Components
import { t } from "i18next";
import { GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "./gql";

// ** Editor
import { EditorState } from "draft-js";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { convertHtmlToDraft } from "../../../utility/Utils";

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "IRR", label: "IRR" },
];

const ShopContent = ({ data }) => {
  // ** Hooks
  const defaultValues = {
    title: data?.title?.split(" ")[0],
  };

  const [description, setDescription] = useState(EditorState.createEmpty());

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (data) {
      data.description && setDescription(convertHtmlToDraft(data.description));
      for (const [key, value] of Object.entries(data)) {
        setValue(key, value);
      }
      if (data.currency) {
        reset({
          tax: data.tax,
          currency: {
            label: data.currency,
            value: data.currency,
          },
        });
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

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          tax: data.tax ? parseFloat(data.tax) : null,
          currency: data.currency ? data.currency?.value : null,
        },
      },
    });
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("Shop setting")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="3" className="mb-1">
                <Label className="form-label" for="tax">
                  {t("Tax")}
                </Label>
                <Controller
                  name="tax"
                  control={control}
                  render={({ field }) => (
                    <Input name="tax" placeholder={t("Tax")} {...field} />
                  )}
                />
              </Col>
              {/* <Col md={4}>
                <Label className="form-label" for="currency">
                  {t("Currency")}
                </Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      options={currencyOptions}
                      theme={selectThemeColors}
                      defaultValue={currencyOptions[0]}
                      placeholder={t("Select...")}
                      className="react-select"
                      {...field}
                    />
                  )}
                />
              </Col> */}

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

export default ShopContent;
