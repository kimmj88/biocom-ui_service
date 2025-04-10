declare type BaseType = "AUTH" | "DATA";

export const getBaseUrl = (type: BaseType) => {
  if (type === "AUTH") {
    return import.meta.env.VITE_AUTH_URL;
  }
  return import.meta.env.VITE_DATA_URL;
};
