# ABOUT THE PROJECT

## What are jupiter-scripts?

`jupiter-scripts` is a set of useful scripts used on the daily basis provided out of the box. 
This set of tools is very opinionated and is configured according to my prefferences I apply
to set up the projects I work on. Howeveer there are the ways to use custom configurations for the scripts
if it's necessary.

`jupiter-scripts` provides the next set of prepared scripts:

- build;
- lint;
- test;
- typecheck;
- validate;
- commit.

## Internal project principles

Let's talk about the internal principles this project is built upon. The project itself uses the same scripts as the ones
provided by this project to build, lint, test, typecheck, validate and commit.

This is a ESM module. The package.json contains "type" property which is equal to "module" to enable this format.

The project is written on TypeScript. The only part which is written on JavaScript is the helper scripts. They are located in the 
`scripts` folder, which at the same time sits in the root package's folder.

### `scripts` folder

The goals of the helper scripts is to provide functionality to `build`, `commit`, `lint`, `test` and etc. project, using the 
scripts provided by this project.

To be able to run the scripts on the same project they were created in at first the project should be built internally.
At the very beginning there was an attempt to run the scripts, using the `ts-node` utility. But eventually we came to
the conclusion that it's not possible to do because of the specific of the project. The project generates dinamically several
TypeScript configs and rely on them while running scripts. And it means that before building the project with the `build` script
provided by the package itself, these configs should be already generated in the `dist` folder waiting to be used.

To make it possible to run all the scripts on the project itself at first internal __dist__ folder is generated. This folder 
contains the built version of the script. However only the build script is run from the __dist__ folder. After successful run this 
script generates such called external dist folder, which is used by all other scripts to run on the project.

It is very important for us to be able to run the scripts of the project on the project itself primarily from testing purposes. This is why such type decision
was made. When we are using the same scripts created by the project on the project itself, we can detect issue faster and as result fix it faster.
