export const maxLabNoteLengths = {
  command_snippet: 4_000,
  next_step: 1_000,
  note: 2_000,
  result_summary: 2_000,
} as const;

export type LabNotePayload = {
  commandSnippet: string | null;
  nextStep: string | null;
  note: string;
  resultSummary: string | null;
};

export function normalizeLabNotePayload(body: Record<string, unknown>): LabNotePayload {
  return {
    commandSnippet: optionalInputField(body.command_snippet),
    nextStep: optionalInputField(body.next_step),
    note: inputField(body.note).trim(),
    resultSummary: optionalInputField(body.result_summary),
  };
}

export function firstOversizedLabNoteField(payload: LabNotePayload) {
  const fields = {
    command_snippet: payload.commandSnippet,
    next_step: payload.nextStep,
    note: payload.note,
    result_summary: payload.resultSummary,
  };
  const entries = Object.entries(fields) as [keyof typeof maxLabNoteLengths, string | null][];
  const oversized = entries.find(([field, value]) => value !== null && value.length > maxLabNoteLengths[field]);
  return oversized?.[0] ?? null;
}

function inputField(value: unknown) {
  return typeof value === "string" ? value : "";
}

function optionalInputField(value: unknown) {
  const trimmed = inputField(value).trim();
  return trimmed ? trimmed : null;
}
