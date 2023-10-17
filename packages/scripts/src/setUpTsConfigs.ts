import path from "path";
import editJsonFile from "edit-json-file";

import { copyFileSync, existsSync } from "node:fs";
import { writeJsonFileSync } from "write-json-file";

import { createRequire, fromRoot, tryIt } from "@jupiter-tools/utils";

const require = createRequire(import.meta.url);

enum TsFileType {
  Base = "base",
  Build = "build",
}

export const getPathToClonedTsConfig = (fileType: TsFileType) => {
  const resolvedPath = tryIt(
    () => require.resolve("@jupiter-tools/scripts"),
    "You should install @jupiter-tools/scripts package to get access to default tsconfig",
  );

  return path.join(resolvedPath!, `../configs/tsconfig.${fileType}.json`);
};

export const getPathToOriginalTsConfig = () => {
  return tryIt(
    () => require.resolve("@jupiter-tools/tsconfig-jupiter"),
    "You should install @jupiter-tools/tsconfig-jupiter package to get an access to the original tsconfig",
  );
};

export const getPathToBuildTsConfig = () => {
  return getPathToClonedTsConfig(TsFileType.Build);
};

export const getPathToBaseTsConfig = () => {
  return getPathToClonedTsConfig(TsFileType.Base);
};

/**
 * Copies config from the @jupiter-tools/tsconfig-jupiter package and set up
 *   automatically declarationDir, outDir, include and exclude paths. These
 *   paths are specific for each project and should be set up typescript to work
 *   properly.
 *
 */
export const setUpTsConfigs = () => {
  const pathToOriginalTsConfig = getPathToOriginalTsConfig();

  const pathToCopyBaseTsConfig = getPathToClonedTsConfig(TsFileType.Base);

  const pathToCreateBuildTsConfig = getPathToClonedTsConfig(TsFileType.Build);

  /**
   * If config was already set up
   *   return from method.
   */
  if (existsSync(pathToCopyBaseTsConfig)) {
    return;
  }

  /**
   * Prepare tsconfig.base.json
   *
   */
  copyFileSync(pathToOriginalTsConfig!, pathToCopyBaseTsConfig);

  const baseTsConfig = editJsonFile(pathToCopyBaseTsConfig);

  baseTsConfig.set("include", [fromRoot("src")]);
  baseTsConfig.set(
    "exclude",
    ["coverage", "node_modules"].map((excludePath) => {
      return path.join(fromRoot("."), excludePath);
    }),
  );

  baseTsConfig.save();

  /**
   * Prepare tsconfig.build.json
   *
   */
  writeJsonFileSync(pathToCreateBuildTsConfig, {
    extends: "./tsconfig.base.json",
    compilerOptions: {
      declarationDir: fromRoot("dist/types"),
      outDir: fromRoot("dist/lib"),
    },
    exclude: ["**/__tests__/"].map((excludePath) =>
      path.join(fromRoot("."), excludePath),
    ),
  });
};
