import { parseArgs, hasRootFile } from "@jupiter-tools/utils";

import { getPathToBaseTsConfig } from "../../setUpTsConfigs.js";

export const prepareConfig = (process: any) => {
  /** Prepare arguments **/
  const parsedArgs = parseArgs(process);

  /**
   * Config
   *
   * Usage:
   *
   * jupiter-scripts typecheck --config ./path/to/tsconfig.json
   *
   */

  const useBuiltinConfig = parsedArgs.config || hasRootFile("tsconfig.json");

  const builtinConfig = parsedArgs.config
    ? ["--project", parsedArgs.config]
    : [];

  const defaultConfig = ["--project", getPathToBaseTsConfig()];

  const config = useBuiltinConfig ? builtinConfig : defaultConfig;

  return [...config, "--noEmit"];
};
