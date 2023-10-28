import path from "path";

import { prepareConfig } from "../../scripts/lint/prepareConfig.js";

describe("prepareConfig", () => {
  beforeEach(() => {
    process.argv = [];
  });

  describe("--config option", () => {
    it("returns correct config by default", async () => {
      expect(prepareConfig(process)).toEqual(
        expect.arrayContaining([
          "--config",
          path.join(__dirname, "../../configs/eslint.config.js"),
        ]),
      );
    });
  });

  it("returns config passed in options", async () => {
    process.argv = [
      "node",
      "eslint",
      "--config",
      "some/path/to/eslint.config.js",
    ];

    expect(prepareConfig(process)).toEqual(
      expect.arrayContaining(["--config", "some/path/to/eslint.config.js"]),
    );
  });
});
