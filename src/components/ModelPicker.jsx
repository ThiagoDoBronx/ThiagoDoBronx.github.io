import { assetUrl } from './mockups/shared';

/**
 * Instagram-highlight style picker: round thumbnails of every mockup.
 * The active one gets a Google-coloured ring.
 */
export default function ModelPicker({ models, selected, onSelect }) {
  return (
    <nav
      data-no-spin
      aria-label="Escolha o modelo"
      className="pointer-events-auto flex gap-4 md:flex-col md:gap-6"
    >
      {models.map((m, i) => {
        const active = i === selected;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={active}
            className="group flex cursor-pointer flex-col items-center gap-2 focus:outline-none"
          >
            <span
              className={`rounded-full p-[2.5px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                active ? 'scale-105' : ''
              }`}
              style={{
                background: active
                  ? 'conic-gradient(from 200deg, #4285F4, #EA4335, #FBBC05, #34A853, #4285F4)'
                  : 'rgb(26 26 26 / 0.15)',
              }}
            >
              <span className="block rounded-full bg-paper p-[3px] group-focus-visible:ring-2 group-focus-visible:ring-ink">
                <span className="block h-14 w-14 overflow-hidden rounded-full bg-[#ecebe6] md:h-16 md:w-16">
                  <img
                    src={assetUrl(m.thumb)}
                    alt=""
                    draggable="false"
                    className="h-full w-full object-contain"
                  />
                </span>
              </span>
            </span>
            <span className={`label text-[9px] transition-opacity ${active ? 'opacity-100' : 'opacity-50'}`}>
              {m.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
