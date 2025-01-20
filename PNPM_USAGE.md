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


