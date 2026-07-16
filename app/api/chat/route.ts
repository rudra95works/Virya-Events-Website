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
{
  field: "eventDate",
  question: "When is your event?",
  options: [
    "Within 7 days",
    "This Month",
    "Next Month",
    "More than 1 Month Away",
  ],
},
];

function getNextQuestion(lead: {
  eventType: string;
  guests: string;
  budget: string;
  eventDate: string;
}) {
  if (!lead.eventType) {
    return guidedFlow[0];
  }

  if (!lead.guests) {
    return guidedFlow[1];
  }

 if (!lead.budget) {
  return guidedFlow[2];
}

if (!lead.eventDate) {
  return guidedFlow[3];
}

return null;
}

export async function POST(req: Request) {
  try {
    const {
  leadId,
  lead,
  messages,
  field,
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
field: string;
} = await req.json();
console.log("Lead received:", lead);

    const recentMessages = messages.slice(-8);

    const latestMessage =
  recentMessages[recentMessages.length - 1]?.content ?? "";

/*
--------------------------------------------------
Update the lead from the latest guided answer
--------------------------------------------------
*/

if (
  latestMessage !== "__SYSTEM_START__" &&
  latestMessage !== ""
) {
  if (
  field &&
  latestMessage !== "__SYSTEM_START__"
) {
  (lead as Record<string, unknown>)[field] = latestMessage;
}
}
/*
--------------------------------------------------
Now determine what's still missing
--------------------------------------------------
*/

const nextQuestion = getNextQuestion(lead);

if (nextQuestion) {
  return NextResponse.json({
    reply: nextQuestion.question,
    mode: "question",
    field: nextQuestion.field,
    options: nextQuestion.options,
    leadUpdate: lead,
    conversationSummary: "",
  });
}

// All guided questions completed
lead.conversationSummary =
  lead.conversationSummary || "Guided onboarding completed.";

const systemPrompt = buildPrompt(
  `${latestMessage}

Lead Information:
${JSON.stringify(lead, null, 2)}`
);

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

    const leadUpdate = {
  ...lead,
  ...(parsed.leadUpdate || {}),
};

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