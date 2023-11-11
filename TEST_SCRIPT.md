# TEST SCRIPT 

## jupiter-scripts test

For the testing purposes the vitest is used under the hood.

### Configuration

The script is using the default config `vitest.config.ts` from the `/src/configs` folder.
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

## Pass with no tests

By default the test script will fail if no tests files will be found in the package.
It's possible to change this behaviour and force the script not to fail providing
the `--pass-with-no-tests` option:

```
jupiter-scripts test --pass-with-no-tests
```

In this case the script quietly stop without any warnings/errors.

It can be useful to add in CI environment. Also it's necessary to use this option on the precommit step, where only staged
files are tested. And if there are no test files, no test files will be sent to the script to test.

## Find related tests

By default the test script is running for all test files it could find in the package. However there are situations
when it's necessary to run only the tests related to the updated files. It's very useful to do during the precommit step, for example,
when only tests related to the updated files should be run. For such type of cases the `--find-related-tests` option should
be used:

```
jupiter-scripts test --find-related-tests
```
