import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const TEST_CODE = "1234";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; code?: string };
    const phone = String(body.phone ?? "").trim();
    const code = String(body.code ?? "").trim();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Телефон и код обязательны" },
        { status: 400 },
      );
    }

    if (code !== TEST_CODE) {
      return NextResponse.json(
        { success: false, error: "Неверный код" },
        { status: 401 },
      );
    }

    const token = `cp_${randomUUID().replace(/-/g, "")}`;

    return NextResponse.json({
      success: true,
      authorized: true,
      token,
      phone,
      message: "Авторизация успешна",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Не удалось проверить код" },
      { status: 500 },
    );
  }
}
