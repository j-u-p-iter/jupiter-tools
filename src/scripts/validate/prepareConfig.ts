export const prepareConfig = () => {
  const validationScripts = [
    "yarn run build",

    "yarn run lint",

    "yarn run test",
  ];

  return validationScripts;
};
