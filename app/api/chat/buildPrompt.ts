import { SYSTEM_PROMPT } from "./systemPrompt";

import { COMPANY } from "./knowledge/company";
import { EVENTS } from "./knowledge/events";
import { SERVICES } from "./knowledge/services";
import { PROCESS } from "./knowledge/process";
import { VENDORS } from "./knowledge/vendors";
import { FAQ } from "./knowledge/faq";
import { PRICING } from "./knowledge/pricing";
import { LEAD } from "./knowledge/lead";
import { POLICIES } from "./knowledge/policies";
import { VOICE } from "./knowledge/voice";

export function buildPrompt(
  userMessage: string,
  lead?: {
    eventType: string;
    guests: string;
    budget: string;
  },
  uploadedImages?: {
    url: string;
    filename: string;
  }[]
) {



  const message = userMessage.toLowerCase();

  const knowledge = [
    COMPANY,
    VOICE,
    LEAD
  ];

  // Event types
  if (
    message.includes("birthday") ||
    message.includes("wedding") ||
    message.includes("engagement") ||
    message.includes("baby") ||
    message.includes("housewarming") ||
    message.includes("corporate") ||
    message.includes("conference") ||
    message.includes("party")
  ) {
    knowledge.push(EVENTS);
  }

  // Services
  if (
    message.includes("decor") ||
    message.includes("catering") ||
    message.includes("photo") ||
    message.includes("video") ||
    message.includes("dj") ||
    message.includes("venue") ||
    message.includes("music") ||
    message.includes("cake") ||
    message.includes("sound")
  ) {
    knowledge.push(SERVICES);
  }

  // Planning
  if (
    message.includes("plan") ||
    message.includes("process") ||
    message.includes("book") ||
    message.includes("how")
  ) {
    knowledge.push(PROCESS);
  }

  // Vendors
  if (
    message.includes("vendor") ||
    message.includes("photographer") ||
    message.includes("decorator") ||
    message.includes("florist")
  ) {
    knowledge.push(VENDORS);
  }

  // Pricing
  if (
    message.includes("price") ||
    message.includes("cost") ||
    message.includes("quotation") ||
    message.includes("quote") ||
    message.includes("budget") ||
    message.includes("discount")
  ) {
    knowledge.push(PRICING);
  }

  // Policies
  if (
    message.includes("gst") ||
    message.includes("refund") ||
    message.includes("cancel") ||
    message.includes("payment") ||
    message.includes("invoice")
  ) {
    knowledge.push(POLICIES);
  }

  // FAQ
  if (message.includes("?")) {
    knowledge.push(FAQ);
  }

  const leadContext = lead
  ? `
Current Lead Information:

Event Type: ${lead.eventType || "Not collected"}
Guests: ${lead.guests || "Not collected"}
Budget: ${lead.budget || "Not collected"}
`
  : "";


  const imageContext = `
Conversation Context:

Uploaded Inspiration Images: ${uploadedImages?.length ?? 0}

If the number above is greater than 0:

• The uploaded inspiration images have already been received successfully.
• They are attached to this enquiry.
• The Virya Events planning team has access to them and will consider them while planning the event, preparing recommendations, selecting vendors and creating the quotation.
• The customer may naturally refer to those uploaded images later in the conversation using contextual language such as "this", "that", "these", "those", or similar references.
`;

  return `
${SYSTEM_PROMPT}

${leadContext}

${imageContext}

${knowledge.join("\n\n")}
`;
}