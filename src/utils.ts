import fs from "fs";

import path from "path";
import lodash from "lodash";
import which from "which";
import yargsParser from "yargs-parser";
import { readPackageUpSync } from "read-pkg-up";
import arrify from "arrify";
import { fileURLToPath } from "url";
import { createRequire as createRequireFn } from "node:module";

const require = createRequireFn(import.meta.url);

const createRequire = (url: any) => createRequireFn(url);

const { has, curry, get, keys, flatten } = lodash;

const { packageJson: packageData, path: packagePath } = readPackageUpSync()!;

const arrayToString = (array: any) => array.filter(Boolean).join(" ");

const getAppDirectory = (): any => path.dirname(packagePath);

const fromRoot = (...args: any[]): any => path.join(getAppDirectory(), ...args);

const hasRootFile = (...args: any[]): any => fs.existsSync(fromRoot(...args));

const hasPkgProp = (props: any) =>
  arrify(props).some((prop: any) => has(packageData, prop));

const hasPkgSubProp = curry((pkgProp: string, subProps: any) =>
  hasPkgProp(arrify(subProps).map((subProp: any) => `${pkgProp}.${subProp}`)),
);

const hasPeerDependency = hasPkgSubProp("peerDependencies");
const hasDependency = hasPkgSubProp("dependencies");
const hasDevelopmentDependency = hasPkgSubProp("devDependencies");

const hasAnyDependency = (dependencies: any): any =>
  [hasPeerDependency, hasDependency, hasDevelopmentDependency].some(
    (method: any) => method(dependencies),
  );

const ifHasAnyDependency = (
  dependencies: any,
  resultOnTrue: any,
  resultOnFalse: any,
): any => (hasAnyDependency(dependencies) ? resultOnTrue : resultOnFalse);

const withDefault = curry((defaultValue: any, data: any) => {
  let notEmpty = !!data;

  if (Array.isArray(data)) {
    notEmpty = !!data.length;
  }

  return notEmpty ? data : defaultValue;
});

const withArrayByDefault = withDefault([]);

// For umd we need to have dependencies included in bundle,
// Cause we don't have the ability to install dependencies
// With npm and package.json for such modules
const generateExternals = (moduleFormat: any) =>
  moduleFormat === "umd"
    ? withArrayByDefault(keys(get(packageData, "peerDependencies")))
    : withArrayByDefault(
        keys(get(packageData, "dependencies")).concat(
          keys(get(packageData, "peerDependencies")),
        ),
      );

const resolveBin = (moduleName: any, { executable = moduleName } = {}) => {
  let pathToBinFoundWithWhich;

  try {
    pathToBinFoundWithWhich = which.sync(executable);
  } catch (error) {
    // should stay empty
  }

  try {
    // if no such package, error will be thrown
    // in this case we go to catch section
    // and return the path, that was found with which
    const modulePackagePath = require.resolve(`${moduleName}/package.json`);
    const moduleRootDirectoryPath = path.dirname(modulePackagePath);
    const { bin: binKeyValue } = require(modulePackagePath);
    const binPath =
      typeof binKeyValue === "string" ? binKeyValue : binKeyValue[executable];
    const fullBinPath = path.join(moduleRootDirectoryPath, binPath);

    if (fullBinPath === pathToBinFoundWithWhich) {
      // it means, that bin will be found using short executable name
      // cause it was found with which
      return executable;
    }

    return fullBinPath;
  } catch (error) {
    if (pathToBinFoundWithWhich) {
      return executable;
    }

    throw error;
  }
};

const handleSpawnSignal = (scriptName: any, signal: any) => {
  if (signal === "SIGKILL") {
    console.log(
      `The script "${scriptName}" failed because the process exited too early. ` +
        "This probably means the system ran out of memory or someone called " +
        "`kill -9` on the process.",
    );
  } else if (signal === "SIGTERM") {
    console.log(
      `The script "${scriptName}" failed because the process exited too early. ` +
        "Someone might have called `kill` or `killall`, or the system could " +
        "be shutting down.",
    );
  }

  process.exit(1);
};

const filterBoolean = (item: any) => typeof item !== "boolean";

const filterArgs = (args: any, filterFrom: any) => {
  const parsedArgs = yargsParser(args);

  return flatten(
    Object.entries(parsedArgs)
      .filter(([optionName]) => !["_", ...filterFrom].includes(optionName))
      .map(([optionName, optionValue]) => [`--${optionName}`, optionValue]),
  ).filter(filterBoolean);
};

const resolveModulePath = () => {
  // index.js can be absent in package
  // but package.json is always present
  // So, to detect path to module (resolve it)
  // we're searching package.json
  const modulePackagePath = require.resolve("commitizen/package.json");
  const moduleRootDirectoryPath = path.dirname(modulePackagePath);

  return moduleRootDirectoryPath;
};

const getConcurrentlyArgs = (scripts: any) => {
  const scriptsObject = Object.entries(scripts).reduce(
    (allScripts: any, [scriptName, scriptValue]) => {
      if (scriptValue) {
        allScripts[scriptName] = scriptValue;
      }

      return allScripts;
    },
    {},
  );

  return Object.values(scriptsObject);
};

const ifTrue = (cond: any, trueResult: any, falseResult: any = null) =>
  cond ? trueResult : falseResult;

const parseArgs = (process: any) => yargsParser(process.argv.slice(2));

const getDirName = (url: any) => path.dirname(fileURLToPath(url));

const tryIt = (callback: () => void, errorMessage?: string) => {
  try {
    return callback();
  } catch (error) {
    console.error(new Error(errorMessage));
  }
};

const resolveJupiterScripts = () =>
  packageData.name === "@j.u.p.iter/scripts"
    ? require.resolve("../../").replace(process.cwd(), ".")
    : resolveBin("@j.u.p.iter/scripts", {
        executable: "jupiter-scripts",
      });

export {
  ifTrue,
  getConcurrentlyArgs,
  resolveModulePath,
  filterArgs,
  packageData,
  parseArgs,
  arrayToString,
  getAppDirectory,
  fromRoot,
  hasRootFile,
  hasPkgProp,
  ifHasAnyDependency,
  generateExternals,
  resolveBin,
  handleSpawnSignal,
  getDirName,
  createRequire,
  resolveJupiterScripts,
  tryIt,
};
