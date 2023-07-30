import { CardText, Col, FormFeedback, Input, Row } from "reactstrap";
import Select from "react-select";
import { t } from "i18next";
import { X } from "react-feather";
import { selectThemeColors } from "@utils";
import SlideDown from "react-slidedown";
import { useEffect, useState } from "react";
import Cleave from "cleave.js/react";
import { thousandSeperator } from "../../../../utility/Utils";

const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

const Item = ({ i, deleteForm, products, handleChangeItems, item }) => {
  const Tag = i === 0 ? "div" : SlideDown;
  const [price, setPrice] = useState(item?.price ?? 0);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [product, setProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState();

  useEffect(() => {
    if (item) {
      setTotal(quantity * item.price);
      setQuantity(item.quantity);
      setPrice(item.price);
      if (products.length) {
        const p = products.filter((product) => {
          return product.value === item.product;
        });

        if (p.length) {
          setSelectedProduct({
            value: p[0].value,
            label: p[0].label,
          });
          setProduct({
            value: p[0].value,
            label: p[0].label,
          });
        }
      }
    }
  }, [item, products]);

  useEffect(() => {
    setTotal(price * quantity);
    if (product) {
      handleChangeItems({
        id: item?.id ?? null,
        idx: i,
        product: product,
        course: null,
        quantity: parseInt(quantity),
        price: price,
      });
    }
  }, [quantity, price]);

  return (
    <>
      <Tag key={i} className="repeater-wrapper" id="repeater-wrapper">
        <Row>
          <Col
            className="d-flex product-details-border position-relative pe-0"
            sm="12"
          >
            <Row className="w-100 pe-lg-0 pe-1 py-2">
              <Col className="mb-lg-0 mb-2 mt-lg-0 mt-2" lg="5" sm="12">
                <CardText className="col-title mb-md-50 mb-0">
                  {t("Item")}
                </CardText>
                <>
                  <Select
                    classNamePrefix="select"
                    options={products}
                    onChange={(p) => {
                      setProduct(p.value);
                      setPrice(p.offprice ?? p.price);
                    }}
                    value={selectedProduct}
                    defaultValue={selectedProduct}
                    theme={selectThemeColors}
                    placeholder={`${t("Select")} ${t("Product")}...`}
                  />
                </>
              </Col>
              <Col className="my-lg-0 my-2" lg="3" sm="12">
                <CardText className="col-title mb-md-2 mb-0">
                  {t("Cost")}
                </CardText>
                <Cleave
                  className="form-control"
                  placeholder="10,000"
                  options={options}
                  onChange={(e) => setPrice(e.target.value.replaceAll(",", ""))}
                  value={price}
                />
              </Col>
              <Col className="my-lg-0 my-2" lg="2" sm="12">
                <CardText className="col-title mb-md-2 mb-0">
                  {t("Quantity")}
                </CardText>
                <Input
                  type="number"
                  defaultValue={quantity}
                  value={quantity}
                  min={1}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                />
              </Col>
              <Col
                className="my-lg-0 mt-2 align-items-center d-flex"
                lg="2"
                sm="12"
              >
                <CardText className="col-title mb-md-50 mb-0">
                  {t("Price")}
                </CardText>
                <CardText className="mb-0">{thousandSeperator(total)}</CardText>
              </Col>
            </Row>
            <div className="d-flex justify-content-center border-start invoice-product-actions py-50 px-25">
              <X
                size={18}
                className="cursor-pointer"
                onClick={(e) => deleteForm(e, item)}
              />
            </div>
          </Col>
        </Row>
      </Tag>
    </>
  );
};

export default Item;
