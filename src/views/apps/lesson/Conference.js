import { t } from "i18next";
import { Controller } from "react-hook-form";
import Select from "react-select";
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { MultiDatePicker } from "../../../utility/helpers/datepicker/MultipleDatepicker";
import { statusOptions } from "./add/AddCard";
import classNames from "classnames";
import moment from "jalali-moment";

const ConferenceOptions = ({
  control,
  errors,
  startDate,
  setStartDate,
  starttime,
  selectedDates,
  setSelectedDates,
}) => {
  const [show, setShow] = useState(false);

  const handleStartDateChange = (dateValue) => {
    setStartDate(dateValue);
  };

  const resetModal = () => {
    setShow(!show);
  };

  const onDateChange = (day, status) => {
    let array = selectedDates;
    if (status) {
      array.push(day.toString());
      setSelectedDates(day);
    } else {
      const index = array.findIndex((i) => i == day);
      array.splice(index, 1);
    }

    setSelectedDates(array);
  };

  return (
    <>
      <div className="divider divider-start">
        <div className="divider-text">{t("Video Options")}</div>
      </div>

      <Modal isOpen={show} toggle={resetModal}>
        <ModalHeader className="mb-1" toggle={resetModal} tag="div">
          {t("Recurrence options")}
        </ModalHeader>

        <ModalBody>
          <Label onClick={(e) => e.stopPropagation()}>{t("Weekly Days")}</Label>

          <div className="d-flex form-check week_day">
            <Input
              value="7"
              type="checkbox"
              onChange={(e) => onDateChange(7, e.target.checked)}
              defaultChecked={selectedDates.includes("7")}
            />
            <Label onClick={(e) => e.stopPropagation()}>{t("Saturday")}</Label>
          </div>
          <div className="d-flex form-check week_day">
            <Input
              value="1"
              type="checkbox"
              onChange={(e) => onDateChange(1, e.target.checked)}
              defaultChecked={selectedDates.includes("1")}
            />
            <Label onClick={(e) => e.stopPropagation()}>{t("Sunday")}</Label>
          </div>
          <div className="d-flex form-check week_day">
            <Input
              value="2"
              type="checkbox"
              onChange={(e) => onDateChange(2, e.target.checked)}
              defaultChecked={selectedDates.includes("2")}
            />
            <Label onClick={(e) => e.stopPropagation()}>{t("Monday")}</Label>
          </div>
          <div className="d-flex form-check week_day">
            <Input
              value="3"
              type="checkbox"
              onChange={(e) => onDateChange(3, e.target.checked)}
              defaultChecked={selectedDates.includes("3")}
            />
            <Label onClick={(e) => e.stopPropagation()}>{t("Tuesday")}</Label>
          </div>
          <div className="d-flex form-check week_day">
            <Input
              value="4"
              type="checkbox"
              onChange={(e) => onDateChange(4, e.target.checked)}
              defaultChecked={selectedDates.includes("4")}
            />
            <Label onClick={(e) => e.stopPropagation()}>{t("Wednesday")}</Label>
          </div>
          <div className="d-flex form-check week_day">
            <Input
              value="5"
              type="checkbox"
              onChange={(e) => onDateChange(5, e.target.checked)}
              defaultChecked={selectedDates.includes("5")}
            />
            <Label onClick={(e) => e.stopPropagation()}>{t("Thursday")}</Label>
          </div>
          <div className="d-flex form-check week_day">
            <Input
              value="6"
              type="checkbox"
              onChange={(e) => onDateChange(6, e.target.checked)}
              defaultChecked={selectedDates.includes("6")}
            />
            <Label onClick={(e) => e.stopPropagation()}>{t("Friday")}</Label>
          </div>
          <Col md={4} xs={12}>
            <Label className="form-label" for="repeat_interval">
              {t("Repeat Interval")}
            </Label>
            <Controller
              id="repeat_interval"
              name="conferenceoptions.repeat_interval"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder={t("Repeat Interval")}
                />
              )}
            />
          </Col>
        </ModalBody>
      </Modal>

      <Col md={3}>
        <Label className="form-label" for="startdate">
          {t("Start date")}
        </Label>
        <Flatpickr
          className="form-control"
          defaultValue={
            starttime
              ? moment.utc(Date.parse(starttime)).format("YYYY-MM-DD HH:mm")
              : null
          }
          onChange={(date) => handleStartDateChange(date[0])}
          id="default-picker"
          options={{
            enableTime: true,
          }}
        />
      </Col>

      <Col md={3} xs={12}>
        <Label className="form-label" for="password">
          {t("Passowrd")}
        </Label>
        <Controller
          id="password"
          name="conferenceoptions.password"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <Input {...field} type="text" placeholder={t("Password")} />
          )}
        />
      </Col>

      <Col md={3} xs={12}>
        <Label className="form-label" for="schedule_for">
          {t("Organizer email")}
        </Label>
        <Controller
          id="schedule_for"
          name="conferenceoptions.schedule_for"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <Input {...field} type="text" placeholder={t("Organizer email")} />
          )}
        />
      </Col>

      <Col md={3} xs={12} className="mt-2">
        <Button color="primary" outline onClick={() => setShow(true)}>
          {t("Recurrence options")}
        </Button>
      </Col>
      <Col md={12} xs={12} className="mt-1">
        <Label className="form-label" for="joinlink">
          {t("Join Link")}
        </Label>
        <Controller
          name="conferenceoptions.joinlink"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <Input {...field} type="text" placeholder={t("Join Link")} />
          )}
        />
      </Col>

      <Col md={12} xs={12} className="mt-1">
        <Label className="form-label" for="joinanytime">
          {t("Allow participants to join anytime")}:
        </Label>
        <Controller
          name="conferenceoptions.joinanytime"
          control={control}
          defaultValue={false}
          render={({ field }) => {
            const { onChange, value, name, ref } = field;

            return (
              <Select
                name={name}
                inputRef={ref}
                value={statusOptions.find((c) => c.value === value.value)}
                isClearable={false}
                classNamePrefix="select"
                options={statusOptions}
                theme={selectThemeColors}
                placeholder={t("Select...")}
                onChange={(v) => {
                  onChange(v.value);
                }}
                className={classNames("react-select")}
              />
            );
          }}
        />
      </Col>
      <Col md={12} xs={12} className="mt-1">
        <Label className="form-label" for="host">
          {t("Host video")}:
        </Label>
        <Controller
          name="conferenceoptions.host"
          control={control}
          defaultValue={false}
          render={({ field }) => {
            const { onChange, value, name, ref } = field;

            return (
              <Select
                name={name}
                inputRef={ref}
                value={statusOptions.find((c) => c.value === value.value)}
                isClearable={false}
                classNamePrefix="select"
                options={statusOptions}
                theme={selectThemeColors}
                placeholder={t("Select...")}
                className={classNames("react-select")}
                onChange={(v) => {
                  onChange(v.value);
                }}
              />
            );
          }}
        />
      </Col>
      <Col md={12} xs={12} className="mt-1">
        <Label className="form-label" for="requireauth">
          {t("Require authentication to join: Sign in to Zoom")}:
        </Label>
        <Controller
          name="conferenceoptions.requireauth"
          control={control}
          defaultValue={false}
          render={({ field }) => {
            const { onChange, value, name, ref } = field;

            return (
              <Select
                name={name}
                inputRef={ref}
                value={statusOptions.find((c) => c.value === value.value)}
                isClearable={false}
                classNamePrefix="select"
                options={statusOptions}
                theme={selectThemeColors}
                onChange={(v) => {
                  onChange(v.value);
                }}
                placeholder={t("Select...")}
                className={classNames("react-select")}
              />
            );
          }}
        />
      </Col>
    </>
  );
};

export default ConferenceOptions;
