import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
const style = {
  position: "absolute",
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  cursor: "move",
  height: 180,
  width: 180,
};
export const QrCode = ({ id, left, top, hideSourceOnDrag, children }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div
      className="qrcode"
      ref={drag}
      style={{ ...style, left, top }}
      data-testid="qrcode"
    >
      {children}
    </div>
  );
};
