import { NextResponse } from "next/server";
import { google } from "googleapis";
import { sendLeadNotification } from "@/app/lib/sendLeadNotification";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const lead = await req.json();

const uploadedImages = Array.isArray(lead.uploadedImages)
  ? lead.uploadedImages
  : [];

    const leadId =
  lead.leadId || crypto.randomUUID();

lead.leadId = leadId;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        project_id: process.env.GOOGLE_PROJECT_ID,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
    const sheetName = "Sheet1";

    // Read all existing rows
    const existing =
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:V`,
      });

    const rows = existing.data.values ?? [];

    // Skip header row
    let existingRowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === lead.leadId) {
        existingRowIndex = i + 1; // Google Sheets rows start at 1
        break;
      }
    }

    const now = new Date().toLocaleString();
    const guidedFlowComplete =
  !!lead.eventType &&
  !!lead.eventDate &&
  !!lead.guests &&
  !!lead.budget &&
  !!lead.venue &&
  Array.isArray(lead.services) &&
  lead.services.length > 0;
   

console.log("existingRowIndex =", existingRowIndex);
console.log("leadId =", lead.leadId);

        if (existingRowIndex !== -1) {

      const existingRow = rows[existingRowIndex - 1];
      

     const notificationSent =
  existingRow[19] === "TRUE";

const updatedRow = [

  lead.leadId,
  now,

  lead.name || "",
  lead.phone || "",
  lead.email || "",

  lead.eventType || "",
  lead.eventDate || "",
  lead.guests || "",

  lead.budget || "",
  lead.venue || "",

  Array.isArray(lead.services)
    ? lead.services.join(", ")
    : "",

  lead.requirements || "",
  lead.conversationSummary || "",

  now,

  "🟢 New",
  "",
  "",
  "",
  "Website Chatbot",

  "FALSE",

  Array.isArray(lead.conversation)
    ? lead.conversation
        .map(
          (m: any) =>
            `${m.role === "user" ? "User" : "Assistant"}:\n${m.content}`
        )
        .join("\n\n")
    : "",

  [
  existingRow[21] || "",
  ...uploadedImages.map((img: any) => img.url),
]
  .filter(Boolean)
  .join("\n"),

];
const updateResult =
  await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: `${sheetName}!A${existingRowIndex}:V${existingRowIndex}`,
  valueInputOption: "USER_ENTERED",
  requestBody: {
    values: [updatedRow],
  },
});
console.log("UPDATE RESULT");
console.log(updateResult.data);

if (guidedFlowComplete && !notificationSent) {
  await sendLeadNotification(lead);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!T${existingRowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [["TRUE"]],
    },
  });
}

    } else {

      const newRow = [

  lead.leadId,
  now,

  lead.name || "",
  lead.phone || "",
  lead.email || "",

  lead.eventType || "",
  lead.eventDate || "",
  lead.guests || "",

  lead.budget || "",
  lead.venue || "",

  Array.isArray(lead.services)
    ? lead.services.join(", ")
    : "",

  lead.requirements || "",
  lead.conversationSummary || "",

  now,

  "🟢 New",
  "",
  "",
  "",
  "Website Chatbot",

  "FALSE",

  Array.isArray(lead.conversation)
    ? lead.conversation
        .map(
          (m: any) =>
            `${m.role === "user" ? "User" : "Assistant"}:\n${m.content}`
        )
        .join("\n\n")
    : "",

  uploadedImages
  .map((img: any) => img.url)
  .join("\n"),

];

      const appendResult =
  await sheets.spreadsheets.values.append({

        spreadsheetId,
        range: `${sheetName}!A:V`,
        valueInputOption: "USER_ENTERED",

        requestBody: {
          values: [newRow],
        },

      });
      console.log("APPEND RESULT");
console.log(appendResult.data);

      

    }
    
    
      return NextResponse.json({
  success: true,
  leadId,
});  

  } catch (error) {

    console.error("Lead API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save lead.",
      },
      {
        status: 500,
      }
    );

  }
}