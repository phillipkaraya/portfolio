"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger in ms, applied as a transition-delay once the element enters */
  delay?: number;
  className?: string;
  as?: ElementType;
};

/**
 * Reveals children once on first scroll into view.
 *
 * Drives the animation by touching classList directly rather than through
 * React state. Two reasons:
 *
 *  1. The server render carries NO reveal class, so the content is visible.
 *     Never hide content in CSS that only JS can bring back: if the bundle
 *     fails, the page must still be readable and indexable.
 *  2. It avoids a synchronous setState in an effect, and the cascading render
 *     that comes with it, for what is purely a visual effect.
 *
 * Safe because `className` here is static per mount, so React never re-renders
 * this element and never clobbers the classes we add. Anything below the fold
 * gets armed and animates in; anything already on screen is left alone so it
 * cannot flash. Reduced motion is handled entirely in globals.css.
 */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Already on screen at hydration: leave it visible, do not re-animate.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.classList.add("reveal");
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-in");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
