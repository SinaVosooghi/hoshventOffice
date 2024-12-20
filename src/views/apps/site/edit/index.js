// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane, Form } from "reactstrap";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Demo Components
import Tabs from "./Tabs";
import Breadcrumbs from "@components/breadcrumbs";
import BillingTabContent from "./BillingTabContent";
import AccountTabContent from "./AccountTabContent";
import { convertHtmlToDraft } from "../../../../utility/Utils";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { t } from "i18next";
import { useForm } from "react-hook-form";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ITEM_QUERY, GET_ITEMS_QUERY, UPDATE_ITEM_MUTATION } from "../gql";
import { useGetUser } from "../../../../utility/gqlHelpers/useGetUser";
import { useEffect } from "react";
import RegisterFields from "./RegisterFields";
import PrintCard from "./PrintCard";

const AccountSettings = () => {
  const FormSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
  });

  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [logo, setLogo] = useState(null);
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(1);
  const [banner, setBanner] = useState(null);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  // ** Hooks
  const defaultValues = {
    title: "",
  };
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(FormSchema),
  });
  const { user, error } = useGetUser();

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const [getWebsite] = useLazyQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: async ({ site }) => {
      if (site) {
        setData(site);
        setDescription(convertHtmlToDraft(site.body));

        for (const [key, value] of Object.entries(site)) {
          setValue(key, value);
        }

        setLogo(site.logo);
        setBanner(site.banner);
        setCount(site.registerFields?.length);

        reset({
          ...site,
          isNationalCode:
            site.isNationalCode === "ncode"
              ? {
                  label: t("National Code"),
                  value: site.isNationalCod,
                }
              : {
                  label: t("Mobile"),
                  value: site.isNationalCod,
                },
        });
      }
    },
  });

  useEffect(() => {
    if (user?.site || user?.siteid) {
      getWebsite({
        variables: {
          id: user?.site[0]?.id || user?.siteid?.id,
        },
      });
    }
  }, [user]);

  const onSubmit = (data) => {
    delete data.__typename;
    delete data.created;
    delete data.updated;
    delete data.plan;
    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);

    const logo = data.logo;
    const banner = data.banner;

    delete data.logo;
    delete data.banner;

    update({
      variables: {
        input: {
          ...data,
          body: markup,
          isNationalCode: data?.isNationalCode.value,
          ...(typeof logo !== "string" && { logo }),
          ...(typeof banner !== "string" && { banner }),
        },
      },
    });
  };

  const handleChangeItems = (item) => {
    const foundItem = items.findIndex((p) => p.idx === item.idx);
    delete foundItem.__typename;

    if (foundItem === -1) {
      setItems([...items, item]);
    } else {
      let newArr = [...items];
      newArr[foundItem] = item;

      setItems(newArr);
    }
  };

  const deleteItem = (i) => {
    const filter = items.filter((p) => p.idx !== i);

    setItems(filter);
  };

  return (
    <Fragment>
      <Breadcrumbs
        title={t("Site")}
        data={[{ title: t("Pages") }, { title: t("Site") }]}
      />
      <Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <AccountTabContent
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  description={description}
                  setDescription={setDescription}
                  setLogo={setLogo}
                  logo={logo}
                  banner={banner}
                />
              </TabPane>
              <TabPane tabId="2">
                <RegisterFields
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  defaultCount={count}
                  handleChangeItems={handleChangeItems}
                  items={items}
                  deleteItem={deleteItem}
                  register={register}
                  {...{
                    control,
                    register,
                    defaultValues,
                    getValues,
                    setValue,
                    errors,
                  }}
                />
              </TabPane>
              <TabPane tabId="3">
                <BillingTabContent
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                />
              </TabPane>
              <TabPane tabId="4">
                <PrintCard
                  prevBoxes={data?.cardlayout}
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                />
              </TabPane>
            </TabContent>
          </Col>
        </Form>
      </Row>
    </Fragment>
  );
};

export default AccountSettings;
