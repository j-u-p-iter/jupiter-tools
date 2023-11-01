import spawn from "cross-spawn";

import { resolveBin } from "../../utils.js";

import { prepareConfig } from "./prepareConfig.js";

const config = prepareConfig(process);

spawn.sync(resolveBin("eslint"), config, {
  stdio: "inherit",
  env: {
    ...process.env,
    ESLINT_USE_FLAT_CONFIG: "true",
  },
});

//result.status !== null && process.exit(result.status);
