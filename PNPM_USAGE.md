# PNPM
PNPM is a relatively new package manager, which is faster than any another because of some special dependencies mechanism resolution.

We use `pnpm` for both, non-monorepo and monorepo projects.

## Usage for the non-monorepo

The usage for the non-monorepo is very simple. You just should use `pnpm` command instead of `yarn/npm` or whatever you've used previously.

## Usage for the monorepo

`pnpm` also can be used to manage the monorepos.

The example of the main command we use in our monorepos is:

```
pnpm --recursive run lint
```

This command runs `lint` script for every project of the workspace concurrently.

For the `build` script we use slightly different command, which looks like that:

```
pnpm --recursive run --sequential build
```

It also runs the `build` script for every project of the workspace, but in a sequential way. It means the next `build` script runs just after (and not sooner) the previous `build` script finishes running. We have to run the `build` script in a sequential way (even if it's slower) because of the specific of how the `jupiter-scripts build` script operates. The `build` script constantly overwrites the common `tsconfig.json` file with the new paths, so if the `build` script is run concurrently, the paths from the `tsconfig.json` can be used by the wrong package, which will lead to the obvious issue.

## Configuring the project with the pnpm

For the non-monorepo projects you don't need to do anything but install the pnpm. To manage the pnpm executable we are using `Volta`.
For the monorepo projects the only thing you should do is to add `pnpm-workspace.yaml` file with the next lines:

```
packages:                                                                      
  - packages/* 
```

It will tell pnpm, where the workspace packages are located (in the `packages` folder in this case). It's a more or less standard to name the folder, which contains the workspace packages as `packages`, but you are free to use absolutely any name of course. 

## Migrating from another package manager to pnpm

In case you are migrating to pnpm from another package manager, you should do several things:
- be sure you've removed all the configs for the previous package manager. In case of yarn it is `.yarn` folder, for example.
- be sure you've removed the lock file, created by the previous package manager. In case of yarn it's yarn.lock file, for example.
- remove node_modules folder and reinstall dependencies, using pnpm. It's necessary since different package managers use different, in most cases incompatible with each other, dependencies resolutions algorithms.
- `pnpm-lock.yml` file should be commited.
