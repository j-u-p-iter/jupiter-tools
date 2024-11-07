import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import { Linter } from "eslint";
import eslint from "@eslint/js";
import { globals } from "./globals.js";
import fs from "fs";
import path from "path";

const recommendedCommonJsRules = eslint.configs.recommended.rules;
const recommendedTypesciptRules = typescriptPlugin.configs.recommended!.rules;
const recommendedPrettierRules = (prettierPlugin.configs!.recommended as any)
  .rules;

const pathToDefaultConfig = "./tsconfig.base.json";

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
  /**
   * If ignores is used without any other keys in the configuration object,
   *   then the patterns act as global ignores among all configurations objects of the config.
   */
  {
    ignores: ["dist/**", "__dist__/**", "node_modules/**", ".yarn/**"],
  },

  {
    files: ["**/*.ts", "**/*.js", "**/*.tsx", "**/*.jsx"],
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
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },

  /**
   * The reason for the "no-undef" is mentioned here:
   *   https://typescript-eslint.io/troubleshooting/faqs/eslint#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
   *
   */
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },
] as Linter.FlatConfig;
