const style = {
  position: "absolute",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  height: 180,
  width: 180,
  display: "flex",
  alignItems: "center",
  margin: "0 auto"
};
export const Logo = ({ id, left, top, children, styles }) => {
  return (
    <div className="qrcode" style={{ ...style, left, top, ...styles }} data-testid="logo">
      {children}
    </div>
  );
};
