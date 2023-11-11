import { resolveJupiterScripts } from "../utils.js";

const jupiterScripts = resolveJupiterScripts();

export default {
  "*.{ts,tsx}": (fileNames: string[]) => {
    return [
      `${jupiterScripts} typecheck`,
      `${jupiterScripts} lint ${fileNames.join(" ")}`,
      `${jupiterScripts} test --find-related-tests ${fileNames.join(
        " ",
      )} --pass-with-no-tests`,
    ];
  },
};
