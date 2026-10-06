const pad = (n) => String(n).padStart(2, '0');

export function Hero({ hero }) {
  const [first, ...rest] = hero.headline;
  return (
    <section id="top" data-section className="relative flex h-svh items-end px-[8vw] pb-[14vh] md:items-center md:pb-0">
      <div className="relative z-20">
        <h1 className="font-serif text-[12.5vw] leading-[0.85] font-normal italic md:text-[10vw]">
          <span className="line">
            <span data-hero>{first}</span>
          </span>
          {rest.map((word) => (
            <span key={word} className="line pl-[4vw] md:pl-[8vw]">
              <span data-hero>
                {word}
              </span>
            </span>
          ))}
        </h1>
        <p data-hero-fade className="label mt-6 max-w-xs leading-loose md:mt-10 opacity-50">
          {hero.tagline}
        </p>
      </div>
    </section>
  );
}

export function StorySection({ section, index }) {
  const right = section.align === 'right';
  return (
    <section
      data-section
      className={`relative flex h-svh items-end px-[8vw] pb-[14vh] md:items-center md:pb-0 ${right ? 'justify-end' : 'justify-start'}`}
    >
      {/* Depth layer: oversized numeral sits *behind* the 3D object. */}
      <span
        data-parallax
        aria-hidden="true"
        className={`pointer-events-none absolute top-[12%] z-0 font-serif text-[38vw] leading-none italic opacity-[0.06] select-none md:text-[26vw] ${
          right ? 'left-[4vw]' : 'right-[4vw]'
        }`}
      >
        {pad(index + 1)}
      </span>

      <div className={`relative z-20 max-w-md ${right ? 'text-right' : 'text-left'}`}>
        <span data-reveal className="label block opacity-40">
          {section.label}
        </span>
        <h2 className="my-4 font-serif text-4xl md:my-6 md:text-7xl leading-[0.95] italic">
          <span className="line">
            <span data-reveal-line>{section.title}</span>
          </span>
        </h2>
        <p data-reveal className="text-sm leading-relaxed opacity-70">
          {section.body}
        </p>
      </div>
    </section>
  );
}

export function Finale({ product, index }) {
  return (
    <section data-section className="relative flex h-svh items-end px-[8vw] pt-[8vw] pb-[14vh] md:pb-[8vw]">
      <div className="relative z-20 flex w-full flex-col gap-10 border-t border-ink/10 pt-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div data-reveal className="text-7xl font-thin opacity-10 md:text-8xl">
            {pad(index)}
          </div>
          <p data-reveal className="label mt-6 opacity-50">
            {product.brand} — {product.name}
          </p>
          <p data-reveal className="mt-2 font-serif text-4xl italic">
            {product.price}
          </p>
        </div>
        <div data-reveal className="flex flex-col items-start gap-4 md:items-end">
          <button
            type="button"
            className="group relative cursor-pointer overflow-hidden rounded-full border border-ink px-12 py-5 transition-colors duration-500 hover:text-paper"
          >
            <span className="label relative z-10 font-semibold">{product.cta.label}</span>
            <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
          </button>
          <span className="label opacity-40">{product.cta.note}</span>
        </div>
      </div>
    </section>
  );
}
