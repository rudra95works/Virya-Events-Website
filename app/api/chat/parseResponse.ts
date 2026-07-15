export function parseResponse(rawResponse: string) {
  try {
    const parsed = JSON.parse(rawResponse);

    return {
      reply:
        parsed.reply ??
        "Sorry, I couldn't generate a response.",

      leadUpdate:
        parsed.leadUpdate ?? {},
    };
  } catch {
    return {
      reply:
        "Sorry, I couldn't understand the AI response.",
      leadUpdate: {},
    };
  }
}