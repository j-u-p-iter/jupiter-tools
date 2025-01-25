# CI/CD flow

The CI/CD flow of the project consists of two workflows:
- validate
- release

To run CI/CD the github actions are used. Every flow is a separate yml file with the `name` and specific configurations. The configs for the github actions workflows are located in the `.github/workflows` folder.

## Validate workflow

The goal of the `Validate` workflow is to validate the package. It goes before the `Release` workflow and in case of validation processed successfully triggers the `Release` workflow to start.

The `name` of the workflow is `Validate`:

```
name: Validate
```

The workflow is triggered by the push to the `master` branch:

```
on:
  push:
    branches:
      - master
```

The `concurrency` field allows us to cancel previously created "Validate" workflow in case the `master` branch is updated again. This is why the `cancel-in-progress` set up to `true`.

Concurrency group name consists of two dynamic parts:

`github.workflow` - the name of the workflow ("Validate");
`github.ref` - the name of the branch ("master").

These dynamic parts serve to uniquely identify the workflow. Only if the new started workflow has the same `concurrency group` name, the previously started workflow with the same `concurrency group` name will be cancelled in favour of the new one.

Every workflow consists of minimum one job to run. The current workflow consists of one job, which is called `validate`.

```
jobs:
  validate:
```

We validate the package in two OS - `ubuntu` and `window`:

```
jobs:
  validate:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
```

The project uses the `pnpm` package manager. Also the project uses `Volta` to manage installation of the developers tools like `Node` and `pnpm`. What exactly versions `Volta` should install is specified in the `package.json`. `Volta` usually automatically installs executables it manages if they don't exist on the machine. However the support for the `pnpm` is experimental for now. This is why `Volta` to install `pnpm` in case it doesn't exist on the machine it's necessary to run `pnpm` script with the `VOLTA_FEATURE_PNPM` environment variable.
