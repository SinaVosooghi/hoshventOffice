// ** Icons Import
import { t } from "i18next";
import { Heart } from "react-feather";

const Footer = () => {
  return (
    <p className="clearfix mb-0">
      {/* <span className="float-md-start d-block d-md-inline-block mt-25">
        {t("کپی رایت")} © {new Date().getFullYear()}{" "}
        <a
          href="https://persianarte.ir"
          target="_blank"
          rel="noopener noreferrer"
        >
          Persian Arte
        </a>
        <span className="d-none d-sm-inline-block">
          , {t("All rights Reserved")}
        </span>
      </span> */}
      {/* <span className="float-md-end d-none d-md-block">
        {t("Hand-crafted & Made with")}
        <Heart size={14} />
      </span> */}
    </p>
  );
};

export default Footer;
