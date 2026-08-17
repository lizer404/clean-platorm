import { NextResponse } from "next/server";

type SendMethod = "telegram" | "sms";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      phone?: string;
      method?: string;
    };
    const phone = String(body.phone ?? "").trim();
    const method = String(body.method ?? "").trim().toLowerCase() as SendMethod;

    if (!phone || phone.replace(/\D/g, "").length < 12) {
      return NextResponse.json(
        { success: false, error: "Укажите корректный номер телефона" },
        { status: 400 },
      );
    }

    if (method !== "telegram" && method !== "sms") {
      return NextResponse.json(
        { success: false, error: "Укажите method: telegram или sms" },
        { status: 400 },
      );
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));

    if (method === "sms") {
      // TODO: Интеграция API SMS шлюза
      console.log("SMS CODE:", code, "| phone:", phone);
    } else {
      // TODO: Интеграция Telegram Bot API
      console.log("TELEGRAM CODE:", code, "| phone:", phone);
    }

    return NextResponse.json({
      success: true,
      message:
        method === "telegram"
          ? "Код отправлен в Telegram"
          : "Код отправлен по SMS",
      method,
      expiresIn: 60,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Не удалось отправить код" },
      { status: 500 },
    );
  }
}
