// ** React Imports
import { useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import Select, { components } from "react-select";
import { Minus, X, Maximize2, MoreVertical, Trash, Send } from "react-feather";
import { hashConfig } from "../../../utility/Utils";

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Modal,
  Button,
  ModalBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  FormFeedback,
} from "reactstrap";

// ** Utils
import { selectThemeColors } from "@utils";

import { useQuery, useMutation } from "@apollo/client";

// ** Styles
import "@styles/react/libs/editor/editor.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import { t } from "i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { getUsersSelect } from "../../../utility/gqlHelpers/getUsers";
import { useEffect } from "react";
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY } from "./gql";
import { useGetSelectDepartments } from "../../../utility/gqlHelpers/useGetSelectDepartments";

const ComposePopup = (props) => {
  const SignupSchema = yup.object().shape({
    subject: yup.string().required(`${t("Subject")} ${t("field is required")}`),
  });
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [usersOptions, setUsersOptions] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(null);

  const usersData = getUsersSelect();
  const departmentsData = useGetSelectDepartments();

  useEffect(() => {
    if (departmentsData.length) {
      setDepartmentOptions(departmentsData);
    }
  }, [departmentsData]);

  useEffect(() => {
    if (usersData.length) {
      setUsersOptions(usersData);
    }
  }, [usersData]);

  // ** Props & Custom Hooks
  const { composeOpen, toggleCompose } = props;

  // ** Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

  // ** Toggles Compose POPUP
  const togglePopUp = (e) => {
    e.preventDefault();
    toggleCompose();
  };

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toggleCompose();
      reset();
      setDescription(EditorState.createEmpty());
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  // ** User Select Options & Components
  const priorityOptions = [
    { value: "high", label: t("High") },
    { value: "medium", label: t("Medium") },
    { value: "low", label: t("Low") },
  ];

  const typesOptions = [
    { value: "alert", label: t("Alert") },
    { value: "success", label: t("Success") },
    { value: "info", label: t("Info") },
    { value: "warning", label: t("Warning") },
  ];

  const SelectComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className="d-flex flex-wrap align-items-center">{data.label}</div>
      </components.Option>
    );
  };

  const onSubmit = (data) => {
    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);
    const users = data?.to?.map((user) => user.value);
    delete data.to;

    create({
      variables: {
        input: {
          ...data,
          body: markup,
          status: data.status?.value,
          type: data.type?.value,
          priority: data.priority?.value,
          department: data.department?.value,
          to: users,
        },
      },
    });
  };

  return (
    <Modal
      scrollable
      fade={false}
      keyboard={false}
      backdrop={false}
      id="compose-mail"
      container=".content-body"
      className="modal-lg"
      isOpen={composeOpen}
      contentClassName="p-0"
      toggle={toggleCompose}
      modalClassName="modal-sticky"
    >
      <div className="modal-header">
        <h5 className="modal-title">{t("Compose Mail")}</h5>
        <div className="modal-actions">
          <a href="/" className="text-body me-75" onClick={togglePopUp}>
            <Minus size={14} />
          </a>
          <a
            href="/"
            className="text-body me-75"
            onClick={(e) => e.preventDefault()}
          >
            <Maximize2 size={14} />
          </a>
          <a href="/" className="text-body" onClick={togglePopUp}>
            <X size={14} />
          </a>
        </div>
      </div>
      <ModalBody className="flex-grow-1 p-0">
        <Form className="compose-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="compose-mail-form-field">
            <Label for="email-to" className="form-label">
              {t("To")}:
            </Label>
            <div className="flex-grow-1">
              <Controller
                name="to"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    id="to"
                    isClearable={false}
                    theme={selectThemeColors}
                    options={usersOptions}
                    className="react-select select-borderless"
                    placeholder={t("Select...")}
                    classNamePrefix="select"
                    components={{ Option: SelectComponent }}
                    {...field}
                  />
                )}
              />
              {errors.to && (
                <FormFeedback style={{ display: "block" }}>
                  {errors.to.message}
                </FormFeedback>
              )}
            </div>
          </div>
          <div className="compose-mail-form-field">
            <Label for="email-to" className="form-label">
              {t("Type")}:
            </Label>
            <div className="flex-grow-1">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    id="type"
                    isClearable={false}
                    theme={selectThemeColors}
                    options={typesOptions}
                    className="react-select select-borderless"
                    placeholder={t("Select...")}
                    classNamePrefix="select"
                    components={{ Option: SelectComponent }}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="compose-mail-form-field">
            <Label for="email-to" className="form-label">
              {t("Priority")}:
            </Label>
            <div className="flex-grow-1">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    id="priority"
                    isClearable={false}
                    theme={selectThemeColors}
                    options={priorityOptions}
                    className="react-select select-borderless"
                    placeholder={t("Select...")}
                    classNamePrefix="select"
                    components={{ Option: SelectComponent }}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="compose-mail-form-field">
            <Label for="email-to" className="form-label">
              {t("Department")}:
            </Label>
            <div className="flex-grow-1">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    id="department"
                    isClearable={false}
                    theme={selectThemeColors}
                    options={departmentOptions}
                    className="react-select select-borderless"
                    placeholder={`${t("Select")} ${t("Department")}...`}
                    classNamePrefix="select"
                    components={{ Option: SelectComponent }}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="compose-mail-form-field">
            <Label for="email-subject" className="form-label">
              {t("Subject")}:
            </Label>
            <Controller
              id="subject"
              name="subject"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Input
                  placeholder={`${t("Subject")}`}
                  {...field}
                  invalid={errors.subject && true}
                />
              )}
            />
          </div>
          <div id="message-editor">
            <Editor
              editorState={description}
              onEditorStateChange={(data) => setDescription(data)}
              placeholder={t("Message")}
              toolbarClassName="rounded-0"
              wrapperClassName="toolbar-bottom"
              editorClassName="rounded-0 border-0"
              toolbar={{
                options: ["inline", "textAlign", "link"],
                inline: {
                  inDropdown: false,
                  options: ["bold", "italic", "underline", "strikethrough"],
                },
              }}
            />
          </div>
          <div className="compose-footer-wrapper">
            <div className="btn-wrapper d-flex align-items-center">
              <Button color="primary" type="submit" className="me-1">
                {t("Send")} <Send />
              </Button>
            </div>
            <div className="footer-action d-flex align-items-center">
              <UncontrolledDropdown className="me-50" direction="up">
                <DropdownToggle tag="span">
                  <MoreVertical className="cursor-pointer" size={18} />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    href="/"
                    tag="a"
                    onClick={(e) => e.preventDefault()}
                  >
                    Add Label
                  </DropdownItem>
                  <DropdownItem
                    href="/"
                    tag="a"
                    onClick={(e) => e.preventDefault()}
                  >
                    Plain text mode
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    href="/"
                    tag="a"
                    onClick={(e) => e.preventDefault()}
                  >
                    Print
                  </DropdownItem>
                  <DropdownItem
                    href="/"
                    tag="a"
                    onClick={(e) => e.preventDefault()}
                  >
                    Check Spelling
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <Trash
                className="cursor-pointer"
                size={18}
                onClick={toggleCompose}
              />
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ComposePopup;
