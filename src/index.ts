#!/usr/bin/env node

import { validateNodeVersion } from "./validateNodeVersion.js";
import { runScript } from "./runScript.js";

validateNodeVersion();

runScript();
