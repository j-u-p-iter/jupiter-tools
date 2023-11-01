import path from "path";

import { parseArgs, hasRootFile, getDirName } from "../../utils.js";

const __dirname = getDirName(import.meta.url);

export const prepareConfig = (process: any) => {
  /** Prepare argument **/
  const parsedArgs = parseArgs(process);

  /**
   * Config
   *
   * Usage:
   *
   * jupiter-scripts test --config ./path/to/config.js
   */

  const useBuiltinConfig = parsedArgs.config || hasRootFile("vitest.config.ts");

  const builtinConfig = parsedArgs.config
    ? ["--config", parsedArgs.config]
    : [];

  const pathToDefaultConfig = path.join(
    __dirname,
    "../../configs/vitest.config.js",
  );

  const defaultConfig = ["--config", pathToDefaultConfig];

  const config = useBuiltinConfig ? builtinConfig : defaultConfig;

  /**
   * Watch mode
   *
   * Vitest enables watch mode by default. Here we are changing this default behaviour.
   *   By default it runs in non-watch mode. To run in watch mode the --watch option should be passed.
   *
   * Usage:
   *
   * jupiter-scripts test --watch
   *
   */

  const watchMode = parsedArgs.watch ? ["watch"] : ["run"];

  /**
   * Update snapshots
   *
   * Usage:
   *
   * jupiter-scripts test --update
   *
   */

  const updateSnapshot = parsedArgs.update ? ["--update"] : [];

  /*
   * Pass without tests
   *
   * Usage:
   *
   * jupiter-scripts test --passWithNoTests
   *
   */

  const passWithNoTests = parsedArgs.passWithNoTests
    ? ["--passWithNoTests"]
    : [];

  /**
   * Find tests related to the updated files
   *
   * Usage:
   *
   * jupiter-scripts test --findRelatedTests
   */

  const findRelatedTests = parsedArgs.findRelatedTests ? ["related"] : [];

  /**
   * Add path to the location (file/folder) to test
   *
   * Usage:
   *
   * jupiter-scripts test some/path/to/test.ts
   */

  const pathToTest = parsedArgs._;

  return [
    ...watchMode,
    ...config,
    ...updateSnapshot,
    ...passWithNoTests,
    ...findRelatedTests,
    ...pathToTest,
  ];
};
