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
const guidedFlow = [
  {
    field: "eventType",
    question: "What type of event are you planning?",
    options: [
      "Birthday",
      "Wedding",
      "Corporate",
      "Housewarming",
    ],
  },
  {
    field: "guests",
    question: "Approximately how many guests are you expecting?",
    options: [
      "Under 50",
      "50–100",
      "100–250",
      "250+",
    ],

  },
  {
    field: "budget",
    question: "What's your approximate event budget?",
    options: [
      "Under ₹1 Lakh",
      "₹1–3 Lakhs",
      "₹3–5 Lakhs",
      "₹5 Lakhs+",
    ],
  },
];

export async function POST(req: Request) {
  try {
    const {
  leadId,
  lead,
  messages,
}: {
  leadId: string;
  lead: {
    name: string;
    phone: string;
    email: string;
    eventType: string;
    eventDate: string;
    guests: string;
    venue: string;
    budget: string;
    services: string[];
    requirements: string;
    conversationSummary: string;
  };
  messages: ChatMessage[];
} = await req.json();

    const recentMessages = messages.slice(-8);

    const latestMessage =
  recentMessages[recentMessages.length - 1]?.content ?? "";

/*
--------------------------------------------------
Update the lead from the latest guided answer
--------------------------------------------------
*/

if (
  !lead.eventType &&
  guidedFlow[0].options.includes(latestMessage)
) {
  lead.eventType = latestMessage;
}

if (
  !lead.guests &&
  guidedFlow[1].options.includes(latestMessage)
) {
  lead.guests = latestMessage;
}

if (
  !lead.budget &&
  guidedFlow[2].options.includes(latestMessage)
) {
  lead.budget = latestMessage;
}

/*
--------------------------------------------------
Now determine what's still missing
--------------------------------------------------
*/

const needsEventType = !lead.eventType;

const needsGuests = !lead.guests;
const needsBudget = !lead.budget;

    if (needsEventType) {

  const firstQuestion = guidedFlow[0];

  return NextResponse.json({

    reply: firstQuestion.question,

    mode: "question",

    field: firstQuestion.field,

    options: firstQuestion.options,

    leadUpdate: lead,

    conversationSummary: "",

  });

}

if (needsGuests && lead.eventType) {

  const nextQuestion = guidedFlow[1];

  return NextResponse.json({

    reply: nextQuestion.question,

    mode: "question",

    field: nextQuestion.field,

    leadUpdate: lead,

    options: nextQuestion.options,

    conversationSummary: "",

  });

}

if (needsBudget && lead.guests) {

  const nextQuestion = guidedFlow[2];

  return NextResponse.json({

    reply: nextQuestion.question,

    mode: "question",

    field: nextQuestion.field,

    leadUpdate: lead,

    options: nextQuestion.options,

    conversationSummary: "",

  });

}


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
      chatCompletion.choices[0]?.message?.content || "{}";

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
      leadId,
      leadUpdate,
      options: parsed.options || [],
      mode: parsed.mode || "chat",
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