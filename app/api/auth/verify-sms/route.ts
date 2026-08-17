import { NextResponse } from "next/server";

const TEST_CODE = "1234";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; code?: string };
    const phone = String(body.phone ?? "").trim();
    const code = String(body.code ?? "").trim();

    if (!phone || !code) {
      return NextResponse.json(
        { ok: false, error: "Телефон и код обязательны" },
        { status: 400 },
      );
    }

    if (code !== TEST_CODE) {
      return NextResponse.json(
        { ok: false, error: "Неверный код. Для теста используйте 1234" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      authorized: true,
      phone,
      message: "Авторизация успешна",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось проверить код" },
      { status: 500 },
    );
  }
}
