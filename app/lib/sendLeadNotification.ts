import { resend } from "./resend";

export async function sendLeadNotification(lead: any) {
  const result = await resend.emails.send({
    from: "Virya Events <onboarding@resend.dev>",
    to: "connect@virya.in",

    subject: `🔔 New Lead - ${lead.eventType || "Virya Events"}`,

    html: `
      <h2>New Virya Events Lead</h2>

      <p><strong>Name:</strong> ${lead.name || "-"}</p>
      <p><strong>Phone:</strong> ${lead.phone || "-"}</p>
      <p><strong>Email:</strong> ${lead.email || "-"}</p>

      <hr/>

      <p><strong>Event:</strong> ${lead.eventType || "-"}</p>
      <p><strong>Date:</strong> ${lead.eventDate || "-"}</p>
      <p><strong>Guests:</strong> ${lead.guests || "-"}</p>
      <p><strong>Budget:</strong> ${lead.budget || "-"}</p>
      <p><strong>Venue:</strong> ${lead.venue || "-"}</p>

      <hr/>

      <p><strong>Services:</strong> ${
        Array.isArray(lead.services)
          ? lead.services.join(", ")
          : "-"
      }</p>

      <p><strong>Summary:</strong></p>

      <p>${lead.conversationSummary || "-"}</p>
    `,
  });
  console.log("Resend Result:");
console.log(result);
}