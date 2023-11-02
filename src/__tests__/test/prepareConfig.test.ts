import path from "path";

import { getDirName } from "../../utils.js";

import { prepareConfig } from "../../scripts/test/prepareConfig.js";

const __dirname = getDirName(import.meta.url);

describe("prepareConfig", () => {
  beforeEach(() => {
    process.argv = [];
  });

  describe("--config option", () => {
    it("returns correct config by default", async () => {
      expect(prepareConfig(process)).toEqual(
        expect.arrayContaining([
          "--config",
          path.join(__dirname, "../../configs/vitest.config.js"),
        ]),
      );
    });
  });

  it("returns config passed in options", async () => {
    process.argv = [
      "node",
      "vitest",
      "--config",
      "some/path/to/vitest.config.js",
    ];

    expect(prepareConfig(process)).toEqual(
      expect.arrayContaining(["--config", "some/path/to/vitest.config.js"]),
    );
  });

  describe("watch mode", () => {
    it("is disabled by default", () => {
      const config = prepareConfig(process);

      expect(config).toEqual(expect.arrayContaining(["--run"]));
      expect(config).toEqual(expect.not.arrayContaining(["--watch"]));
    });

    it("is enabled with the --watch option", () => {
      process.argv = ["node", "vitest", "--watch"];

      const config = prepareConfig(process);

      expect(config).toEqual(expect.not.arrayContaining(["--run"]));
      expect(config).toEqual(expect.arrayContaining(["--watch"]));
    });
  });

  describe("--update option", () => {
    it("is not passed by default", () => {
      expect(prepareConfig(process)).toEqual(
        expect.not.arrayContaining(["--update"]),
      );
    });

    it("is returned when the --update option is passed to the script", () => {
      process.argv = ["node", "vitest", "--update"];

      expect(prepareConfig(process)).toEqual(
        expect.arrayContaining(["--update"]),
      );
    });
  });
});
