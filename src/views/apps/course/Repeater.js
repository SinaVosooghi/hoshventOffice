// ** React Imports
import { useEffect, useState } from "react";

// ** Custom Components
import Repeater from "@components/repeater";

// ** Third Party Components
import { X, Plus } from "react-feather";
import { SlideDown } from "react-slidedown";

// ** Reactstrap Imports
import { Row, Col, Form, Label, Input, Button } from "reactstrap";
import { t } from "i18next";

const PrerequisiteRepeater = ({
  handleChangeItems,
  defaultCount,
  items,
  deleteItem,
}) => {
  // ** State
  const [count, setCount] = useState(defaultCount ?? 1);

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

  const onChange = (title, i) => {
    handleChangeItems({
      idx: i,
      title,
    });
  };

  return (
    <>
      <Repeater count={count}>
        {(i) => {
          const Tag = i === 0 ? "div" : SlideDown;
          return (
            <Tag key={i}>
              <Form>
                <Row className="justify-content-between align-items-center">
                  <Col md={10} className="mb-md-0 mb-1">
                    <Label
                      className="form-label"
                      for={`animation-item-name-${i}`}
                    >
                      {t("Title")} {t("Prerequisite")}
                    </Label>
                    <Input
                      key={i}
                      type="text"
                      id={`animation-item-name-${i}`}
                      placeholder={`${t("Title")} ${t("Prerequisite")}`}
                      onChange={(e) => onChange(e.target.value, i)}
                      defaultValue={items && items[i]?.title}
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

export default PrerequisiteRepeater;
