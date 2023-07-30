import { showImage } from "../Utils";
import Avatar from "@components/avatar";

// ** render user img
export const renderUserImg = (setting, type) => {
  if (setting?.logo !== null) {
    return <img width="35" alt="user-avatar" src={showImage(setting?.logo)} />;
  } else {
    const stateNum = Math.floor(Math.random() * 6),
      states = [
        "light-success",
        "light-danger",
        "light-warning",
        "light-info",
        "light-primary",
        "light-secondary",
      ],
      color = states[stateNum];
    return (
      <Avatar
        initials
        color={color}
        className="rounded mt-3 mb-2"
        content="TG"
        contentStyles={{
          borderRadius: 0,
          fontSize: "calc(48px)",
          width: "100%",
          height: "100%",
        }}
        style={{
          height: "24px",
          width: "35px",
        }}
      />
    );
  }
};
