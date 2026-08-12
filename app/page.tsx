import CleaningCalculator from "./components/CleaningCalculator";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden pb-32 lg:pb-14">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-5 sm:px-6 sm:pt-7">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-[15px] font-bold text-white shadow-md shadow-brand/30">
            C
          </span>
          <div className="leading-tight">
            <p className="font-[family-name:var(--font-unbounded)] text-[15px] font-semibold tracking-tight text-foreground sm:text-base">
              CleanPlatform
            </p>
            <p className="text-[11px] text-muted sm:text-xs">Клининг без сюрпризов</p>
          </div>
        </div>
        <a
          href="#calculator"
          className="rounded-full bg-panel px-3.5 py-2 text-xs font-semibold text-brand-deep shadow-md shadow-sky/40 transition hover:shadow-lg sm:px-4 sm:text-sm"
        >
          Рассчитать
        </a>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 sm:px-6 sm:pt-8">
        <section className="mb-7 animate-fade-up sm:mb-9">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Онлайн-расчёт
          </p>
          <h1 className="max-w-xl font-[family-name:var(--font-unbounded)] text-[1.65rem] font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
            Соберите идеальную уборку за минуту
          </h1>
          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Выберите тариф и опции — цена обновится сразу.
          </p>
        </section>

        <div id="calculator">
          <CleaningCalculator />
        </div>
      </main>

      <footer className="mx-auto mt-10 w-full max-w-5xl px-4 pb-4 text-xs text-muted sm:px-6 sm:text-sm">
        © {new Date().getFullYear()} CleanPlatform
      </footer>
    </div>
  );
}
