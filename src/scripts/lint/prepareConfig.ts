import path from "path";

import { parseArgs, isInRootFolder, getDirName } from "../../utils.js";

const __dirname = getDirName(import.meta.url);

export const prepareConfig = (process: any) => {
  /** Prepare arguments **/
  const parsedArgs = parseArgs(process);

  /**
   * Config
   *
   * Usage:
   *
   * jupiter-scripts lint --config ./path/to/config.js
   *
   */
  const useBuiltinConfig =
    parsedArgs.config || isInRootFolder("eslint.config.js");

  const builtinConfig = parsedArgs.config
    ? ["--config", parsedArgs.config]
    : [];

  const pathToDefaultConfig = path.join(
    __dirname,
    "../../configs/eslint.config.js",
  );

  const defaultConfig = ["--config", pathToDefaultConfig];

  const config = useBuiltinConfig ? builtinConfig : defaultConfig;

  /**
   * Fix
   *
   * "fix" option is enabeld by default. To disable auto fixing
   * the "no-fix" option should be passed.
   *
   * Usage:
   *
   * jupiter-scripts lint --no-fix
   *
   */
  const fix = parsedArgs.fix === false ? [] : ["--fix"];

  /**
   * Cache
   *
   * "cache" option is enabled by default. To disable
   * caching the "no-cache" option should be provided.
   *
   *
   * Usage:
   *
   * jupiter-scripts lint --no-cache
   *
   */
  const cache = parsedArgs.cache === false ? [] : ["--cache"];

  /**
   * Run in a quiet mode (without warnings).
   *
   * Quiet mode is enabled by default. To disable the quiet mode
   * the "no-quiet" option should be sent.
   *
   * Usage:
   *
   * jupiter-scripts lint --no-quiet
   *
   */

  const quietMode = parsedArgs.quiet === false ? [] : ["--quiet"];

  /**
   * Files to lint.
   *
   * When the directory is pointed out, only files matching
   *   with the "files" from config are linted.
   *
   * Usage:
   *
   * jupiter-scripts lint ./path/to/file.js
   *
   */
  const filesToLint = parsedArgs._.length ? parsedArgs._ : ["."];

  return [...config, ...fix, ...cache, ...quietMode, ...filesToLint];
};
