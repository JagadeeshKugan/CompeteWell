import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Server-side validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
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

    // 2. Timing attack mitigation
    const elapsedTime = Date.now() - startTime;
    const minResponseTime = 600; // ms
    if (elapsedTime < minResponseTime) {
      await new Promise((resolve) => setTimeout(resolve, minResponseTime - elapsedTime));
    }

    // 3. Mock logic
    if (email === "existing@competewell.com") {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    // Success response - instructs frontend to go to verify-otp
    return NextResponse.json({
      success: true,
      message: "Registration successful. Please verify your email.",
      redirectTo: `/verify-otp?email=${encodeURIComponent(email)}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected registration error occurred" },
      { status: 500 }
    );
  }
}
