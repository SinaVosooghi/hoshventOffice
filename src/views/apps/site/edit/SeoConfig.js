// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Label,
  FormFeedback,
  Col,
  Row,
} from "reactstrap";

// ** Third Party Components
import { Controller } from "react-hook-form";

// ** Styles
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { t } from "i18next";

const SeoConfig = ({ control, errors }) => {
  return (
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">{t("SEO configuration")}</CardTitle>
      </CardHeader>
      <CardBody className="py-2 my-25">
        <Row>
          <Col md={12} xs={12} className="mb-1">
            <Label className="form-label" for="seotitle">
              {t("Seo Title")}
            </Label>
            <Controller
              id="seotitle"
              name="seotitle"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("Seo Title")}
                  invalid={errors.seotitle && true}
                />
              )}
            />
            {errors.seotitle && (
              <FormFeedback>{errors.seotitle.message}</FormFeedback>
            )}
          </Col>
        </Row>

        <Col md={12} xs={12}>
          <Label className="form-label" for="seobody">
            {t("Seo Description")}
          </Label>
          <div className="editor">
            <Controller
              id="seobody"
              name="seobody"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Input
                  type="textarea"
                  {...field}
                  placeholder={t("Seo Description")}
                  invalid={errors.seobody && true}
                />
              )}
            />
          </div>
        </Col>
      </CardBody>
    </Card>
  );
};

export default SeoConfig;
