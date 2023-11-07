import { resolveJupiterScripts } from "../utils.js";

const jupiterScripts = resolveJupiterScripts();

export default {
  "*.{ts,tsx}": [
    `${jupiterScripts} lint`,
    `${jupiterScripts} test --pass-with-no-tests --findRelatedTests`,
  ],
};
