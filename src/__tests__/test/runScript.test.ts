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

const runTestScript = () => import("../../scripts/test/runScript.js");

describe("test script", () => {
  let syncMock: any;

  beforeAll(() => {
    process.exit = vi.fn();

    syncMock = crossSpawn.sync as any;
  });

  it("executes vitest binary", async () => {
    await runTestScript();

    expect(syncMock).toHaveBeenCalledTimes(1);
    expect(syncMock.mock.calls[0][0]).toBe(resolveBin("vitest"));
  });
});
