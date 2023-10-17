import spawn from "cross-spawn";

import { resolveBin } from "@jupiter-tools/utils";

import { prepareConfig } from "./prepareConfig.js";

const config = prepareConfig(process);

spawn.sync(resolveBin("typescript", { executable: "tsc" }), config, {
  stdio: "inherit",
});
