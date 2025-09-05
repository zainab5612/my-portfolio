import { NextResponse } from "next/server";

export const runtime = "nodejs";

function send(data: unknown) {
  return NextResponse.json(data, { status: 200 }); // never throws to tools
}

// tiny HTML escape
const esc = (s: string) => s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");

// 🔒 normalize envs: trim and strip accidental quotes
const strip = (v?: string) =>
  (v ?? "").trim().replace(/^['"]+|['"]+$/g, "");

const KEY  = strip(process.env.RESEND_API_KEY);
const FROM = strip(process.env.RESEND_FROM);
const TO   = strip(process.env.RESEND_TO);

export async function POST(req: Request) {
  // optional local bypass while you finish Resend setup
  if (process.env.RESEND_BYPASS === "1") {
    return send({ ok: true, id: "local-dev", note: "Bypassed Resend (RESEND_BYPASS=1)" });
  }

  // parse
  let body: { name?: string; email?: string; message?: string };
  try { body = await req.json(); } catch { return send({ ok:false, error:"Invalid JSON body." }); }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  if (!name || !email || !message) {
    return send({ ok:false, error:"Missing required fields: name, email, message." });
  }

  // validate envs
  if (!KEY || !KEY.startsWith("re_")) {
    return send({ ok:false, error:"RESEND_API_KEY is missing/invalid (must start with 're_')." });
  }
  if (!FROM) return send({ ok:false, error:"RESEND_FROM is missing." });
  if (!TO)   return send({ ok:false, error:"RESEND_TO is missing." });

  const recipients = TO.split(",").map(s => s.trim()).filter(Boolean);

  // send via Resend HTTP API (no SDK)
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: recipients,
        subject: `Portfolio contact from ${name}`,
        reply_to: email,
        text: message,
        html: `<div style="font-family:Arial, sans-serif; line-height:1.5">
                 <p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>
                 <pre style="white-space:pre-wrap;margin:0">${esc(message)}</pre>
               </div>`
      }),
    });

    const txt = await r.text();
    let json: any = txt; try { json = JSON.parse(txt); } catch {}

    if (!r.ok) {
      return send({
        ok: false,
        status: r.status,                          // 401 = bad key, 403 = allowlist, 422 = bad from/to
        error: typeof json === "object" ? json?.message ?? "Resend error" : "Resend error",
      });
    }
    return send({ ok: true, id: json?.id ?? null });
  } catch (e: any) {
    return send({ ok:false, error: e?.message ?? "Network error calling Resend" });
  }
}
