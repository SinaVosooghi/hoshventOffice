import toast from "react-hot-toast";

export const dataToRender = (data, rowsPerPage, value) => {
  const filters = { q: value };
  const isFiltered = Object.keys(filters).some((k) => filters[k].length > 0);
  if (data.length > 0) return data;
  else if (data.length === 0 && isFiltered) return [];
  return data.slice(0, rowsPerPage);
};

export const fallbackHandler = (type = "create") => {
  const handlers = {
    onError: (error) => {
      toast.error(error.message);
    },
    onCompleted: () => {
      toast.success(`حذف شد`);
    },
  };
  if (type === "list") {
    delete handlers["onCompleted"];
  }
  return handlers;
};
