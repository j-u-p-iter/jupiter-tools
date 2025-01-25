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
