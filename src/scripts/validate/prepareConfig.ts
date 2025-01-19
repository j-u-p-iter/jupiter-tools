export const prepareConfig = () => {
  const validationScripts = [
    "pnpm run build",

    "pnpm run lint --no-cache --no-fix",

    "pnpm run test --pass-with-no-tests",
  ];

  return validationScripts;
};
