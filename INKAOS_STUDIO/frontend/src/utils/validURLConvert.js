export const validURLConvert = (name) => {
  const url = name.toString().replaceAll(" ", "-");
  return url;
};
