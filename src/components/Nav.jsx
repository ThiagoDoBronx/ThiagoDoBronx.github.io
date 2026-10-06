import { forwardRef } from 'react';
import { whatsappUrl } from '../lib/whatsapp';

const Nav = forwardRef(function Nav({ product }, progressRef) {
  const contact = whatsappUrl(product.whatsapp.number, product.whatsapp.contact);
  return (
    <>
      <nav className="label fixed top-0 z-50 flex w-full items-start justify-between p-6 text-ink md:p-10">
        <a href={contact} target="_blank" rel="noopener noreferrer" className="font-serif text-xl tracking-tight normal-case italic">
          {product.title}
        </a>
        <a href={contact} target="_blank" rel="noopener noreferrer" className="text-right leading-relaxed">
          {product.collection.split(' / ').map((part, i) => (
            <span key={i} className="block">
              {part}
            </span>
          ))}
        </a>
      </nav>
      <div className="label pointer-events-none fixed bottom-0 z-50 flex w-full items-end justify-between p-6 text-ink md:p-10">
        <span>
          {product.name} — {product.price}
        </span>
        <span>
          Scroll <span ref={progressRef}>000</span>
        </span>
      </div>
    </>
  );
});

export default Nav;
