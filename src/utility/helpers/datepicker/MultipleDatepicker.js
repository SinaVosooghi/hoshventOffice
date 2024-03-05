import { useEffect, useMemo, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next";
import { DatePicker, DateTimePicker } from "react-advance-jalaali-datepicker";

import momentJalali from "moment-jalaali";
import moment from "jalali-moment";

export const MultiDatePicker = ({
  handleDateChange,
  picker,
  preSelect,
  time,
}) => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [selectedDate, setSelectedDate] = useState(preSelect);
  const [isPreSelect, setIsPreSelect] = useState(false);

  useMemo(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (preSelect) {
      setIsPreSelect(true);
      setSelectedDate(preSelect);
    }
  }, [preSelect]);

  useEffect(() => {
    handleDateChange(selectedDate);
    setSelectedDate(preSelect);
    setIsPreSelect(false);
  }, [selectedDate]);

  return (
    <>
      {lang === "ir" ? (
        <>
          {time ? (
            <DateTimePicker
              placeholderStart="تاریخ شروع"
              placeholderEnd="تاریخ پایان"
              format="jYYYY/jMM/jDD H:mm"
              className="form-control"
              onChange={(unix) => {
                console.log(handleDateChange(moment.unix(unix).toDate()));
              }}
              containerClass="farsi-datepicker"
              controlValue={isPreSelect}
              preSelected={
                selectedDate
                  ? momentJalali(selectedDate).format("jYYYY/jMM/jDD H:mm")
                  : "1396/05/15 12:00"
              }
            />
          ) : (
            <DatePicker
              placeholderStart="تاریخ شروع"
              placeholderEnd="تاریخ پایان"
              format="jYYYY/jMM/jDD"
              className="form-control"
              onChange={(unix) => handleDateChange(moment.unix(unix).toDate())}
              containerClass="farsi-datepicker"
              controlValue={isPreSelect}
              preSelected={
                selectedDate
                  ? momentJalali(selectedDate).format("jYYYY/jMM/jDD")
                  : "1396/05/15"
              }
            />
          )}
        </>
      ) : (
        <Flatpickr
          className="form-control"
          value={picker}
          defaultValue={
            selectedDate ? moment(selectedDate).format("YYYY/MM/DD") : null
          }
          onChange={(date) => handleDateChange(date[0])}
          id="default-picker"
          options={{
            enableTime: true,
          }}
        />
      )}
    </>
  );
};
