import { describe, expect, it } from "vitest";
import { shouldLoadPersistedRunLog } from "./AgentDetail";

describe("shouldLoadPersistedRunLog", () => {
  it("skips a cancelled run whose log reference has no persisted bytes", () => {
    expect(shouldLoadPersistedRunLog({
      status: "cancelled",
      logRef: "company/agent/run.ndjson",
      logBytes: null,
      lastOutputBytes: null,
    })).toBe(false);
  });

  it("loads a terminal run only when its persisted output has bytes", () => {
    expect(shouldLoadPersistedRunLog({
      status: "cancelled",
      logRef: "company/agent/run.ndjson",
      logBytes: 128,
      lastOutputBytes: 128,
    })).toBe(true);
  });

  it("keeps a terminal run's log available when output progress was recorded before finalization", () => {
    expect(shouldLoadPersistedRunLog({
      status: "cancelled",
      logRef: "company/agent/run.ndjson",
      logBytes: 0,
      lastOutputBytes: 128,
    })).toBe(true);
  });

  it("keeps polling a live run that has a log reference before its first output", () => {
    expect(shouldLoadPersistedRunLog({
      status: "running",
      logRef: "company/agent/run.ndjson",
      logBytes: null,
      lastOutputBytes: null,
    })).toBe(true);
  });
});
