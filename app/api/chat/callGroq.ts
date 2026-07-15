import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function callGroq(
  systemPrompt: string,
  messages: any[]
) {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },

        ...messages,
      ],
    });

  return (
    completion.choices[0]?.message?.content ??
    "{}"
  );
}