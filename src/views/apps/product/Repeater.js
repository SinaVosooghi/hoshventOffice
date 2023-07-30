// ** React Imports
import { useEffect, useState } from "react";

// ** Custom Components
import Repeater from "@components/repeater";
import classnames from "classnames";

// ** Third Party Components
import { X, Plus } from "react-feather";
import { SlideDown } from "react-slidedown";
import { selectThemeColors } from "@utils";
import Select from "react-select";

// ** Reactstrap Imports
import { Row, Col, Form, Label, Input, Button } from "reactstrap";
import { t } from "i18next";
import { GET_ITEMS_QUERY } from "../variations/gql";
import { useQuery } from "@apollo/client";
import { isNull } from "lodash";

const VariationRepeater = ({
  handleChangeItems,
  defaultCount,
  items,
  deleteItem,
}) => {
  // ** State
  const [count, setCount] = useState(items?.length ?? 1);
  const [variation, setVariation] = useState(null);
  const [value, setValue] = useState(null);
  const [idx, setIdx] = useState(null);

  const [variationsOptions, setVariationsOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Variation")}` },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        status: true,
      },
    },
    onCompleted: ({ variations }) => {
      variations?.variations?.map((variation) =>
        setVariationsOptions((prev) => [
          ...prev,
          { value: variation.id, label: variation.title },
        ])
      );
    },
  });

  const deleteForm = (e, i) => {
    e.preventDefault();
    const slideDownWrapper = e.target.closest(".react-slidedown"),
      form = e.target.closest("form");
    if (slideDownWrapper) {
      slideDownWrapper.remove();
    } else {
      form.remove();
    }
    deleteItem(i);
  };

  useEffect(() => {
    if (defaultCount) setCount(defaultCount);
  }, [defaultCount]);

  useEffect(() => {
    handleChangeItems({
      idx,
      variation,
      value,
    });
  }, [value, variation]);

  return (
    <>
      <Repeater count={count}>
        {(i) => {
          const Tag = i === 0 ? "div" : SlideDown;
          const defaultValue =
            items && items[i]?.variation
              ? {
                  value: items?.length && items[i]?.variation?.value,
                  label:
                    items?.length &&
                    variationsOptions.find(
                      (v) => v.value === parseFloat(items[i]?.variation?.value)
                    )?.label,
                }
              : null;

          return (
            <Tag key={i}>
              <Form>
                <Row className="justify-content-between align-items-center">
                  <Col md={5} className="mb-md-0 mb-1">
                    <Label
                      className="form-label"
                      for={`animation-item-name-${i}`}
                    >
                      {t("Title")} {t("Variations")}
                    </Label>

                    {defaultValue ? (
                      <>
                        <Select
                          isClearable={false}
                          classNamePrefix="select"
                          options={variationsOptions}
                          theme={selectThemeColors}
                          onChange={(e) => {
                            setIdx(i);
                            setValue(items[i].value);
                            setVariation({ title: e.label, value: e.value });
                          }}
                          defaultValue={defaultValue}
                          placeholder={t("Select...")}
                          className={classnames("react-select")}
                        />
                      </>
                    ) : (
                      <Select
                        isClearable={false}
                        classNamePrefix="select"
                        options={variationsOptions}
                        theme={selectThemeColors}
                        onChange={(e) => {
                          setIdx(i);
                          setValue(items[i]?.value);
                          setVariation({ title: e.label, value: e.value });
                        }}
                        placeholder={t("Select...")}
                        className={classnames("react-select")}
                      />
                    )}
                  </Col>
                  <Col md={5} className="mb-md-0 mb-1">
                    <Label
                      className="form-label"
                      for={`animation-item-name-${i}`}
                    >
                      {t("Value")} {t("Variations")}
                    </Label>
                    <Input
                      key={i}
                      type="text"
                      id={`animation-item-name-${i}`}
                      placeholder={`${t("Value")} ${t("Variations")}`}
                      onChange={(e) => {
                        setIdx(i);
                        setValue(e.target.value);
                        setVariation(items[i].variation);
                      }}
                      defaultValue={items && items[i]?.value}
                    />
                  </Col>

                  <Col md={2}>
                    <Button
                      color="danger"
                      onClick={(e) => deleteForm(e, i)}
                      className="mt-2"
                      outline
                      size="sm"
                    >
                      <X size={14} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Tag>
          );
        }}
      </Repeater>
      <Button
        color="primary"
        size="sm"
        className="btn-add-new mt-1"
        onClick={() => setCount(count + 1)}
      >
        <Plus size={14} className="me-25"></Plus>{" "}
        <span className="align-middle">{t("Add Item")}</span>
      </Button>
    </>
  );
};

export default VariationRepeater;
