import update from "immutability-helper";
import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { CertificateBox } from "./Box.js";
import { ItemTypes } from "./ItemTypes.js";
import { QrCode } from "./QRCode.js";
import { Logo } from "./Logo.js";
import { Button, Col } from "reactstrap";
import { t } from "i18next";
const styles = {
  width: 1076,
  height: 832,
  border: "1px solid black",
  position: "relative",
};
export const CertificateContainer = ({
  hideSourceOnDrag,
  boxes,
  setBoxes,
  preview,
}) => {
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        })
      );
    },
    [boxes, setBoxes]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );
  return (
    <div
      ref={drop}
      style={{
        ...styles,
        ...(preview && {
          backgroundImage: `url('${preview}')`,
          backgroundSize: "100%",
        }),
      }}
    >
      {Object.keys(boxes).map((key) => {
        const { left, top, title, type, date } = boxes[key];
        if (type === "name") {
          return (
            <CertificateBox
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </CertificateBox>
          );
        } else if (type === "date") {
          return (
            <CertificateBox
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </CertificateBox>
          );
        } else if (type === "title") {
          return (
            <CertificateBox
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </CertificateBox>
          );
        } else if (type === "logo") {
          return (
            <Logo
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Logo>
          );
        }
      })}
    </div>
  );
};
