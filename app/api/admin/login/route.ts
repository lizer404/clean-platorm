import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_DEMO_LOGIN,
  ADMIN_DEMO_PASSWORD,
  createAdminSessionToken,
} from "@/app/lib/adminAuth";

export async function POST(request: NextRequest) {
  let body: { login?: string; password?: string };
  try {
    body = (await request.json()) as { login?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const login = (body.login ?? "").trim();
  const password = body.password ?? "";

  if (login !== ADMIN_DEMO_LOGIN || password !== ADMIN_DEMO_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Неверный логин или пароль" },
      { status: 401 },
    );
  }

  const token = createAdminSessionToken(login);
  const response = NextResponse.json({ ok: true, role: "ADMIN" });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
