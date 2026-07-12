import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refresh_token = cookieStore.get("refresh_token")?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    if (refresh_token) {
      // Call backend logout to terminate session in database
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Refresh-Token": refresh_token,
        },
      });
    }

    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    // Clear authentication cookies
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");

    return res;
  } catch (error) {
    // Return success anyway, but clear local cookies
    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully (session cleared locally).",
    });
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return res;
  }
}
