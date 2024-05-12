import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
const style = {
  position: "absolute",
  cursor: "move",
};
export const Box = ({ id, left, top, hideSourceOnDrag, children }) => {
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
      className="box"
      ref={drag}
      style={{ ...style, left, top, textAlign: "center" }}
      data-testid="box"
    >
      {children}
    </div>
  );
};
