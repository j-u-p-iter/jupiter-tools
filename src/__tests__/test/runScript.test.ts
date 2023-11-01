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
  beforeAll(() => {
    process.exit = vi.fn();
  });

  it("executes vitest binary", async () => {
    await runTestScript();

    expect(crossSpawn.sync).toHaveBeenCalledTimes(1);
    expect(crossSpawn.sync.mock.calls[0][0]).toBe(resolveBin("vitest"));
  });
});
