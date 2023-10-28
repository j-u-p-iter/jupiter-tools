import { ifTrue } from "../../utils.js";

export const prepareConfig = (process: any) => {
  const isNotPrecommitScript = !process.env.PRECOMMIT_SCRIPT;

  const validationScripts = [
    "yarn run build",

    ifTrue(isNotPrecommitScript, "yarn run lint"),

    ifTrue(isNotPrecommitScript, "yarn run test"),
  ];

  return validationScripts;
};
