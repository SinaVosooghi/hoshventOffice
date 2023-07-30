/* eslint-disable multiline-ternary */
// ** React Imports
import { useState, Fragment } from "react";

// ** Reactstrap Imports
import {
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Media,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";

import Avatar from "@components/avatar";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";
import axios from "axios";
import { validateURL } from "@utils";
import toast from "react-hot-toast";
import { t } from "i18next";

const ErrorToast = () => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="danger" icon={<X size={12} />} />
        <h6 className="toast-title">Error!</h6>
      </div>
      <small className="text-muted">a second ago</small>
    </div>
    <div className="toastify-body">
      <span role="img" aria-label="toast-text">
        👋 You can only upload image Files!.
      </span>
    </div>
  </Fragment>
);

export const DropzoneUplodareMultiple = ({ title, setImages, images }) => {
  // ** State
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 4,
    accept: "image/*",
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        toast.error(<ErrorToast />, { icon: false, hideProgressBar: true });
      } else {
        setFiles([
          ...files,
          ...acceptedFiles.map((file) => Object.assign(file)),
        ]);

        const formData = new FormData();

        acceptedFiles.map((file) => formData.append("image", file));

        axios
          .post(import.meta.env.VITE_UPLOAD_MULTIPLE_API, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(({ data }) => setImages(data));
      }
    },
  });

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    } else {
      return <FileText size="28" />;
    }
  };

  const handleRemoveFile = (file, index) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);

    const array = [...files]; // make a separate copy of the array
    if (index !== -1) {
      array.splice(index, 1);
      setImages(array);
    }
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={(index) => handleRemoveFile(file, index)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleRemoveImage = (e) => {
    const array = [...images]; // make a separate copy of the array
    if (e !== -1) {
      array.splice(e, 1);
      setImages(array);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="d-flex align-items-center justify-content-center flex-column text-center">
            <DownloadCloud size={64} />
            <h5>{t("Drop Files here or click to upload")}</h5>
            <p className="text-secondary">
              {t("Drop files here or click")}{" "}
              <a href="/" onClick={(e) => e.preventDefault()}>
                {t("Browse")}
              </a>{" "}
              {t("thorough your machine")}
            </p>
          </div>
        </div>
        {files.length ? (
          <Fragment>
            <ListGroup className="my-2">{fileList}</ListGroup>
            <div className="d-flex justify-content-end">
              <Button
                className="me-1"
                color="danger"
                outline
                onClick={handleRemoveAllFiles}
              >
                {t("Remove All")}
              </Button>
            </div>
          </Fragment>
        ) : null}

        <Row>
          {images &&
            images.map((image, index) => (
              <Col
                md={2}
                style={{ margin: 10, height: 150, alignItems: "center" }}
                className="d-flex flex-column justify-content-between"
              >
                {
                  <Media
                    objectFit="contain"
                    object
                    style={{ width: 100, heigth: "100%" }}
                    src={
                      validateURL(image)
                        ? image
                        : process.env.REACT_APP_BASE_API + "/" + image
                    }
                  />
                }
                <Button
                  color="danger"
                  outline
                  onClick={() => handleRemoveImage(index)}
                >
                  Remove
                </Button>
              </Col>
            ))}
        </Row>
      </CardBody>
    </Card>
  );
};
