// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Log env sanity once (remove later)
    console.log("ENV OK", {
      KEY_PRESENT: !!process.env.RESEND_API_KEY,
      FROM: process.env.RESEND_FROM,
      TO: process.env.RESEND_TO,
    });

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,               // e.g. Zainab <onboarding@resend.dev>
        to: [process.env.RESEND_TO],                 // e.g. zandulstudent@gmail.com
        subject: `Portfolio contact from ${name}`,
        reply_to: email,
        text: message,
      }),
    });

    const body = await r.json().catch(() => ({}));
    console.log("RESEND RAW", r.status, body);

    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: body?.message || `Resend error ${r.status}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: body?.id ?? null });
  } catch (err: any) {
    console.error("CONTACT API ERROR:", err?.name, err?.message);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
