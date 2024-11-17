import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/pinata";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const groupId = formData.get("groupId");

  if (!file || !groupId) {
    return NextResponse.json(
      { error: "File and group ID are required" },
      { status: 400 },
    );
  }

  const response = await uploadFile(file, groupId);
  return NextResponse.json(response);
}
