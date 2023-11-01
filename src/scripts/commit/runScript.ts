import spawn from "cross-spawn";
import path from "path";

// @ts-ignore
import { bootstrap } from "commitizen/dist/cli/git-cz.js";

import { createRequire, resolveBin } from "../../utils.js";

import { prepareConfig } from "./prepareConfig.js";

const require = createRequire(import.meta.url);

const config = prepareConfig(process);

let result;

result = spawn.sync(resolveBin("lint-staged"), config, {
  stdio: "inherit",
});

if (result.status !== null && result.status !== 0) {
  process.exit(result.status);
}

result = spawn.sync("yarn", ["validate"], {
  stdio: "inherit",
});

if (result.status !== null && result.status !== 0) {
  process.exit(result.status);
}

const getPathToCommitizenRootDir = () => {
  return path.dirname(require.resolve("commitizen/package.json"));
};

bootstrap({
  cliPath: getPathToCommitizenRootDir(),
  config: {
    path: "cz-conventional-changelog",
  },
});
