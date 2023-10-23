# CI/CD

The name of the github actions workflow is "Validate and Release". The goal of this workflow is to:
  - validate the source code before releasing it; 
  - release the new package build.

The workflow is triggered by the push to the `master` branch.

The `concurrency` field allows us to cancel previously created "Validate and Release" workflow in case
the master branch is updated again. This is why the `cancel-in-progress` set up to `true`.

Concurrency group name consists of two dynamic parts:

- github.workflow - the name of the workflow ("Validate and Release");
- github.ref - the name of the branch ("master").

So, if there is a running workflow "Validate and Release" for the `master` branch and new updates were pushed
to the `master` the previosly running workflow is canceled and new one started.

Next we are declaring the first job we want to run called `validate`.

The first thing we defined for this job is the `strategy` which declares the set of possible environments we want to run the workflow's job
for:

```
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18]
```

As result the `validate` job will be run for all possible combinations of the `os` and `node` fields.

The first step we execute for the `validate` job is checkouting the repo. It's a fancy way to say - cloning the repository
to the runner to be able to work with it. In other words it's a preparational step for the future scripts runs.

The next step is also a preporational one and is used to set up node - to download the distrubution of the requested Node.js version.
The required Node.js distribution version is declared with the `with` keyword. The node version is taken from the matrix context:

```
${{ matrix.node }}
```

which was set up previously.

Next we are installing the dependencies with yarn. Yarn itself will be installed automatically by the Corepack which is a part of a Node.js.
Corepack knows which package manager version to use thanks to the standard packageManager field in your package.json
Also the yarn to be installed properly some files from the .yarn folder should be committed. To do that the .gitignore file should be updated
appropriately.
