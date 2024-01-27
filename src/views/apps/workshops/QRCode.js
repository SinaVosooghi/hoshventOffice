const style = {
  position: "absolute",
  backgroundColor: "white",
  height: 180,
  width: 180,
};
export const QrCode = ({ id, left, top, children }) => {
  return (
    <div
      className="qrcode"
      style={{ ...style, left, top }}
      data-testid="qrcode"
    >
      {children}
    </div>
  );
};
