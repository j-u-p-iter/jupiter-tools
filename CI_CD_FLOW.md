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

The project uses the `pnpm` package manager. Also the project uses `Volta` to manage installation of the developers tools like `Node` and `pnpm`. What exactly versions `Volta` should install is specified in the `package.json`. `Volta` usually automatically installs executables it manages if they don't exist on the machine. However the support for the `pnpm` is experimental for now. This is why `Volta` to install `pnpm` in case it doesn't exist on the machine it's necessary to run `pnpm` script with the `VOLTA_FEATURE_PNPM` environment variable. To set up the `VOLTA_FEATURE_PNPM` environment variable for the `pnpm` the next lines exist in the config:

```
jobs:
  validate:
    ...
    env:
      VOLTA_FEATURE_PNPM: 1
```

Every job consists of steps. There should be at least one step pointed out for every job. The `validate` job consists of multiple steps:

```
jobs:
  validate:
    ...
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup volta
        uses: volta-cli/action@v4

      - name: Install dependencies
        run: pnpm install

      - name: Build package
        run: pnpm build_internal

      - name: Validate package
        run: pnpm validate
```

The first step we execute for the `validate` job is checkouting the repo. It's a fancy way to say - cloning the repository to the runner to be able to work with it. In other words it's a preparational step for the future scripts runs.

```
jobs:
  validate:
    ...
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
```

The next step is also preparational - it installs the `Volta` to the runner. As it was said above we use `Volta` to manage `Node.js` and `pnpm` dependencies. `Volta` installs necessary versions of these executables, provided in the `package.json`.

```
jobs:
  validate:
    ...
    steps:
      - name: Setup volta
        uses: volta-cli/action@v4
```

In the next three steps of the workflow we sequentially 
- install dependencies;
- build the package
- validate the package's code

To run all these scripts we use `pnpm`. `pnpm` to be able to run requires `Node.js`. Please notice, that we haven't installed neither `pnpm` nor `Node` but still are able to run the `pnpm` scripts. The reason, as it was several times mentioned above, is that we use `Volta`, that manages installations of the `pnpm` and `node`. The version for these tools are taken by `Volta` from the `package.json`.

So, when `Volta` runs the first, of the three mentioned above, step, it can see, that there is not `Node` and `pnpm` on the runner. So, before proceeding with the script it installs the `Node` and `pnpm` and after that proceeds with the first step and all other steps.

```
- name: Install dependencies
  run: pnpm install

- name: Build package
  run: pnpm build_internal

- name: Validate package
  run: pnpm validate
```

## Release workflow

The goal of the `Release` workflow is to release the package. It goes after the `Validate` workflow and it's triggered just after the `Validate` workflow is completed.

The name of the workflow is `Release`:

```
name: Release
```

It's triggered after the `Validate` workflow is completed:

```
on:
  workflow_run:
    workflows: [Validate]
    types:
      - completed
```

Please notice, that these instructions don't say anything about if the `Validate` workflow completed with success or not. The condition which includes the `result` of the `Validate` workflow will be specified later.

The current workflow consists of one job, which is called `release`.

```
jobs:
  release:
```

The release process is run on `ubuntu` and to be able to use `pnpm` with `Volta` the `VOLTA_FEATURE_PNPM` environment variable is provided:

```
jobs:
  release:
    runs-on: ubuntu-latest
    env:
      VOLTA_FEATURE_PNPM: 1
```

Of course it doesn't make sense to run the `release` job if the completed `Validate` workflow failed with an error. To run the `release` job's steps only in case the `Validate` workflow (which triggers the `Release` one) completed with success the next if-statement is used:

```
if: ${{ github.event.workflow_run.conclusion == 'success' }}
```
