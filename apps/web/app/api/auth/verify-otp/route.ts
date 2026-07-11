import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { email, otp } = body;

    // 1. Server-side validation
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Verification code must be exactly 6 digits" },
        { status: 400 }
      );
    }

    // 2. Timing attack mitigation
    const elapsedTime = Date.now() - startTime;
    const minResponseTime = 600; // ms
    if (elapsedTime < minResponseTime) {
      await new Promise((resolve) => setTimeout(resolve, minResponseTime - elapsedTime));
    }

    // 3. Mock verification logic
    // In production, fetch code from DB/Redis, check hash & expiration
    if (otp === "999999") {
      return NextResponse.json(
        { error: "This verification code has expired. Please resend and try again." },
        { status: 410 }
      );
    }

    if (otp === "123456") {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
        redirectTo: "/dashboard",
      });
    }

    return NextResponse.json(
      { error: "Invalid verification code. Please check and try again." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during email verification" },
      { status: 500 }
    );
  }
}
