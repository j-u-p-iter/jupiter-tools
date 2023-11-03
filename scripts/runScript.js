import { fileURLToPath } from "url";
import spawn from "cross-spawn";
import path from "path";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const runScript = (scriptName) => {
  const pathToPackageExecutable = path.join(__dirname, "../dist/lib/index.js");

  const runPackageScript = () => {
    spawn.sync(
      "node",
      [pathToPackageExecutable, scriptName, ...process.argv.slice(2)],
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

  runPackageScript();
};
