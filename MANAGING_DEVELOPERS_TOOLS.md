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

When the Volta tool is installed in your OS, there are two possible ways how you can start managing Node version in the package.

## Managing package manager (pnpm in our case)

https://www.trevorlasn.com/blog/corepack-nodejs
https://docs.volta.sh/guide/understanding
