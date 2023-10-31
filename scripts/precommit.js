import { fileURLToPath } from "url";
import path from "path";
import spawn from "cross-spawn";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pathToPackageExecutable = path.join(__dirname, "../dist/lib/index.js");

const runPackagePreCommit = () => {
  spawn.sync(
    "node",
    [pathToPackageExecutable, "precommit", ...process.argv.slice(2)],
    {
      stdio: "inherit",
    },
  );
};

const runBuild = () => {
  spawn.sync("yarn", ["build"], {
    stdio: "inherit",
  });
};

if (!existsSync(pathToPackageExecutable)) {
  runBuild();
}

runPackagePreCommit();
