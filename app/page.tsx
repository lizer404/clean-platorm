import CleaningCalculator from "./components/CleaningCalculator";
import HomeSections from "./components/HomeSections";
import SiteHeader from "./components/SiteHeader";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
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

      <footer className="border-t border-line/70 bg-panel/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
      </footer>
    </div>
  );
}
