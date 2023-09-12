// ** React Imports

import { Col, Row } from "reactstrap";
import FieldsRepeater from "./Repeater";

const RegisterFields = ({
  control,
  errors,
  handleSubmit,
  count,
  handleChangeItems,
  items,
  deleteItem,
  register,
}) => {
  return (
    <Row>
      <Col md={8}>
        <FieldsRepeater
          errors={errors}
          control={control}
          handleSubmit={handleSubmit}
          defaultCount={count}
          handleChangeItems={handleChangeItems}
          items={items}
          register={register}
          deleteItem={deleteItem}
        />
      </Col>
    </Row>
  );
};

export default RegisterFields;
