import crossSpawn from "cross-spawn";

import { resolveBin } from "../../utils.js";

vi.mock("cross-spawn", async () => {
  const actual: any = await vi.importActual("cross-spawn");

  return {
    default: {
      ...actual.default,
      sync: vi.fn(() => ({})),
    },
  };
});

const runLintScript = () => import("../../scripts/lint/runScript.js");

describe("lint script", () => {
  it("executes eslint binary", async () => {
    await runLintScript();

    expect(crossSpawn.sync).toHaveBeenCalledTimes(1);
    expect(crossSpawn.sync.mock.calls[0][0]).toBe(resolveBin("eslint"));
  });

  it("passes env variable to enable eslint flat config", async () => {
    await runLintScript();

    expect(crossSpawn.sync.mock.calls[0][2]).toEqual(
      expect.objectContaining({
        env: expect.objectContaining({
          ESLINT_USE_FLAT_CONFIG: "true",
        }),
      }),
    );
  });
});
