import CleaningCalculator from "./components/CleaningCalculator";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 pt-5 sm:max-w-lg sm:pt-7">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white shadow-sm">
            C
          </span>
          <p className="font-[family-name:var(--font-unbounded)] text-sm font-semibold tracking-tight text-foreground">
            CleanPlatform
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-10 pt-5 sm:max-w-lg sm:px-5 sm:pt-7">
        <div id="calculator" className="animate-fade-up">
          <CleaningCalculator />
        </div>
      </main>
    </div>
  );
}
