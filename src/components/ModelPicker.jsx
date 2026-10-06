import { assetUrl } from './mockups/shared';

/**
 * Instagram-highlight style picker: a column of round thumbnails of the
 * mockups that are *not* on stage. Clicking one swaps it with the main
 * mockup (the 3D flight is drawn by Protagonist; the circle goes see-through
 * meanwhile so the model is visible flying in and out of it).
 */
export default function ModelPicker({ models, flyingSlot, onSelect }) {
  return (
    <nav data-no-spin aria-label="Escolha o modelo" className="pointer-events-auto flex flex-col gap-4 md:gap-5">
      {models.map((m, i) => {
        const flying = i === flyingSlot;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Ver modelo ${m.label}`}
            onClick={(e) => onSelect(i, e.currentTarget.querySelector('[data-circle]').getBoundingClientRect())}
            className="group block cursor-pointer rounded-full focus:outline-none"
          >
            <span
              className="block rounded-full p-[2px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-ink"
              style={{ background: 'conic-gradient(from 200deg, #4285F4, #EA4335, #FBBC05, #34A853, #4285F4)' }}
            >
              <span className="block rounded-full bg-paper p-[3px]">
                <span
                  data-circle
                  className={`block h-12 w-12 overflow-hidden rounded-full transition-colors duration-300 md:h-16 md:w-16 ${
                    flying ? 'bg-transparent' : 'bg-[#ecebe6]'
                  }`}
                >
                  <img
                    src={assetUrl(m.thumb)}
                    alt=""
                    draggable="false"
                    className={`h-full w-full object-contain transition-opacity duration-300 ${flying ? 'opacity-0' : 'opacity-100'}`}
                  />
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
