import path from "path";

import { writeJsonFileSync } from "write-json-file";

import { baseTsConfigContent } from "./configs/tsconfig.js";

import { fromRoot, getDirName } from "./utils.js";

const __dirname = getDirName(import.meta.url);

enum TsFileType {
  Base = "base",
  Build = "build",
}

export const getPathToCreatedTsConfig = (fileType: TsFileType) => {
  return path.join(__dirname, `./configs/tsconfig.${fileType}.json`);
};

export const getPathToBuildTsConfig = () => {
  return getPathToCreatedTsConfig(TsFileType.Build);
};

export const getPathToBaseTsConfig = () => {
  return getPathToCreatedTsConfig(TsFileType.Base);
};

/**
 * Copies config from the @jupiter-tools/tsconfig-jupiter package and set up
 *   automatically declarationDir, outDir, include and exclude paths. These
 *   paths are specific for each project and should be set up typescript to work
 *   properly.
 *
 */
export const setUpTsConfigs = () => {
  const pathToBaseTsConfig = getPathToBaseTsConfig();

  const pathToBuildTsConfig = getPathToBuildTsConfig();

  /**
   * Prepare tsconfig.base.json
   *
   */
  writeJsonFileSync(pathToBaseTsConfig, {
    ...baseTsConfigContent,
    include: [fromRoot("src")],
    exclude: ["coverage", "node_modules", "dist"].map((excludePath) =>
      path.join(fromRoot("."), excludePath),
    ),
  });

  /**
   * Prepare tsconfig.build.json
   *
   */
  writeJsonFileSync(pathToBuildTsConfig, {
    extends: "./tsconfig.base.json",
    compilerOptions: {
      outDir: fromRoot("dist"),
    },
    exclude: ["**/__tests__/"].map((excludePath) =>
      path.join(fromRoot("."), excludePath),
    ),
  });
};
