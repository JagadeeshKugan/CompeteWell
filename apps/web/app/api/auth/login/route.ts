import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Server-side validation (Crucial SAST defense: Never trust client inputs)
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 2. Mock authentication lookup
    // In production, check hashed password via bcrypt/argon2
    const isValidUser = email === "user@competewell.com" && password === "Password123!";

    // 3. Timing attack mitigation (DAST protection)
    // Ensure all auth requests take a minimum amount of time to process
    const elapsedTime = Date.now() - startTime;
    const minResponseTime = 600; // ms
    if (elapsedTime < minResponseTime) {
      await new Promise((resolve) => setTimeout(resolve, minResponseTime - elapsedTime));
    }

    if (isValidUser) {
      // In production, sign JWT and set as HttpOnly cookie:
      // const response = NextResponse.json({ success: true });
      // response.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
      return NextResponse.json({
        success: true,
        message: "Successfully signed in",
        user: { email, name: "John Doe" },
        redirectTo: "/dashboard",
      });
    }

    // 4. Account enumeration prevention (DAST defense)
    // Return a generic error message so attackers cannot check if an email exists
    return NextResponse.json(
      { error: "Invalid email address or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected authentication error occurred" },
      { status: 500 }
    );
  }
}
