# Managing developers tools

## Introduction

Managing developers tools can be hard. Many of us had issues, when switching between projects for some reason build, lint, typecheck and other scripts don't work properly. The same situation can happen, when you work on the same project on different machines. On one machine build, lint, typecheck and others run a OK. And on another machine the same scripts fail with a strange issue. In many (if not in most) cases the reason of this issue is mismatching of develpers tools versions between different environments. For example, in one environment the Node version is 18.18.1 and in another environment it's 20.0.0. Or another example is when one environment uses yarn/pnpm/npm of one version and in another environment the version is different. For many years there were no stable solution for such type of issues. And now we have some of them.

Let's talk about the tools we are using to manage the developers tools in our projects. And by developers tools I mean Node.js and pnpm package manager.

## Managing Node version

Let's start with the description of the way how we manage Node version in our packages.

To manage Node version we use the tool called Volta. The full description of this tool can be found here: https://volta.sh/. Here we'll just provide the main commands we are using to manage Node version.

But before we get familiar with the commands, let's let breifly at the principles underneath of this tool. Let's look how this tool works. It's always very useful to have at least breif understanding of how this/that tool works since it makes it easier to understand the set up process and also it can help if you need sometime to debug this tool.

Volta uses `volta.node` field in the `package.json` file to detect the node version this/that project expects. It can look like that:

```
"volta": {
  "node": "20.16.0"
}
```

When the script, which requires Node, has run "volta" searches for the executables theoretically could be installed previously. If there is necessary version, it just uses it. If there is no required version, it downloads it to the system and starts using it. The next time, when another script is run, it already has this Node version preinstalled, so it just uses it.

The fact, that the Node version is stored in the package.json allows us to bind Node version to the project. So, the project will also be using this exact version no matter what environment it's run for.

There is such a thing as a Volta toolchain. It's a place in the OS reserved by the Volta, which is used to store different executable Volta manages. It's important to mention here, that if, for example, you are using the nvm to manage the Node version, the Node execlutables, installed by the nvm won't be reused by the Volta manager. Volta will install new Node executables with the same version even if there are the same executables installed by the nvm in the OS.

To see the place, where nvm install node, you can run the next command:

```
nvm which v20.14.0
```

The example of the path can look like that:

```
/Users/a1234/.nvm/versions/node/v20.14.0/bin/node
```

As you can see the the Node is installed under the ~/.nvm directory.

The same way we can check where Volta stores Node and other executables:

```
volta which node
```
If you run this command in the project's folder which uses volta to manage Node executable, you can see approximately such type of path:

```
/Users/a1234/.volta/tools/image/node/20.14.0/bin/node
```

So, as you can see from the path the such called Volta toolchain is stored under the `~/.volta` directory.

Too see all the tools in the Volta toolchain Volta is managing in your OS you can use the next command:

```
volta list
```

You can see approximately something like that:

<img width="626" alt="Screenshot 2025-01-13 at 20 39 51" src="https://github.com/user-attachments/assets/fde3ac5e-417a-47d0-9402-48cf3a76a95e" />

All the tools you can see printed on the Terminal's screen are managed by the Volta and executables for them are stored in the Volta toolchain under the `~/.volta` directory.

So, you can use the same `volta which ${executable_name}` command to check, where the executable is stored.

In our projects we use Volta only for managing the Node, but if you want you can manage other tools by Volta either.

When the Volta tool is installed in your OS, there are two possible ways how you can start managing Node version used by all executables in your project.

The first way to do it is to use the next command:

```
volta pin node@18
```

By this command you ask Volta to attach to your project the last 18th LTS.

This one will do several things:

1. If the last 18th LTS is not installed in the Volta toolchain, it will be installed there automatically.
2. After that Volta will update the package.json with the next info:

```
"volta": {
  "node": "18.20.5"
}
```

Since now every time you run any executable in the project's folder, volta will be using exactly this Node version for all of them (babel, webpack and etc.).

What can be confusing is if you type `node --version` and if you use `nvm` to manage Node on your machine you'll see the version of the Node installed in the NVM toolchain, but not in the Volta's one. However, if you want to be sure that you are using correct version of the Node, you can log to the console the `process.version`, which contains information about the current Node version used by the process, you'll see the version, managed by the Volta. It will be the same as the version stored in the package.json.

Another way to start managing Node version in the project by Volta is to update the package.json manually with the info like:

```
"volta": {
  "node": "18.20.5"
}
```

After that if you start any Node process inside of the project's folder with this update in the package.json the next things will happen:

1. If the version of the Node, mentioned in the package.json, is already installed in the OS, Volta won't download anything. And if there's no such type of version, it will download it and store it in the toolchain.
2. Every time since than the new Node process is run, it will be using the Node with the version, mentioned in the package.json.

Let's mention one more Volta's command. It looks like that:

```
volta install node@18
```

This command install Node executable in the Volta toolchain, but doesn't bind Node executable version to the project. Taking into account that Volta installs executables automatically, when it binds executable to the project and starts using it, the usage of the `volta install` command is pretty rare.

## Managing package manager (pnpm in our case)

### Introduction
Package manager version mismatches are a silent killer of productivity. You might not even realize it’s happening until you’re deep into debugging why your builds are failing. One developer uses Yarn v1, another uses v4, and someone else prefers pnpm. Each version brings its own lockfile format, resolution algorithms, and quirks.

These inconsistencies lead to subtle bugs that are maddeningly hard to track down. A dependency might install fine with Yarn v1 but break with v4 due to different resolution strategies. Or your CI pipeline might use a different version than your local environment, causing builds to fail mysteriously.

### Corepack

Luckily there is a manager for the package manager, which is called `Corepack`. `Corepack` is distributed with default installs of Node.js.

Since the `Corepack` is an experimental feature it should be explicitly enabled to have any effect. To do that run:

```
corepack enable
```

And just right after that the `corepack` will be managing the package managers for the project.

The principle of how `Corepack` works very similar to the Volta's working principle.

`Corepack` uses `packageManager` field from the package.json to figure out what package manager the project expects to use. And similar to Volta, there are two ways how `Corepack` can be set up in the project, using one of two possible ways:

The first way is to run the command:

```
corepack use pnpm@9.15.2
```

By this command you ask Corepack to attach to your project the 9.15.2 version of pnpm.

This one will do several things:

1. If the 9.15.2 pnpm version is not installed by the Corepack previously, it will be installed there automatically.
2. After that Corepack will update the package.json with the next info:

```
"packageManager": "pnpm@9.15.2"
```
