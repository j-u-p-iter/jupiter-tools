# Managing developers tools

## Introduction

Managing developers tools can be hard. Many of us had issues, when switching between projects for some reason build, lint, typecheck and other scripts don't work properly. The same situation can happen, when you work on the same project on different machines. On one machine build, lint, typecheck and others run a OK. And on another machine the same scripts fail with a strange issue. In many (if not in most) cases the reason of this issue is mismatching of develpers tools versions between different environments. For example, in one environment the Node version is 18.18.1 and in another environment it's 20.0.0. Or another example is when one environment uses yarn/pnpm/npm of one version and in another environment the version is different. For many years there were no stable solution for such type of issues. And now we have some of them.

Let's talk about the tools we are using to manage the developers tools in our projects. And by developers tools I mean Node.js and pnpm package manager.

## Managing Node version

Let's start with the description of the way how we manage Node version in our packages.

To manage Node version we use the tool called Volta. The full description of this tool can be found here: https://volta.sh/. Here we'll just provide the main commands we are using to manage Node version.

But before we get familiar with the commands, let's let breifly at the principles underneath of this tool. Let's look how this tool works. It's always very useful to have at least breif understanding of how this/that tool works since it makes it easier to understand the set up process and also it can help if you need sometime to debug this tool.



## Managing package manager (pnpm in our case)
