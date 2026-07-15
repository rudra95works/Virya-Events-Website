import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { buildPrompt } from "./buildPrompt";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const {
      messages,
    }: {
      messages: ChatMessage[];
    } = await req.json();

const recentMessages = messages.slice(-8);

const latestMessage =
  recentMessages[recentMessages.length - 1]?.content ?? "";

const systemPrompt = buildPrompt(latestMessage);
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: {
  type: "json_object",
},


      messages: [
  {
    role: "system",
    content: systemPrompt,
  },

  ...recentMessages,
],
    });

    const rawResponse =
  chatCompletion.choices[0]?.message?.content ||
  "{}";

const parsed = JSON.parse(rawResponse);

const reply =
  parsed.reply ||
  "Sorry, I couldn't generate a response.";

const leadUpdate =
  parsed.leadUpdate || {};

  const conversationSummary =
  parsed.conversationSummary || "";


  console.log("Lead Update:", leadUpdate);

 return NextResponse.json({
  reply,
  leadUpdate,
  conversationSummary,
});

  } catch (error) {
  console.error(error);

  return NextResponse.json(
    {
      reply:
        "Our AI assistant is temporarily busy. Please try again in a few minutes.",
    },
    {
      status: 503,
    }
  );
}
}