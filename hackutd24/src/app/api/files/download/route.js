import { NextResponse } from "next/server";
import { downloadFile } from "../../../../../utils/config";

export async function GET(request) {
  const cid = request.nextUrl.searchParams.get("cid");

  if (!cid) {
    return NextResponse.json({ error: "CID required" }, { status: 400 });
  }

  const response = await downloadFile(cid);
  return NextResponse.json(response);
}
