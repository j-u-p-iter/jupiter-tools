import { parseArgs, hasRootFile } from "@jupiter-tools/utils";

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

  return config;
};
