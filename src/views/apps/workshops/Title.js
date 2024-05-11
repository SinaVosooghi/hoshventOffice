const style = {
  position: "absolute",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  fontSize: 24,
};
export const Title = ({ id, left, top, children }) => {
  return (
    <div
      className="box"
      style={{ ...style, left, top, textAlign: "center" }}
      data-testid="title"
    >
      {children}
    </div>
  );
};
