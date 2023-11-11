import path from "path";
import spawn from "cross-spawn";
import { glob } from "glob";
import { fileURLToPath } from "url";
import { createRequire } from "node:module";

import { handleSpawnSignal } from "./utils.js";

import { setUpTsConfigs } from "./setUpTsConfigs.js";

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

/**
 * executor - programm, that run our binary (npx, node, ts-node). Binary, that starts another binary;
 * bin - name (jupiter-scripts) or path (lib (node lib)) of/to our binary;
 * scriptName - name of script we want to execute with our binary);
 * args - array of arguments, that should be passed to script we try to run with binary.
 *
 * So, executor runs binary, binary runs script
 */
const [executor, bin, scriptName, ...args] = process.argv;

const spawnScript = async () => {
  const scriptPath = path.resolve(
    __dirname,
    "scripts",
    scriptName!,
    "runScript.js",
  );
  // by default it search for index.js
  // if there's package.json, path will be generated to the file
  // in main package.json key

  try {
    require.resolve(scriptPath);
  } catch (error) {
    console.log(error);
    throw new Error(`Unknown script "${scriptName}"`);
  }

  const { signal, status } = spawn.sync(executor!, [scriptPath, ...args], {
    stdio: "inherit",
    env: {
      ...process.env,
      [`${scriptName}_SCRIPT`]: "true",
    },
  });

  if (signal) {
    handleSpawnSignal(scriptName, signal);
  } else {
    process.exit(status || 0);
  }
};

const runScript = () => {
  if (scriptName) {
    console.log("SCRIPT_NAME:", scriptName);
    /**
     * Scripts rely on this config. They expect it to be configured to
     *   work properly.
     */
    setUpTsConfigs();

    spawnScript();
  } else {
    const scriptsPath = path.join(__dirname, "scripts/");
    const availableScripts = glob.sync(path.join(__dirname, "scripts", "*"));

    const binaryName = bin!.split("/").reverse()[0];

    const availableScriptsMessage = availableScripts
      .map((script) => script.replace(scriptsPath, ""))
      .filter(Boolean)
      .join("\n  ");

    const fullMessage = `
  Usage: ${binaryName} [script] [--flags]

  Available Scripts:
  ${availableScriptsMessage}
    `;

    console.log(fullMessage);

    process.exit(0);
  }
};

export { runScript };
