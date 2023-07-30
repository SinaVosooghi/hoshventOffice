// ** Icons Imports
import { Award } from "react-feather";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Card, CardBody, CardText } from "reactstrap";

// ** Images
import decorationLeft from "@src/assets/images/elements/decore-left.png";
import decorationRight from "@src/assets/images/elements/decore-right.png";
import { t } from "i18next";

const CardCongratulations = ({ user }) => {
  return (
    <Card className="card-congratulations">
      <CardBody className="text-center">
        <img
          className="congratulations-img-left"
          src={decorationLeft}
          alt="decor-left"
        />
        <img
          className="congratulations-img-right"
          src={decorationRight}
          alt="decor-right"
        />
        <Avatar
          icon={<Award size={28} />}
          className="shadow"
          color="primary"
          size="xl"
        />
        <div className="text-center">
          <h1 className="mb-1 text-white">
            {t("Congratulations")} {user?.firstName + " " + user?.lastName},
          </h1>
          <CardText className="m-auto w-75">
           پنل مدیریت پیشرفته مدیریت رویدادها در دسترس شماست
          </CardText>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardCongratulations;
