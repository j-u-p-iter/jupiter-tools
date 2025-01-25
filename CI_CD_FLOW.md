# CI/CD flow

The CI/CD flow of the project consists of two flows:
- validate
- release

## Validate workflow

The goal of the `Validate` workflow is to validate the package. It goes before the `Release` workflow and in case of validation processed successfully triggers the `Release` workflow to start.
