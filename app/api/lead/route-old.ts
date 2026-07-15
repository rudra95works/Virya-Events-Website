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

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",

      requestBody: {
        values: [
          [
            new Date().toLocaleString(),

            lead.name,
            lead.phone,
            lead.email,

            lead.eventType,
            lead.eventDate,
            lead.guests,

            lead.venue,
            lead.budget,

            Array.isArray(lead.services)
              ? lead.services.join(", ")
              : "",

            lead.requirements,
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}