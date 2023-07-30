import { t } from "i18next";
import React from "react";
import { X } from "react-feather";
import { useFieldArray } from "react-hook-form";
import { Button, Col, Label, Row } from "reactstrap";
import NestedLessons from "./NestedLessons";

export default function Fields({
  control,
  register,
  setValue,
  getValues,
  lessons,
}) {
  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "section",
  });

  return (
    <>
      <ul>
        {fields.map((item, index) => {
          return (
            <div key={item.id} className="section-item">
              <Row className="justify-content-between align-items-center mb-1">
                <Col md={10} className="mb-md-0 mb-1">
                  <Label
                    className="form-label"
                    for={`animation-item-name-${index}`}
                  >
                    {t("Section title")}
                  </Label>
                  <input
                    {...register(`section[${index}].title`, {
                      required: true,
                    })}
                    placeholder={t("Section title")}
                    className="form-control"
                    defaultValue={item.name}
                  />
                </Col>
                <Col md={2}>
                  <Button
                    color="danger"
                    onClick={() => remove(index)}
                    className="mt-2"
                    outline
                    size="sm"
                  >
                    <X size={14} />
                  </Button>
                </Col>

                <NestedLessons
                  nestIndex={index}
                  {...{ control, register }}
                  lessons={lessons}
                />
              </Row>
            </div>
          );
        })}
      </ul>

      <section>
        <Button
          color="primary"
          className="btn-add-new mt-1 mb-1"
          type="button"
          onClick={() => {
            append({ name: "" });
          }}
          block
          outline
        >
          <span className="align-middle">{t("Add Section")}</span>
        </Button>
      </section>
    </>
  );
}
