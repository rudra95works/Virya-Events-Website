import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {


    const formData = await request.formData();

    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No images uploaded." },
        { status: 400 }
      );
    }

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const blob = await put(
  `event-images/${Date.now()}-${file.name}`,
  file,
  {
    access: "public",
    token: process.env.EVENT_IMAGES_READ_WRITE_TOKEN,
  }
);

        return {
          url: blob.url,
          filename: file.name,
        };
      })
    );

    return NextResponse.json({
      success: true,
      images: uploaded,
    });

  } catch (error) {
  console.error("UPLOAD ROUTE ERROR:");
  console.error(error);

  if (error instanceof Error) {
    console.error(error.stack);
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: "Unknown upload error",
    },
    { status: 500 }
  );
}
}