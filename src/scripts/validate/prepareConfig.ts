export const prepareConfig = () => {
  const validationScripts = [
    "yarn run build",

    "yarn run lint --no-cache --no-fix",

    "yarn run test --pass-with-no-tests",
  ];

  return validationScripts;
};
