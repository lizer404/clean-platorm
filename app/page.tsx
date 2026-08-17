import { AuthProvider } from "./components/AuthProvider";
import CleaningCalculator from "./components/CleaningCalculator";
import HomeSections from "./components/HomeSections";
import SiteHeader from "./components/SiteHeader";

export default function Home() {
  return (
    <AuthProvider>
      <div className="relative flex min-h-full flex-1 flex-col">
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-x-hidden px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
          <section className="mb-8 max-w-xl animate-fade-up sm:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Онлайн-расчёт
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-unbounded)] text-[1.7rem] font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              Найдите клинера под ваши параметры
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-base">
              Соберите заказ в калькуляторе и сравните предложения проверенных исполнителей.
            </p>
          </section>

          <div id="calculator" className="mx-auto w-full max-w-md animate-fade-up sm:max-w-lg">
            <CleaningCalculator />
          </div>

          <div className="mt-16 sm:mt-20">
            <HomeSections />
          </div>
        </main>

        <footer className="mt-auto border-t border-line/70 bg-panel">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Документы
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a
                      href="#offer"
                      className="font-medium text-foreground transition hover:text-brand"
                    >
                      Публичная оферта
                    </a>
                  </li>
                  <li>
                    <a
                      href="#privacy"
                      className="font-medium text-foreground transition hover:text-brand"
                    >
                      Политика конфиденциальности
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Поддержка
                </p>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  <li>
                    Почта:{" "}
                    <a
                      href="mailto:feedback@cleanplatform.by"
                      className="font-medium hover:text-brand"
                    >
                      feedback@cleanplatform.by
                    </a>
                  </li>
                  <li>
                    Telegram:{" "}
                    <a
                      href="https://t.me/cleanplatform_support"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:text-brand"
                    >
                      @cleanplatform_support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Юридическая информация
                </p>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  <li>Реквизиты ИП: ИП Иванов И.И.</li>
                  <li>УНП: 123456789</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 border-t border-line/70 pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} CleanPlatform</p>
              <div className="flex flex-wrap gap-4">
                <a href="#how-it-works" className="hover:text-foreground">
                  Как это работает
                </a>
                <a href="#reviews" className="hover:text-foreground">
                  Отзывы
                </a>
                <a href="#guarantees" className="hover:text-foreground">
                  Гарантии
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
