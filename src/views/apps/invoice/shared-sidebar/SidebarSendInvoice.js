// ** Custom Components
import Sidebar from "@components/sidebar";
import { yupResolver } from "@hookform/resolvers/yup";
import { t } from "i18next";
import { useEffect, useState } from "react";

// ** Icons Imports
import { Link, Send } from "react-feather";
import { Controller, useForm } from "react-hook-form";

// ** Reactstrap Imports
import { Form, Input, Label, Badge, Button } from "reactstrap";
import { getUsersSelect } from "../../../../utility/gqlHelpers/getUsers";
import * as yup from "yup";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import classnames from "classnames";
import { CREATE_INVOICE_CHAT_ITEM_MUTATION } from "../../ticket/gql";
import { GET_ITEM_QUERY } from "../gql";
import { useMutation } from "@apollo/client";
import { getUserData } from "../../../../utility/Utils";

const SidebarSendInvoice = ({ selectedInvoice, open, toggleSidebar }) => {
  const FormSchema = yup.object().shape({
    user: yup.object().required(`${t("User")} ${t("field is required")}`),
  });

  const [clients, setClients] = useState(null);
  const [data, setData] = useState(null);

  const usersData = getUsersSelect();
  const localUser = getUserData();

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(FormSchema) });

  useEffect(() => {
    if (usersData.length) {
      setClients(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if (selectedInvoice?.user) {
      reset({
        subject: `${t("Invoice number #")}${selectedInvoice.invoicenumber}`,
        message: `${t("Hi")} ${selectedInvoice.user.firstName}, \n${t(
          "We have attached an Invoice with this number"
        )} #${selectedInvoice.invoicenumber} ${t("for you")}.`,
        user: selectedInvoice.user && {
          value: selectedInvoice?.user.id,
          label:
            `(${selectedInvoice?.user.id}) ` +
            selectedInvoice?.user.firstName +
            " " +
            selectedInvoice?.user.lastName,
        },
      });
    }
  }, [selectedInvoice]);

  const [create] = useMutation(CREATE_INVOICE_CHAT_ITEM_MUTATION, {
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: () => {
      reset();
      toggleSidebar();
      toast.success(t("Message sent successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    const user = [data.user?.value];
    delete data.user;

    create({
      variables: {
        input: {
          invoice: selectedInvoice.id,
          subject: data.subject,
          body: data.message,
          priority: "high", // Dummy, just for passing the validations it will handled in the backend
          type: "invoice", // Dummy, just for passing the validations it will handled in the backend
          to: user,
        },
      },
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={t("Send Invoice")}
      headerClassName="mb-1"
      contentClassName="p-0"
      bodyClassName="pb-sm-0 pb-3"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label for="invoice-to" className="form-label">
            {t("To")}
          </Label>
          <Controller
            name="user"
            control={control}
            render={({ field }) => (
              <Select
                classNamePrefix="select"
                options={clients}
                theme={selectThemeColors}
                placeholder={`${t("Select")} ${t("User")}...`}
                className={classnames("react-select", {
                  "is-invalid": data !== null && data.user === null,
                })}
                {...field}
              />
            )}
          />
          {errors.user && (
            <FormFeedback style={{ display: "block" }}>
              {errors.user.message}
            </FormFeedback>
          )}
        </div>
        <div className="mb-1">
          <Label for="invoice-subject" className="form-label">
            {t("Subject")}
          </Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Input
                defaultValue={t("Subject")}
                placeholder={t("Subject")}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label for="invoice-message" className="form-label">
            {t("Message")}
          </Label>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Input type="textarea" cols="3" rows="11" {...field} />
            )}
          />
        </div>
        <div className="mb-1">
          <Badge color="light-primary">
            <Link className="me-50" size={14} />
            <span className="align-middle">{t("Invoice Attached")}</span>
          </Badge>
        </div>
        <div className="d-flex flex-wrap mt-2">
          <Button className="me-1" color="primary" type="submit">
            {t("Send")} <Send size={14} />
          </Button>
          <Button color="secondary" outline onClick={toggleSidebar}>
            {t("Cancel")}
          </Button>
        </div>
      </Form>
    </Sidebar>
  );
};

export default SidebarSendInvoice;
