import CleaningCalculator from "./components/CleaningCalculator";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col pb-28 lg:pb-12">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pb-2 pt-6 sm:px-6 sm:pt-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white shadow-[0_10px_24px_rgba(26,140,255,0.35)]">
            C
          </span>
          <div>
            <p className="font-[family-name:var(--font-unbounded)] text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              CleanPlatform
            </p>
            <p className="text-xs text-muted sm:text-sm">Клининг без сюрпризов</p>
          </div>
        </div>
        <a
          href="#calculator"
          className="hidden rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-brand-deep transition hover:border-brand/40 sm:inline-flex"
        >
          Рассчитать цену
        </a>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 sm:px-6 sm:pt-8">
        <section className="mb-10 max-w-3xl animate-fade-up">
          <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            CleanPlatform
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            Современный калькулятор уборки: выберите тариф, комнаты и опции —
            узнайте точную стоимость за пару кликов.
          </p>
        </section>

        <div id="calculator">
          <CleaningCalculator />
        </div>
      </main>

      <footer className="mx-auto mt-12 w-full max-w-6xl px-4 pb-6 text-sm text-muted sm:px-6">
        © {new Date().getFullYear()} CleanPlatform. Демонстрационный расчёт стоимости.
      </footer>
    </div>
  );
}
