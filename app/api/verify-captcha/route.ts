import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing captcha token" },
        { status: 400 }
      );
    }

    const secret = process.env.HCAPTCHA_SECRET_KEY;
    if (!secret) {
      console.error("[verify-captcha] HCAPTCHA_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams();
    params.append("response", token);
    params.append("secret", secret);

    const verifyRes = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await verifyRes.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Captcha verification failed" },
      { status: 400 }
    );
  } catch (err) {
    console.error("[verify-captcha] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
