import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  console.log("Upload request received");
  const contentType = request.headers.get("content-type") || "";
  console.log("Content-Type:", contentType);

  try {
    let buffer: Buffer;
    let filename: string = "file";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ message: "No file provided" }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      filename = file.name;
    } else {
      // Handle raw body upload
      const bytes = await request.arrayBuffer();
      buffer = Buffer.from(bytes);
      const url = new URL(request.url);
      filename = url.searchParams.get("filename") || "upload";
    }

    console.log(`Uploading ${filename} (${buffer.length} bytes)`);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "MEET-OFF",
          resource_type: "auto",
          public_id: filename.split(".")[0],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error details:", error);
    return NextResponse.json({ 
      message: "Upload failed", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
