import { spawnSync } from "node:child_process";

import { resolveBin } from "../../utils.js";

import { prepareConfig } from "./prepareConfig.js";

const config = prepareConfig(process);

const result = spawnSync(
  resolveBin("typescript", { executable: "tsc" }),
  config,
  {
    stdio: [process.stdin, process.stdout, process.stderr],
  },
);

if (result.status !== null) {
  process.exit(result.status);
}
