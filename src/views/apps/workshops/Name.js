const style = {
  position: "absolute",
  fontSize: 24,
};
export const Name = ({ id, left, top, children, styles }) => {
  return (
    <div
      className="box"
      style={{
        ...style,
        left,
        top,
        color: "#000",
        whiteSpace: "nowrap",
        fontWeight: "bold",
        textAlign:'center',
        ...styles,
      }}
      data-testid="name"
    >
      {children}
    </div>
  );
};
