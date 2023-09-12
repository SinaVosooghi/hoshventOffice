import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Plus, X } from "react-feather";
import { Controller, useFieldArray } from "react-hook-form";
import { Button, Col, Label, Row } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const typeOptions = [
  { value: "string", label: t("String") },
  { value: "number", label: t("ٔNumber") },
];

export default ({ nestIndex, control, register }) => {
  const { fields, remove, append, onChange } = useFieldArray({
    control,
    name: `registerFields`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        console.log(item,k)
        return (
          <Row key={item.id} style={{ marginLeft: 20 }} className="mt-1 mb-1">
            <Col md={1}>
              <Label className="form-label">{t("Order")}</Label>
              <input
                {...register(`registerFields[${k}].order`, {
                  required: true,
                })}
                type="number"
                className="form-control"
                defaultValue={item.title}
              />
            </Col>
            <Col md={4}>
              <Label className="form-label">{t("Title")}</Label>
              <input
                {...register(`registerFields[${k}].title`, {
                  required: true,
                })}
                className="form-control"
                defaultValue={item.title}
              />
            </Col>
            <Col md={2}>
              <Label className="form-label">{t("Type")}</Label>
              <Controller
                id={`registerFields[${k}].type`}
                name={`registerFields[${k}].type`}
                control={control}
                render={({ field }) => {
                  const { onChange, value, name, ref } = field;
                  return (
                    <Select
                      name={name}
                      inputRef={ref}
                      value={typeOptions.find((c) => c.value === value)}
                      isClearable={false}
                      classNamePrefix="select"
                      options={typeOptions}
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
            title: "",
            type: "string",
          })
        }
      >
        {t("Add")}
      </Button>

      <hr />

      <Col className="mt-2 pt-1" xs={12}>
        <Button color="success" className="me-1" type="submit">
          {t("Update")}
        </Button>
      </Col>
    </div>
  );
};
