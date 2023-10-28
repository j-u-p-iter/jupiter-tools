/**
 * Patches globals module,
 *   extending it with some new globals
 *   which don't exist in the original package
 *
 */
import globals from "globals";

globals.vitest = {
  ...globals.jest,
  vi: false,
};

export { globals };
