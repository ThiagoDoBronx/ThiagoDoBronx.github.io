import { forwardRef } from 'react';

const Nav = forwardRef(function Nav({ product }, progressRef) {
  return (
    <>
      <nav className="label fixed top-0 z-50 flex w-full items-start justify-between p-6 text-white mix-blend-difference md:p-10">
        <a href="#top" className="font-serif text-xl tracking-tight normal-case italic">
          {product.title}
        </a>
        <div className="text-right leading-relaxed">
          {product.collection.split(' / ').map((part, i) => (
            <span key={i} className="block">
              {part}
            </span>
          ))}
        </div>
      </nav>
      <div className="label pointer-events-none fixed bottom-0 z-50 flex w-full items-end justify-between p-6 text-white mix-blend-difference md:p-10">
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
