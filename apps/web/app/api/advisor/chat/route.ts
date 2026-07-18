import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    const body = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const response = await fetch(`${apiUrl}/advisor/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.detail || "Failed to communicate with Advisor." },
        { status: response.status }
      );
    }

    // Extract headers we want to forward
    const conversationId = response.headers.get("X-Conversation-Id");

    // Forward streaming body directly to browser client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        ...(conversationId ? { "X-Conversation-Id": conversationId } : {}),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to backend server." },
      { status: 500 }
    );
  }
}
