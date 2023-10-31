import spawn from "cross-spawn";

import { resolveBin } from "../../utils.js";

import { prepareConfig } from "./prepareConfig.js";

const config = prepareConfig(process);

let result;

result = spawn.sync(resolveBin("lint-staged"), config, {
  stdio: "inherit",
});

if (result.status !== null && result.status !== 0) {
  process.exit(result.status);
}

result = spawn.sync('yarn', ['validate'], {
  stdio: 'inherit',
});

if (result.status !== null && result.status !== 0) {
  process.exit(result.status);
}

spawn.sync('yarn', ['commit'], {
  stdio: 'inherit',
});
