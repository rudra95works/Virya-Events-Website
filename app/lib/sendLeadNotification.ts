import { resend } from "./resend";

export async function sendLeadNotification(lead: any) {
  console.log("Lead being emailed:");
console.log(lead);
  const result = await resend.emails.send({
    from: "Virya Events <connect@virya.in>",
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

      <br/><br/>

      <a
        href="${process.env.GOOGLE_SHEET_URL}"
        style="
          display:inline-block;
          padding:14px 28px;
          background:#D4AF37;
          color:#000000;
          text-decoration:none;
          border-radius:8px;
          font-weight:700;
          font-size:16px;
        "
      >
        View Lead
      </a>
    `,
  });

  console.log("Resend Result:");
  console.log(result);
}