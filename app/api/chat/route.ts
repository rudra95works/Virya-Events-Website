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
  "Housewarming",
  "Corporate Event",
  "Engagement",
  "Baby Shower",
  "Anniversary",
  "Others",
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
{
  field: "venue",
  question: "What kind of venue are you looking for?",
  options: [
    "I already have a venue",
    "Need help finding one",
    "Not decided yet",
    "Virtual Event",
  ],
},
{
  field: "services",
  question: "Which services are you interested in?",
  options: [
    "Decoration",
    "Catering",
    "Photography & Videography",
    "DJ & Entertainment",
    "Sound & Lighting",
    "Invitation & RSVP",
    "Makeup & Styling",
    "Venue Assistance",
  ],
},
];

function getNextQuestion(lead: {
  eventType: string;
  guests: string;
  budget: string;
  eventDate: string;
  venue: string;
  services: string[];
requirements: string;
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

if (!lead.venue) {
  return guidedFlow[4];
}

if (!lead.services.length) {
  return guidedFlow[5];
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
  uploadedImages,
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
uploadedImages: {
  url: string;
  filename: string;
}[];
} = await req.json();
console.log("Lead received:", lead);

    const recentMessages = messages;

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

  if (field === "services") {
    lead.services = latestMessage
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
  } else {
    (lead as Record<string, unknown>)[field] = latestMessage;
  }

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

if (field === "services") {

  lead.conversationSummary =
    lead.conversationSummary || "Guided onboarding completed.";

  const servicesList = lead.services
    .map((service) => `• ${service}`)
    .join("\n");

  return NextResponse.json({
  reply: `✓ Planning Complete

Perfect! I have the basic details of your event.

Selected services:
${servicesList}

Requirements Analyzed

You can now ask me anything about your event.`,
  mode: "completed",
  leadUpdate: lead,
  options: [],
});

}



const systemPrompt = buildPrompt(
  `
Current Lead Information

Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email}

Event Type: ${lead.eventType}
Guests: ${lead.guests}
Budget: ${lead.budget}
Event Date: ${lead.eventDate}
Venue: ${lead.venue}
Services: ${lead.services.join(", ")}

Latest User Message:
${latestMessage}
`,
  {
    eventType: lead.eventType,
    guests: lead.guests,
    budget: lead.budget,
  },
  uploadedImages
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
  ...recentMessages.map((message) => ({
    role: message.role,
    content: message.content,
  })),
],
    });

    const rawResponse =
      chatCompletion.choices[0]?.message?.content || "{}";

    const parsed = JSON.parse(rawResponse);

    const reply =
      parsed.reply ||
      "Sorry, I couldn't generate a response.";

    const aiLeadUpdate = parsed.leadUpdate || {};

const leadUpdate = {
  ...lead,
};

for (const [key, value] of Object.entries(aiLeadUpdate)) {
  if (
    value !== "" &&
    value !== null &&
    value !== undefined
  ) {
    (leadUpdate as any)[key] = value;
  }
}

    const conversationSummary =
      parsed.conversationSummary || "";

    console.log("Lead Update:", leadUpdate);

    return NextResponse.json({
  reply,
  leadId,
  leadUpdate,
  conversationSummary,
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