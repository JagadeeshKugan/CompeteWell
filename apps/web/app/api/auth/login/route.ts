import { NextResponse } from "next/server";
import { formatError } from "@/lib/api/error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: formatError(data, "Invalid email address or password.") },
        { status: response.status }
      );
    }

    const { access_token, refresh_token, expires_in, refresh_token_expires_in, user } = data;

    // Determine redirect route based on onboarding completion status
    const redirectTo = user.onboarding_completed ? "/dashboard" : "/onboarding";

    const res = NextResponse.json({
      success: true,
      message: "Successfully signed in.",
      user,
      redirectTo,
    });

    // Set Access Token Cookie
    res.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expires_in,
    });

    // Set Refresh Token Cookie
    res.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: refresh_token_expires_in,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to authentication server." },
      { status: 500 }
    );
  }
}
