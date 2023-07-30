import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { X } from "react-feather";
import { Controller, useFieldArray } from "react-hook-form";
import { Button, Col, Label, Row } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";

export default ({ nestIndex, control, register, lessons }) => {
  const { fields, remove, append, onChange } = useFieldArray({
    control,
    name: `section[${nestIndex}].lessons`,
  });

  const [allLessons, setAllLessons] = useState([
    { value: "", label: `${t("Select")} ${t("Lessons")}...`, data: null },
  ]);

  useEffect(() => {
    lessons?.map((lesson) => {
      setAllLessons((prev) => [
        ...prev,
        {
          value: lesson.id,
          label: lesson.title,
        },
      ]);
    });

    // if (items) {
    //   const a = items.map((item, i) => {
    //     item?.lessons?.map((lesson, j) => {
    //       console.log(lesson);
    //       setLessonCount((prev) => [
    //         ...prev,
    //         {
    //           idx: i,
    //           order: lesson.order,
    //           lesson: {
    //             label: lesson.lesson?.title,
    //             value: lesson.lesson?.id,
    //           },
    //         },
    //       ]);
    //     });
    //   });
    // }
  }, [lessons]);

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <Row key={item.id} style={{ marginLeft: 20 }} className="mt-1 mb-1">
            <Col md={1}>
              <Label className="form-label">{t("Lesson")}</Label>
            </Col>
            <Col md={1}>
              <input
                {...register(`section[${nestIndex}].lessons[${k}].order`, {
                  required: true,
                })}
                className="form-control"
                defaultValue={item.order}
                style={{ marginRight: "25px" }}
              />
            </Col>
            <Col md={4}>
              <Controller
                id={`section[${nestIndex}].lessons[${k}].lesson`}
                name={`section[${nestIndex}].lessons[${k}].lesson`}
                control={control}
                render={({ field }) => {
                  const { onChange, value, name, ref } = field;

                  return (
                    <Select
                      name={name}
                      inputRef={ref}
                      value={allLessons.find((c) => c.value === value?.id)}
                      isClearable={false}
                      classNamePrefix="select"
                      options={allLessons}
                      onChange={(v) => {
                        onChange(v.value);
                      }}
                      theme={selectThemeColors}
                      placeholder={`${t("Select")} ${t("Type")}...`}
                    />
                  );
                }}
              />
            </Col>
            <Col md={2}>
              <Button
                color="danger"
                onClick={() => remove(k)}
                outline
                size="sm"
              >
                <X size={14} />
              </Button>
            </Col>
          </Row>
        );
      })}

      <Button
        color="primary"
        size="sm"
        className="btn-add-new mt-1"
        onClick={() =>
          append({
            order: 0,
            lesson: null,
          })
        }
      >
        {t("Add Lesson")}
      </Button>

      <hr />
    </div>
  );
};
