import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const fallbackHandler = (type = "create") => {
  const { t } = useTranslation();
  const handlers = {
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: () => {
      toast.success(t("Item deleted successfully"));
    },
  };
  if (type === "list") {
    delete handlers["onCompleted"];
  }
  return handlers;
};
