import path from "path";

import {
  parseArgs,
  isInRootFolder,
  hasPkgProp,
  getDirName,
} from "../../utils.js";

const __dirname = getDirName(import.meta.url);

export const prepareConfig = (process: any) => {
  /** Prepare arguments **/
  const parsedArgs = parseArgs(process);

  /**
   * Config
   *
   * Usage:
   *
   * jupiter-scripts commit --config ./path/to/lint-staged.js
   *
   */

  const useBuiltinConfig =
    parsedArgs.config ||
    isInRootFolder(".lintstagedrc") ||
    isInRootFolder("lint-staged.config.js") ||
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
