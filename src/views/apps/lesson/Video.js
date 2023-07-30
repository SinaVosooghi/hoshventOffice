import { t } from "i18next";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { Button, Col, Input, Label } from "reactstrap";
import { selectThemeColors } from "@utils";
import { useState } from "react";
import VideoUploaderSingle from "../../forms/form-elements/file-uploader/VideoUploaderSingle";

const typeOptions = [
  { value: null, label: `${t("Select")} ${t("Type")}...` },
  { value: "link", label: t("Link") },
  { value: "video", label: t("Video") },
];

const VideoOptions = ({ control, errors, video, setVideo }) => {
  const [type, setType] = useState(null);

  const onRemoveClick = () => {
    setVideo(null);
  };

  return (
    <>
      <div className="divider divider-start">
        <div className="divider-text">{t("Video Options")}</div>
      </div>

      <Col md={3} xs={12}>
        <Label className="form-label" for="videooptions.type">
          {t("Type")}:
        </Label>

        <Controller
          id="videooptions.type"
          name="videooptions.type"
          defaultValue=""
          control={control}
          render={({ field }) => {
            const { onChange, value, name, ref } = field;

            if (typeOptions.find((c) => c.value === value.value)) {
              setType(typeOptions.find((c) => c.value === value.value).value);
            }

            return (
              <Select
                name={name}
                inputRef={ref}
                value={typeOptions.find((c) => c.value === value.value)}
                isClearable={false}
                classNamePrefix="select"
                options={typeOptions}
                onChange={(v) => {
                  setType(v.value);
                  onChange(v.value);
                }}
                theme={selectThemeColors}
                placeholder={`${t("Select")} ${t("Type")}...`}
              />
            );
          }}
        />
      </Col>

      {type === "link" && (
        <>
          <Col md={12} xs={12} className="mt-1">
            <Label className="form-label" for="link">
              {t("Link")}
            </Label>
            <Controller
              id="videooptions.link"
              name="videooptions.link"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("Link")}
                  invalid={errors.link && true}
                />
              )}
            />
          </Col>
        </>
      )}

      {type === "video" && (
        <>
          <Col md={12} xs={12} className="mt-1">
            <Label className="form-label" for="title">
              {t("Width")}
            </Label>
            <Controller
              id="width"
              name="videooptions.width"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder={t("Width")} />
              )}
            />
          </Col>

          {video && (
            <>
              <video
                src={`${import.meta.env.VITE_BASE_API}/video/${video}`}
                width="750"
                height="500"
                controls
              ></video>
              <Button
                color="danger"
                outline
                size="sm"
                onClick={() => {
                  onRemoveClick();
                }}
              >
                {t("Remove")}
              </Button>
            </>
          )}
          <Col md={12} xs={12} className="mt-1">
            <VideoUploaderSingle
              title={t("Upload Video")}
              setImages={setVideo}
              isMultiple={false}
            />
          </Col>
        </>
      )}
    </>
  );
};

export default VideoOptions;
