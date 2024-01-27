const style = {
  position: "absolute",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  height: 180,
  width: 180,
  display: "flex",
  alignItems: "center",
};
export const Logo = ({ id, left, top, children }) => {
  return (
    <div className="qrcode" style={{ ...style, left, top }} data-testid="logo">
      {children}
    </div>
  );
};
