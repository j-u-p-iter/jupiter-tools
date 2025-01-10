import path from "path";

import { writeJsonFileSync } from "write-json-file";

import { baseTsConfigContent } from "./configs/tsconfig.js";

import { hasRootFile, fromRoot, getDirName } from "./utils.js";

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

  let includePath = "";

  if (hasRootFile("src")) {
    includePath = fromRoot("src");
  } else if (hasRootFile("packages")) {
    includePath = fromRoot("packages");
  }

  if (!includePath) {
    throw new Error(
      "Either 'src' or 'packages' directory should contain source code of the package. Neither of them was found.",
    );
  }

  /**
   * Prepare tsconfig.base.json
   *
   */
  writeJsonFileSync(pathToBaseTsConfig, {
    ...baseTsConfigContent,
    include: [includePath],
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
    exclude: ["**/__tests__/", "dist"].map((excludePath) =>
      path.join(fromRoot("."), excludePath),
    ),
  });
};
