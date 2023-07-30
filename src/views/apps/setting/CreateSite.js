// ** Reactstrap Imports
import {
  Card,
  Button,
  CardHeader,
  CardTitle,
  CardBody,
  Alert,
  Form,
  Input,
  Label,
  FormFeedback,
} from "reactstrap";

// ** Third Party Components
import Swal from "sweetalert2";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";
import withReactContent from "sweetalert2-react-content";

// ** Styles
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { useMutation } from "@apollo/client";
import { CREATE_ITEM_MUTATION, GET_ITEM_QUERY } from "./gql";
import toast from "react-hot-toast";
import { t } from "i18next";

const defaultValues = {
  confirmCheckbox: false,
};

const MySwal = withReactContent(Swal);

const CreateSite = () => {
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [createWebsite, { loading }] = useMutation(CREATE_ITEM_MUTATION, {
    onCompleted: (data) => {
      toast.success("Item created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmCreate = () => {
    return MySwal.fire({
      title: t("Are you sure?"),
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Discard"),
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          icon: "success",
          title: t("Created"),
          confirmButtonText: t("Confirm"),
          text: t("Settings created successfully"),
          customClass: {
            confirmButton: "btn btn-success",
          },
        });

        createWebsite({
          refetchQueries: [GET_ITEM_QUERY],
          variables: {
            input: {
              title: "Website",
            },
          },
        });
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: t("Cancelled"),
          text: t("Creation Cancelled!!"),
          icon: "error",
          confirmButtonText: t("Confirm"),
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      }
    });
  };

  const onSubmit = (data) => {
    if (data.confirmCheckbox === true) {
      handleConfirmCreate();
    } else {
      setError("confirmCheckbox", { type: "manual" });
    }
  };

  return (
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">{t("Build initial settings")}</CardTitle>
      </CardHeader>
      <CardBody className="py-2 my-25">
        <Alert color="success">
          <h4 className="alert-heading">
            {t("Are you sure to make the initial settings?")}
          </h4>
          <div className="alert-body fw-normal">
            {t("After making the settings, it cannot be reversed!")}
          </div>
        </Alert>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-check">
            <Controller
              control={control}
              name="confirmCheckbox"
              render={({ field }) => (
                <Input
                  {...field}
                  type="checkbox"
                  id="confirmCheckbox"
                  checked={field.value}
                  invalid={errors.confirmCheckbox && true}
                />
              )}
            />
            <Label
              for="confirmCheckbox"
              className={classnames("form-check-label", {
                "text-danger": errors && errors.confirmCheckbox,
              })}
            >
              {t("Agree")}
            </Label>
            {errors && errors.confirmCheckbox && <FormFeedback></FormFeedback>}
          </div>
          <div className="mt-1">
            <Button color="success">{t("Make initial settings")}</Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default CreateSite;
