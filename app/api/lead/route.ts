import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const lead = await req.json();

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
        range: `${sheetName}!A:S`,
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
        if (existingRowIndex !== -1) {

      const existingRow = rows[existingRowIndex - 1];

      const updatedRow = [

        lead.leadId,

        existingRow[1] || now,          // Timestamp
        lead.name || existingRow[2] || "",
        lead.phone || existingRow[3] || "",
        lead.email || existingRow[4] || "",
        lead.eventType || existingRow[5] || "",
        lead.eventDate || existingRow[6] || "",
        lead.guests || existingRow[7] || "",
        lead.budget || existingRow[8] || "",
        lead.venue || existingRow[9] || "",

        Array.isArray(lead.services)
          ? lead.services.join(", ")
          : existingRow[10] || "",

        lead.requirements || existingRow[11] || "",
        lead.conversationSummary || existingRow[12] || "",

        now,                            // Last Updated

        existingRow[14] || "🟢 New",     // Status
        existingRow[15] || "",          // Assigned To
        existingRow[16] || "",          // Follow-up Date
        existingRow[17] || "",          // Estimated Value
        existingRow[18] || "Website Chatbot", // Source

      ];

      await sheets.spreadsheets.values.update({

        spreadsheetId,
        range: `${sheetName}!A${existingRowIndex}:S${existingRowIndex}`,
        valueInputOption: "USER_ENTERED",

        requestBody: {
          values: [updatedRow],
        },

      });

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

      ];

      await sheets.spreadsheets.values.append({

        spreadsheetId,
        range: `${sheetName}!A:S`,
        valueInputOption: "USER_ENTERED",

        requestBody: {
          values: [newRow],
        },

      });

    }
        return NextResponse.json({
      success: true,
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