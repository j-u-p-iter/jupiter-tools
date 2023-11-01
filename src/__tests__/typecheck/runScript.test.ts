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

const runTypecheckScript = () => import("../../scripts/typecheck/runScript.js");

describe("typecheck script", () => {
  beforeAll(() => {
    process.exit = vi.fn();
  });

  it("executes typescript binary", async () => {
    await runTypecheckScript();

    expect(crossSpawn.sync).toHaveBeenCalledTimes(1);
    expect(crossSpawn.sync.mock.calls[0][0]).toBe(
      resolveBin("typescript", { executable: "tsc" }),
    );
  });
});
