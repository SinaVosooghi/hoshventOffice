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
import { useQuery, useMutation } from "@apollo/client";

// ** Styles
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { t } from "i18next";
import { GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "./gql";
import toast from "react-hot-toast";

const defaultValues = {
  confirmCheckbox: false,
};

const MySwal = withReactContent(Swal);

const DeleteAccount = ({ maintenance }) => {
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [update, { loading }] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: (data) => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmDelete = () => {
    return MySwal.fire({
      title: t("Are you sure?"),
      text: t("Are you sure you want to enable maintenance mode?"),
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
          cancelButtonText: t("Discard"),
          text: t("Maintenance mode enabled successfully"),
          customClass: {
            confirmButton: "btn btn-success",
          },
        });

        update({
          refetchQueries: [GET_ITEM_QUERY],
          variables: {
            input: {
              maintenance: !maintenance,
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
      handleConfirmDelete();
    } else {
      setError("confirmCheckbox", { type: "manual" });
    }
  };

  return (
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">{t("Enable maintenance mode")}</CardTitle>
      </CardHeader>
      <CardBody className="py-2 my-25">
        <Alert color={maintenance ? "success" : "warning"}>
          <h4 className="alert-heading">
            {maintenance
              ? t("Are you sure you want to enable maintenance mode?")
              : t("Are you sure you want to disable maintenance mode?")}
          </h4>
          <div className="alert-body fw-normal">
            {maintenance
              ? t(
                  "Once you enable maintenance mode, you will see a notification bar in all pages!"
                )
              : t(
                  "Once you disable maintenance mode, you will not see a notification bar in all pages!"
                )}
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
              {maintenance
                ? t("I confirm my maintenance deactivation")
                : t("I confirm my maintenance activation")}
            </Label>
            {errors.maintenance && (
              <FormFeedback>{errors.maintenance.message}</FormFeedback>
            )}
          </div>
          <div className="mt-1">
            <Button color={maintenance ? "success" : "danger"}>
              {maintenance
                ? t("Disable maintenance mode")
                : t("Enable maintenance mode")}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default DeleteAccount;
