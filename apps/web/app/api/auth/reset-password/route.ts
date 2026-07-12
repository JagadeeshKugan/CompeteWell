import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const response = await fetch(`${apiUrl}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Reset password request failed." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Password reset successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to authentication server." },
      { status: 500 }
    );
  }
}
