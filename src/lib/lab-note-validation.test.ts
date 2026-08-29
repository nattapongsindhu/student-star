import { describe, expect, it } from "vitest";
import { firstOversizedLabNoteField, maxLabNoteLengths, normalizeLabNotePayload } from "./lab-note-validation";

describe("lab note validation", () => {
  it("normalizes optional fields before insert", () => {
    expect(
      normalizeLabNotePayload({
        command_snippet: "  npm test  ",
        next_step: "",
        note: "  keep screenshots  ",
        result_summary: "  passed  ",
      }),
    ).toEqual({
      commandSnippet: "npm test",
      nextStep: null,
      note: "keep screenshots",
      resultSummary: "passed",
    });
  });

  it("flags oversized lab note fields", () => {
    const payload = normalizeLabNotePayload({
      note: "x".repeat(maxLabNoteLengths.note + 1),
    });

    expect(firstOversizedLabNoteField(payload)).toBe("note");
  });
});
