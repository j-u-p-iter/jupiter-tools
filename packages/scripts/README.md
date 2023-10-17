# Available Scripts

## jupiter-scripts lint

For the linting purposes the ESLint is used under the hood.

### Configuration

The script is using the default config from @jupiter-tools/eslint-config-jupiter package.

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

It's important to point out that the predefined ESlint config from the ./config derictory contains `files` property. 
This property contains the glob of all possible files to lint. If this glob doesn't match with the files to lint
provided to the script they won't be linted.

Also it's important to point out that dist and node_modules folder are not linted thanks to the `ignores` field of the default ESlint config.

## jupiter-scripts test

For the testing purposes the vitest is used under the hood.

### Configuration

The script is using the default config `vitest.config.ts` from the `/config` folder.
This config contains the prefferable common configurations.

It's possible to replace this config with such called builtin config. You have next options to do that:

- pointing out the path to the custom config with the `--config` option:

```
jupiter-scripts test --config ./path/to/customConfig.js
```

- creating the `vitest.config.ts` config in the root folder of the project (next to the package.json file). Vitest
will find, read and use this config automatically.


### Watch mode

To run script in watch mode the `--watch` option should be provided.

```
jupiter-scripts test --watch
```

### Update snapshots

To update snapshots the `--update` option should be provided.

```
jupiter-scripts test --update
```

## jupiter-scripts build

For the building process typescript is used under the hood.

### Configuration

By default this project relies on the tsconfig.json from the @jupiter-tools/tsconfig-jupiter package. This packages
contains prefferable configurations I use in all my projects.

Because of the specific of how TypeScript works with the config and what options should be put there we can't just 
point out the path to this config for the build script. Instead we are copying this config in the `configs` directory,
located in the dist folder when we run any script first time. For that purpose we use setUpTsConfig utility, located
in the `setUpTsConfig.ts` file.

It's important to point declarationDir, outDir, include and exclude paths in the tsconfig.json it to work properly. We can't do it universally
in one common place since these paths are specific to the location of the tsconfig.json file in every project. Because of that we update this config
dynamically while we are copying it to the `configs/` folder while running any of the scripts of this project.

So, before any scripts of this project starts running the necessary tsconfig.json is already prepared and sits in the `dist/configs` folder.

At the same time it's possible to replace this config with such called builtin config. You have next options to do that:

- pointing out the path to the custom config with the `--config` option:

```
jupiter-scripts build --config ./path/to/tsconfig.json
```

- creating the `tsconfig.json` config in the root folder of the project (next to the package.json file). TypeScript
will find, read and use this config automatically.

## jupiter-scripts typecheck

For the typechecking process typescript is used under the hood.

### Configuration

By default this project relies on the tsconfig.json from the @jupiter-tools/tsconfig-jupiter package. This packages
contains prefferable configurations I use in all my projects.

Because of the specific of how TypeScript works with the config and what options should be put there we can't just 
point out the path to this config for the typecheck script. Instead we are copying this config in the `configs` directory,
located in the dist folder when we run any script first time. For that purpose we use setUpTsConfig utility, located
in the `setUpTsConfig.ts` file.

It's important to point `declarationDir`, `outDir`, `include` and `exclude` paths in the tsconfig.json it to work properly. We can't do it universally
in one common place since these paths are specific to the location of the tsconfig.json file in every project. Because of this we update this config
dynamically while we are copying it to the `configs/` folder while running any of the scripts of this project.

So, before any scripts of this project starts running the necessary tsconfig.json is already prepared and sits in the `dist/configs` folder.

At the same time it's possible to replace this config with such called builtin config. You have next options to do that:

- pointing out the path to the custom config with the `--config` option:

```
jupiter-scripts typecheck --config ./path/to/tsconfig.json
```

- creating the `tsconfig.json` config in the root folder of the project (next to the package.json file). TypeScript
will find, read and use this config automatically.

## About multiple TypeScript configuration files into the configs/ folder 

lint, test, typecheck and build scripts are using TypeScript configuration file while there are running. So, there is 
should be somewhere configuration file which should be provided to these scripts. While it's possible to provide
configuration file to these scripts in every project they are used, there is a lot of redundant work which could be
avoid. Instead of creating specific config for every projects these scripts are used in, the common TypeScript configuration
files are used.

These files are created dynamically when any of the scripts is run first time. `setUpTsConfigs.ts` module of this project is responsible
for that.

It's necessary to point out in the TypeScript configuration file the include and exclude paths the process to work properly.

The "include" key should include the paths the TypeScript should run for. Usually it's a ["src"] folder, where all the source code files
are located. The path to the "src" folder is relative to the position of the config. It leads to the situation where our configs
also should contain the include paths relative to the root folder. And it forces us to set up this path dynamically as absolute paths.

If you open the "dist/lib/configs" folder of this package, you'll find the "include" path which looks like that:

{
  ...
  "include": ["/Users/a1234/Sites/jupiter-tools/packages/scripts/src"]
  ...
}

The "exclude" key should include the paths the TypeScript shouldn't run for. Usually it's a "coverage", "dist", "node_modules" folders. Again, 
usually these paths are relative to the location of the position of the configuration file. In our case we set up them dynamically as absolute paths. 

If you open the "dist/lib/configs" folder of this package, you'll find the "include" path which looks like that:

{
  ...
  "exclude": [
    "/Users/a1234/Sites/jupiter-tools/packages/scripts/coverage",
    "/Users/a1234/Sites/jupiter-tools/packages/scripts/node_modules",
    "/Users/a1234/Sites/jupiter-tools/packages/scripts/**/__tests__"
  ]
  ...
}

There is a slight difference in how configuration files for build and other scripts should look like. The only difference in our case
is that build script should exclude additionally __tests__ folder. This is the reason why in the "dist/lib/configs/" folder you can find
not one but two different configs:

- tsconfg.base.json
- tsconfig.build.json

The "base" config extends common @jupter-tools/tsconfig-jupiter config and is used for lint, test and typecheck scripts. 
The "build" config extends the "base" config and is used for build script.

The "build" config has two differences from the "base" config. 

Since the "build" script emits the output files we need to
point out the result directories for the types and the main source code. For that purpose the "build" config extends the "base" one
with two additional "compilerOptions" - "declarationDir" and "outDir". Again, paths for these keys are absolute and are generated dynamically
on first script run.

Also the "build" script shouldn't build files which are used for testing purposes. This is why the "build" config extends the "base" one
with one additional "exclude" key, which contains absolute path to the __tests__ folder.
