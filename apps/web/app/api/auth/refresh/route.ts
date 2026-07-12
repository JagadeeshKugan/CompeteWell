import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refresh_token = cookieStore.get("refresh_token")?.value;

    if (!refresh_token) {
      return NextResponse.json(
        { error: "Refresh token is missing." },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Refresh-Token": refresh_token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Clear cookies if refresh token is rejected (session expired/invalidated)
      const res = NextResponse.json(
        { error: data.detail || "Session expired." },
        { status: response.status }
      );
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return res;
    }

    const { access_token, refresh_token: new_refresh_token, expires_in, refresh_token_expires_in, user } = data;

    const res = NextResponse.json({
      success: true,
      user,
    });

    // Update Access Token Cookie
    res.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expires_in,
    });

    // Update Refresh Token Cookie
    res.cookies.set("refresh_token", new_refresh_token, {
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
