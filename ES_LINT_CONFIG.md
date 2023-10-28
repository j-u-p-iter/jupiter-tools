# Setting up ESlint config

## Specifying files and ignores.

The combination of `files` and `ignores` determines the set of files which should be processed by the
ESLint. By default, ESLint matches `**/*.js, **/*.cjs, and **/*.mjs`. If you try to target the `.ts` files
and these files are not specified in the `files` property they won't be handled since they are not included
into the default set of files to check.

We want all .js(x) and .ts(x) files to be linted. For that we specify next files property:

```
files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']
```

However it doesn't prevent ESLint from checking these files in the /dist, /node_modules directories.
We definitely shouldn't lint files there. For that we are using the `ignores` property:

```
ignores: ['dist/*', 'node_modules/*']
```

It's important to point out that non-global `ignores` patterns can only match file names. A pattern like "dir-to-exclude/" will not ignore anything. 
To ignore everything in a particular directory, a pattern like "dir-to-exclude/*" should be used instead.

## Specifying language options

`languageOptions` determine how ESLint evaluates the JavaScript code.

### Specifying ecmaVersion

First of all we need to determine which JavaScript standard version we need to support. This determines which global variables
and syntax are considered as valid in the codebase. To do it we declare the `ecmaVersion` under the `languageOptions` scope:

```
languageOptions: {
  ecmaVersion: "latest",
}
```

We declare the 'latest' version, as prefferable for us. It's also recommended by ESLint creators and is set up by default
if `ecmaVersion` is not provided in the config.

### Specifying sourceType

This property can be set to:

- "module". Code has a module scope and run in sctrict mode.

- "commonjs". Code has a top-level function scope and run in non-strict mode.

- "script". Code has a shared global scope and runs in non-strict mode.

All our code uses ESM modules, so we define "module" `sourceType`:

```
languageOptions: {
  sourceType: "module",
}
```

### Specifying custom parser and its options

This parser is used by ESLint to transform code to AST to be able to understand and validate it according to the linting rules.
All our code we write using TypeScript. So, we need a parser that can parse TypeScript code. For that purpose we use `@typescript-elint/parser`.

```
languageOptions: {
  parser: '@typescript-eslint/parser', 
}
```

The parser itself is a configurable thing. It takes some set options that determine its behaviour. We are using the next configuration for the parser:

- project. This is the path to the tsconfig.json, which always located in the root project folder. 
  We provide absolute path to the config, using the path.resolve utility. It assumes that the eslint
  script is always run in the project's root folder.

```
const tsConfigPath = fs.existsSync('tsconfig.json') ? path.resolve('tsconfig.json') : undefined;

languageOptions: {
  parser: '@typescript-eslint/parser', 
  parserOptions: {
    project: tsConfigPath, 
  },
}
```

### Specifying globals for different environments  

Different environments (node, browser, jest) come with different predefined set of global variables. By default ESLint doesn't know anything about these
sets. To provide this knoweledge to the ESLint it's necessary to set up globals object in the languageOptions.

While it's possible to set up each global variable for every environment manually, it's huge waste of time. Instead we use "globals" package,
which provides in JSON format globals for all possible environments.

```
import globals from 'globals';

languageOptions: {
  globals: {
    ...globals.browser,
    ...globals.node,
  }
}
```

### Specifying common JavaScript rules

ESLint provides a package with widely used common JavaScript rules prefferable to use.
We use this rules configuration as a base configuration. Different plugins come with their own 
additional configurations and validation rules. These additional configurations is put on top 
of the configurations coming from ESLint's packages.

```
import eslint from '@eslint/js';

const recommendedCommonJsRules = eslint.configs.recommended.rules;

rules: {
  ...recommendedCommonJsRules,
}
```

The exact list of these rules is provided and described here:

https://eslint.org/docs/latest/rules/

### Specifying plugins and rules

To extend the ESLint functionality in different form and shape the plugins are used.

We use next set of plugins:

- @typescript-eslint/eslint-plugin. This plugin allows to use typescript-eslint's rules to validate the code. It's important to note
  that it doesn't include into the config the rules itself. Instead it checks the presence of such rules. And, if there are, it validates the code
  according to these rules.

```
plugins: {
  "@typescript-eslint": typescriptPlugin,
},
```
  
Ok, we've set up the functionality that validates the rules for the '@typescript-eslint' plugin. Now we need to set up the rules:

```
const recommendedTypesciptRules = typescriptPlugin.configs.recommended.rules;

rules: {
  ....
  ...recommendedTypesciptRules,
};
```

- eslint-plugin-prettier. It's a good practise to delegate all formatting and format validation to the prettier. This plugin contains 
  all the functionality necessary for that.

The same as with the "@typescript-eslint" plugin we are setting up this plugin in two steps: adding plugin to the "plugin section",
enabling validation/formatting functionality for all the rules and, as a second step, enabling the recommended rules from the prettier:

```
import prettierPlugin from 'eslint-plugin-prettier'; 

plugins: {
  prettier: prettierPlugin,
}
```

```
import prettierPlugin from 'eslint-plugin-prettier'; 

const recommendedPrettierRules = (prettierPlugin.configs!.recommended as any)
  .rules;

rules: {
  ...recommendedPrettierRules
}
```
