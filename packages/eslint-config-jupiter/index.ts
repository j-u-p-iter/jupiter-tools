import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import { Linter } from 'eslint';
import eslint from "@eslint/js";
import { globals } from './globals.js';
import fs from "fs";
import path from "path";

import { createRequire } from '@jupiter-tools/utils';

const recommendedCommonJsRules = eslint.configs.recommended.rules;
const recommendedTypesciptRules = typescriptPlugin.configs.recommended.rules;
const recommendedPrettierRules = (prettierPlugin.configs!.recommended as any).rules;

const require = createRequire(import.meta.url);

const pathToDefaultConfig = path.join(require.resolve('@jupiter-tools/scripts'), '../configs/tsconfig.base.json');

const pathToBuilinConfig = path.resolve("tsconfig.json");

const tsConfigPath = fs.existsSync(pathToBuilinConfig)
  ? pathToBuilinConfig
  : fs.existsSync(pathToDefaultConfig)
    ? pathToDefaultConfig 
    : undefined;

/**
 * - files field plays like a guard. It's not allowed to lint files which don't match
 *   with the files, listed in this property.
 */
export default [
  {
    files: ["**/*.ts", "**/*.js", "**/*.tsx", "**/*.jsx"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.vitest,
      },
      parser: typescriptParser,
      parserOptions: {
        project: tsConfigPath,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...recommendedCommonJsRules,
      ...recommendedTypesciptRules,
      ...recommendedPrettierRules,
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
] as Linter.FlatConfig;
