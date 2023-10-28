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

const runBuildScript = () => import("../../scripts/build/runScript.js");

describe("build script", () => {
  it("executes typescript binary", async () => {
    await runBuildScript();

    expect(crossSpawn.sync).toHaveBeenCalledTimes(1);
    expect(crossSpawn.sync.mock.calls[0][0]).toBe(
      resolveBin("typescript", { executable: "tsc" }),
    );
  });
});
