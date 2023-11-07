# LINT SCRIPT

## jupiter-scripts lint

For the linting purposes the ESLint is used under the hood.

### Configuration

The script is using the default config from /src/configs/eslint.config.js file of the project.

This config contains the prefferable common configurations for all my projects.

It's possible to replace this config with such called builtin config. You have next options to do that:

- pointing out the path to the custom config with the `--config` option:

```
jupiter-scripts lint --config ./path/to/customConfig.ts
```

- creating the `eslint.config.js` config in the root folder of the project (next to the package.json file). ESLint
will find, read and use this config automatically.

### Auto fix

The script is automatically fixing all the issues, providing the predefined `--fix` option to the ESLint.

It's possible to disable autofix feature with the `--no-fix` option:

```
jupiter-scripts lint --no-fix
```

Probably you'll want to do it in CI environment.

### Auto caching

The script is automatically caches the state of the linted application, using predefined `--cache` option
for the eslint script. ESlint automatically creates .eslintcache file in the root of the project. It's important
to add this file to the .gitignore since you definitely don't need to commit it.

It's possible to disable autocaching feature with the `--no-cache` option:

```
jupiter-scripts lint --no-cache
```

Probably you'll want to do it in CI environment.

### Quiet mode

The script is running in a quiet mode by default. It means that it doesn't emit warnings in the console.

It's possible to disable quiet mode with the `--no-quiet` option:

```
jupiter-scripts lint --no-quiet
```

### Files to lint

The script is linting by default all the .ts files starting from the root of the folder, excluding the /dist and /node_modules folders.

It's possible to provide custom paths to the .ts files to lint only them:


```
jupiter-scripts lint ./custom/path/to/lint/**/*.ts
```

It's important to point out that the predefined ESlint config from the ./configs derictory contains `files` property. 
This property contains the glob of all possible files to lint. If this glob doesn't match with the files to lint
provided to the script they won't be linted.

Also it's important to point out that `dist` and `node_modules` folders are not linted thanks to the `ignores` field of the default ESlint config.
