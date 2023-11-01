import path from "path";

import { parseArgs, hasRootFile, hasPkgProp, getDirName } from "../../utils.js";

const __dirname = getDirName(import.meta.url);

export const prepareConfig = (process: any) => {
  /** Prepare arguments **/
  const parsedArgs = parseArgs(process);

  /**
   * Config
   *
   * Usage:
   *
   * jupiter-scripts precommit --config ./path/to/lint-staged.js
   *
   */

  const useBuiltinConfig =
    parsedArgs.config ||
    hasRootFile(".lintstagedrc") ||
    hasRootFile("lint-staged.config.js") ||
    hasPkgProp("lint-staged");

  const builtinConfig = parsedArgs.config
    ? ["--config", parsedArgs.config]
    : [];

  const pathToDefaultConfig = path.join(
    __dirname,
    "../../configs/lint-staged.config.js",
  );

  const defaultConfig = ["--config", pathToDefaultConfig];

  const config = useBuiltinConfig ? builtinConfig : defaultConfig;

  return config;
};
