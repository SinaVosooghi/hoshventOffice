const style = {
  position: "absolute",
  height: 180,
  width: 180,
  margin: "0 auto",
};
export const QrCode = ({ id, left, top, children, metaStyle }) => {
  return (
    <div
      className="qrcode"
      style={{ ...style, left, top, ...metaStyle }}
      data-testid="qrcode"
    >
      {children}
    </div>
  );
};
