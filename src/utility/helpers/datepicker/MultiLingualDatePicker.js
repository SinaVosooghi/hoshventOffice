import { useMemo, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import { DatePicker } from "react-advance-jalaali-datepicker";

import momentJalali from "moment-jalaali";
import moment from "moment";

const MultiLingualDatePicker = ({ date, withTime }) => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  useMemo(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  return (
    <>
      {lang === "ir"
        ? date
          ? momentJalali(date).format(
              `${withTime ? " H:mm  " : ""} jYYYY/jMM/jDD `
            )
          : null
        : date
        ? moment(date).format(`${withTime ? " H:mm  " : ""} YYYY/MM/DD `)
        : null}
    </>
  );
};

export default MultiLingualDatePicker;
