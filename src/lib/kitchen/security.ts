const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;
const PROMPT_INJECTION_PATTERNS = [
  /\b(ignore|disregard|forget|override)\b.{0,80}\b(previous|above|system|developer|instructions?|rules?)\b/i,
  /\b(system|developer|assistant)\s*:/i,
  /\breturn\s+only\b.{0,80}\b(markdown|text|html|xml)\b/i,
  /\bdo\s+not\s+follow\b.{0,80}\b(schema|json|instructions?)\b/i,
  /\bexfiltrate|leak|reveal\b.{0,80}\b(secret|api\s*key|token|prompt)\b/i,
];

export function sanitizeText(value: string) {
  return value
    .replace(CONTROL_CHARACTERS, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsPromptInjection(value: string) {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

export function createDelimitedUserContext(
  entries: Record<string, string>,
) {
  return Object.entries(entries)
    .map(([label, value]) => `<${label}>${sanitizeText(value)}</${label}>`)
    .join("\n");
}

export function publicErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to generate your kitchen plan. Please try again.";
}
