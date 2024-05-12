import update from "immutability-helper";
import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { Box } from "./Box.js";
import { ItemTypes } from "./ItemTypes.js";
import { QrCode } from "./QRCode.js";
import { Logo } from "./Logo.js";
import { Button, Col } from "reactstrap";
import { t } from "i18next";
const styles = {
  width: 531,
  height: 1004,
  border: "1px solid black",
  position: "relative",
};
export const Container = ({ hideSourceOnDrag, boxes, setBoxes }) => {
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
    <div ref={drop} style={styles}>
      {Object.keys(boxes).map((key) => {
        const { left, top, title, type } = boxes[key];
        if (type === "qr") {
          return (
            <QrCode
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </QrCode>
          );
        } else if (type === "name") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
          );
        } else if (type === "nameen") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
          );
        } else if (type === "categoryen") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
          );
        } else if (type === "category") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
          );
        } else if (type === "title") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
          );
        } else if (type === "usertitle") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
          );
        } else if (type === "titleen") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
          );
        } else if (type === "parent") {
          return (
            <Box
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={true}
            >
              {title}
            </Box>
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
