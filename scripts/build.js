import { fileURLToPath } from "url";
import { existsSync } from "node:fs";
import path from "path";

import spawn from "cross-spawn";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runPackageBuild = () => {
  spawn.sync(
    "node",
    [pathToInternalExecutable, "build", ...process.argv.slice(2)],
    {
      stdio: "inherit",
    },
  );
};

export const runInternalBuild = () => {
  spawn.sync("pnpm", ["build_internal"], {
    stdio: "inherit",
  });
};

const pathToInternalExecutable = path.join(__dirname, "../__dist__/index.js");

if (!existsSync(pathToInternalExecutable)) {
  runInternalBuild();
}

runPackageBuild();
