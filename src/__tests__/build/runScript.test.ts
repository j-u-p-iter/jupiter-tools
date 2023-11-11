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
  let syncMock: any;

  beforeAll(() => {
    process.exit = vi.fn();

    syncMock = crossSpawn.sync as any;
  });

  it("executes typescript binary", async () => {
    await runBuildScript();

    expect(syncMock).toHaveBeenCalledTimes(1);
    expect(syncMock.mock.calls[0][0]).toBe(
      resolveBin("typescript", { executable: "tsc" }),
    );
  });
});
