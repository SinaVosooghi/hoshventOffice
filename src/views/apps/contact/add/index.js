// ** React Import
import { useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";
import { useNavigate, useParams } from "react-router-dom";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import {
  Button,
  Label,
  FormText,
  Form,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
} from "reactstrap";
// ** Store & Actions
import FileUploaderSingle from "../../../forms/form-elements/file-uploader/FileUploaderSingle";

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useMutation } from "@apollo/client";

import { CREATE_ITEM_MUTATION, FA_ITEM_NAME, GET_ITEMS_QUERY } from "../gql.js";
import toast from "react-hot-toast";


const Add = ({ toggleSidebar }) => {
  const { type } = useParams()

  // ** States
  const [images, setImages] = useState(null);

  const history = useNavigate();

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success("اطلاعات با موفقیت ذخیره شد");
      history(`/sliders/list`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("خطا در ارتباط با سرور");
    },
  });

  // ** Vars
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ** Function to handle form submit
  const onSubmit = (data) => {
    create({
      variables: {
        refetchQueries: [GET_ITEMS_QUERY],
        input: {
          ...data,
          type,
          image: images,

        },
      },
    });
  };


  return (<>
    <Row>
      <Col md={9}>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">افزودن {FA_ITEM_NAME}</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-1">
                <Col md={10}>
                  <Label className="form-label" for="fullName">
                    آدرس (لینک) {FA_ITEM_NAME} <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="link"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="link"
                        required
                        placeholder="http://google.com"
                        invalid={errors.title && true}
                        {...field}
                      />
                    )}
                  />
                </Col>
                <Col md={2}>
                  <br />
                  <div className="form-check">
                    <Label className="form-label" for="status">
                      وضعیت نمایش
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue={true}
                      render={({ field }) => (
                        <Input
                          type="checkbox"
                          name="status"
                          id="status"
                          defaultChecked
                          {...field}
                        />
                      )}
                    />
                  </div>{" "}
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="mb-2">
                    <Label for="note" className="form-label fw-bold">
                      توضیحات {FA_ITEM_NAME}
                    </Label>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Input
                          type="textarea"
                          rows="2"
                          id="note"
                          placeholder="توضیحات"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
              </Row>


              <Button type="submit" className="me-1" color="primary">
                ثبت
              </Button>
            </Form>
          </CardBody>

        </Card>


      </Col>
      <Col md={3}>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">تنظیمات</CardTitle>
          </CardHeader>
        </Card>
        <FileUploaderSingle title="بارگذاری تصاویر" setImages={setImages} />
      </Col>
    </Row>
  </>
  );
};

export default Add;
