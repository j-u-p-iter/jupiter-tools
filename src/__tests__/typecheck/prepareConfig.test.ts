import { prepareConfig } from "../../scripts/typecheck/prepareConfig.js";

describe("prepareConfig", () => {
  beforeEach(() => {
    process.argv = [];
  });

  it("returns config passed in options", async () => {
    process.argv = [
      "node",
      "build",
      "--config",
      "some/path/to/typescript.custom.json",
    ];

    expect(prepareConfig(process)).toEqual(
      expect.arrayContaining([
        "--project",
        "some/path/to/typescript.custom.json",
      ]),
    );
  });

  it("does not emit output files", () => {
    expect(prepareConfig(process)).toEqual(
      expect.arrayContaining(["--noEmit"]),
    );
  });
});
