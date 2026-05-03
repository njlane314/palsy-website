import { NextResponse } from "next/server";
import postmark from "postmark";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(200),
  company: z.string().min(2).max(160),
  role: z.string().max(120).optional(),
  message: z.string().min(10).max(4000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "sales@example.com";
  const apiKey = process.env.POSTMARK_SERVER_TOKEN;

  if (!apiKey || !to) {
    console.info("Contact form accepted without email delivery; set POSTMARK_SERVER_TOKEN and CONTACT_TO_EMAIL.");
    return NextResponse.json({ ok: true, emailDelivered: false });
  }

  const client = new postmark.ServerClient(apiKey);
  const { name, email, company, role, message } = parsed.data;

  await client.sendEmail({
    From: from,
    To: to,
    ReplyTo: email,
    Subject: `IngressShield demo request from ${company}`,
    TextBody: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      `Role: ${role || "Not provided"}`,
      "",
      message,
    ].join("\n"),
  });

  return NextResponse.json({ ok: true, emailDelivered: true });
}
