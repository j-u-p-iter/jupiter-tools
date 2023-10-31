import spawn from "cross-spawn";

import { resolveBin } from "../../utils.js";

import { prepareConfig } from "./prepareConfig.js";

const config = prepareConfig(process);

const result = spawn.sync(resolveBin("typescript", { executable: "tsc" }), config, {
  stdio: "inherit",
});

//result.status !== null && process.exit(result.status);
