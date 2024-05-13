const style = {
  position: "absolute",
  fontSize: 24,
};
export const Title = ({ id, left, top, children, styles }) => {
  return (
    <div
      className="box"
      style={{
        ...style,
        left,
        top,
        ...styles,
        color: "#000",
        whiteSpace: "nowrap",
        textAlign: "center",
      }}
      data-testid="title"
    >
      {children}
    </div>
  );
};
