import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const path = body?.path;
    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    revalidatePath(path);

    return NextResponse.json({ revalidated: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
