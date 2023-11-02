import { resolveJupiterScripts } from "../utils.js";

const jupiterScripts = resolveJupiterScripts();

export default {
  "*.{ts,tsx}": (fileNames: string[]) => [
    `${jupiterScripts} lint`,
    `${jupiterScripts} test --passWithNoTests --findRelatedTests ${fileNames.join(
      ",",
    )}`,
  ],
};
