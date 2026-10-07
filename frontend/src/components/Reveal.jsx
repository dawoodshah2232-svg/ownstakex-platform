import { useEffect, useRef } from "react";

// Adds the theme's `.in` class when the element scrolls into view,
// driving the `.reveal` CSS animation from the design system.
export default function Reveal({ children, className = "", delay = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${delay} ${className}`.trim()}>
      {children}
    </div>
  );
}
