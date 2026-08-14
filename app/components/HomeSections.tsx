const STEPS = [
  {
    title: "Опишите заказ",
    text: "Выберите тип уборки, комнаты, площадь и доп. услуги в калькуляторе.",
    note: "",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Сравните клинеров",
    text: "Смотрите цены, рейтинг и ближайшие даты — выбирайте удобный вариант.",
    note: "",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="9" cy="9" r="3.5" />
        <circle cx="15" cy="15" r="3.5" />
        <path d="M7 14.5 14.5 7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Подтвердите визит: оплатите",
    text: "Укажите адрес, подтвердите время и оплатите заказ — средства заморозятся до завершения.",
    note: "",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
        <path d="M2.5 10h19M7 14h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Ждите уборку",
    text: "Клинер приедет в выбранное время с нужным инвентарём и выполнит заказ.",
    note: "",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Оцените результат",
    text: "Оставьте отзыв клинеру — рейтинг честный и двухсторонний.",
    note: "Время для отзыва ограничено — 2 часа после завершения уборки",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="m12 3 2.4 5.4 5.9.5-4.5 3.9 1.4 5.7L12 15.8 6.8 18.5l1.4-5.7L3.7 8.9l5.9-.5L12 3Z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const GUARANTEES = [
  {
    title: "Проверенные исполнители",
    text: "Каждый клинер проходит модерацию профиля и подтверждение контактов.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3 5 6.5v5.2c0 4.2 2.9 7.9 7 8.8 4.1-.9 7-4.6 7-8.8V6.5L12 3Z" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Финансовая безопасность",
    text: "Оплата замораживается на безопасном счёте. Если что-то пойдёт не так — деньги гарантированно вернутся клиенту.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="7" width="18" height="12" rx="2.5" />
        <path d="M3 11h18M8 15h3" strokeLinecap="round" />
        <path d="M12 7V5.5A2.5 2.5 0 0 0 9.5 3h0A2.5 2.5 0 0 0 7 5.5V7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Безопасные данные",
    text: "Телефон и адрес используются только для выполнения заказа.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="5" y="10" width="14" height="10" rx="2.5" />
        <path d="M8 10V7.5a4 4 0 0 1 8 0V10" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const REVIEWS = [
  {
    name: "Марина С.",
    rating: 5.0,
    text: "Заказала генеральную уборку — клинер приехал вовремя, всё блестело. Удобно сравнивать цены.",
    cleaner: "Елена Мороз",
  },
  {
    name: "Игорь П.",
    rating: 4.9,
    text: "Нравится, что видно рейтинг и отзывы. После поддерживающей квартиры стало заметно чище.",
    cleaner: "Дмитрий Орлов",
  },
  {
    name: "Алина К.",
    rating: 5.0,
    text: "Двухсторонний рейтинг реально работает — и мне приятно, и клинеру спокойнее.",
    cleaner: "Анна Ковалёва",
  },
];

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{text}</p>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Оценка ${value}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${index < Math.round(value) ? "fill-amber-400" : "fill-line"}`}
        >
          <path d="M10 1.5 12.7 7l6 .5-4.6 4 1.4 5.8L10 14.8 4.5 17.3l1.4-5.8L1.3 7.5l6-.5L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomeSections() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section id="how-it-works" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Процесс"
          title="Как это работает"
          text="От заявки до оценки результата — прозрачный сценарий заказа."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <article
              key={step.title}
              className="rounded-3xl bg-panel p-5 shadow-[0_14px_36px_rgba(17,24,39,0.06)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  {step.icon}
                </span>
                <span className="font-[family-name:var(--font-unbounded)] text-sm font-semibold text-muted">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              {step.note ? (
                <p className="mt-3 text-xs leading-relaxed text-muted/90">{step.note}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section id="guarantees" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Безопасность"
          title="Гарантии и безопасность"
          text="Мы следим за стандартами сервиса, чтобы заказ был спокойным для обеих сторон."
        />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {GUARANTEES.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl bg-panel p-5 shadow-[0_14px_36px_rgba(17,24,39,0.06)] sm:p-6"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-soft text-success">
                {item.icon}
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reviews" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Доверие"
          title="Отзывы и рейтинг"
          text="Клиенты оценивают клинеров — и клинеры оценивают клиентов. Честно и прозрачно."
        />

        <div className="mt-8 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-panel p-5 shadow-[0_14px_36px_rgba(17,24,39,0.06)] sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Средний рейтинг клинеров
            </p>
            <div className="mt-3 flex items-end gap-3">
              <p className="font-[family-name:var(--font-unbounded)] text-5xl font-semibold leading-none text-foreground">
                4.9
              </p>
              <div className="pb-1">
                <Stars value={5} />
                <p className="mt-1 text-xs text-muted">на основе 1 240 отзывов</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-plaque p-4">
              <p className="text-sm font-semibold text-foreground">Двухсторонний рейтинг</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                После заказа клиент ставит оценку клинеру, а клинер — клиенту. Так на
                платформе остаются вежливые и надёжные люди с обеих сторон.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {REVIEWS.map((review) => (
              <article
                key={review.name}
                className="rounded-3xl bg-panel p-5 shadow-[0_14px_36px_rgba(17,24,39,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="mt-0.5 text-xs text-muted">Клинер: {review.cleaner}</p>
                  </div>
                  <div className="text-right">
                    <Stars value={review.rating} />
                    <p className="mt-1 text-xs font-semibold text-foreground">
                      {review.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
