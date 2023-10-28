import { parseArgs, hasRootFile } from "../../utils.js";

import { getPathToBuildTsConfig } from "../../setUpTsConfigs.js";

export const prepareConfig = (process: any) => {
  /** Prepare arguments **/
  const parsedArgs = parseArgs(process);

  /**
   * Config
   *
   * Usage:
   *
   * jupiter-scripts build --config ./path/to/tsconfig.json
   *
   */

  const useBuiltinConfig = parsedArgs.config || hasRootFile("tsconfig.json");

  const builtinConfig = parsedArgs.config
    ? ["--project", parsedArgs.config]
    : [];

  const defaultConfig = ["--project", getPathToBuildTsConfig()];

  const config = useBuiltinConfig ? builtinConfig : defaultConfig;

  /**
   * Watch mode
   *
   * Usage:
   *
   * jupiter-scripts build --watch
   *
   */

  const watchMode = parsedArgs.watch ? ["--watch"] : [];

  return [...config, ...watchMode];
};
