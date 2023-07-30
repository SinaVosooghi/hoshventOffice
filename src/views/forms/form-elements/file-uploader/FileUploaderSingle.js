// ** React Imports
import { useState, Fragment, useEffect } from "react";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";
import axios from "axios";
import { t } from "i18next";

const FileUploaderSingle = ({ title, setImages, isMultiple }) => {
  // ** State
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: isMultiple,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      const body = new FormData();
      body.append("image", ...acceptedFiles.map((file) => Object.assign(file)));

      axios
        .post(`${import.meta.env.VITE_BASE_API}/multiple`, body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setFilename(res.data[0].filename);
          setImages(res.data[0].filename);
        })
        .catch((err) => console.log("err", err));

      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
    },
  });

  useEffect(() => {
    if (filename) {
      setImages(filename);
    }
  }, [filename]);

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

  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
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
        <div className="file-preview ms-1">{renderFilePreview(file)}</div>
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
        onClick={() => handleRemoveFile(file)}
      >
        <X size={10} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
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
                // className="me-1"
                color="danger"
                outline
                onClick={handleRemoveAllFiles}
              >
                {t("Remove All")}
              </Button>
            </div>
          </Fragment>
        ) : null}
      </CardBody>
    </Card>
  );
};

export default FileUploaderSingle;
