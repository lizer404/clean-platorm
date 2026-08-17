import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = String(body.phone ?? "").trim();

    if (!phone || phone.replace(/\D/g, "").length < 12) {
      return NextResponse.json(
        { ok: false, error: "Укажите корректный номер телефона" },
        { status: 400 },
      );
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    console.log("SMS CODE:", code, "| phone:", phone);

    return NextResponse.json({
      ok: true,
      message: "Код отправлен",
      // For local demo visibility only — real SMS gateway would omit this
      expiresIn: 60,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить код" },
      { status: 500 },
    );
  }
}
