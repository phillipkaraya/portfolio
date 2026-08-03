import Link from "next/link";
import { Mail } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { NAV_LINKS } from "@/lib/nav";

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.74 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.2 1.18a11 11 0 0 1 5.82 0c2.23-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

/**
 * The mesh-gradient + grain backdrop used behind every dark hero.
 * Absolutely positioned, so the parent needs `relative` and `overflow-hidden`.
 */
export function Atmosphere({ intensity = 1 }: { intensity?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grain">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(58rem 30rem at 78% -14%, rgba(31,68,224,${0.34 * intensity}), transparent 62%),
            radial-gradient(34rem 24rem at 8% 4%, rgba(109,63,209,${0.24 * intensity}), transparent 60%),
            radial-gradient(30rem 18rem at 42% 108%, rgba(225,29,42,${0.16 * intensity}), transparent 60%)
          `,
        }}
      />
    </div>
  );
}

export function SiteHeader() {
  return (
    <nav className="relative z-40 flex items-center justify-between py-6">
      <Link href="/" className="font-display text-lg font-semibold tracking-tight text-white">
        Phillip Karaya
      </Link>
      <div className="hidden items-center gap-7 text-sm text-white/65 md:flex">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="transition hover:text-white">
            {l.label}
          </Link>
        ))}
      </div>
      <Link
        href="/#contact"
        className="hidden rounded-lg bg-royal px-4 py-2 text-sm font-medium text-white transition hover:bg-royal-dark md:inline-flex"
      >
        Book a call
      </Link>
      <MobileNav />
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-night text-white">
      <Atmosphere intensity={0.7} />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <h2 className="font-display max-w-[16ch] text-4xl leading-[1.03] font-semibold tracking-tight md:text-6xl">
          Let&rsquo;s build something that ships.
        </h2>
        <p className="mt-5 max-w-[48ch] text-white/60">
          Available for AI engineering roles and contract work. Atlanta, GA, working across US time
          zones.
        </p>
        <a
          href="mailto:pnkaraya@gmail.com"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-royal px-5 py-3 text-sm font-medium text-white transition hover:bg-royal-dark"
        >
          <Mail className="size-4" />
          pnkaraya@gmail.com
        </a>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row md:items-center">
          <span className="font-display font-semibold text-white/75">Phillip Karaya</span>
          <div className="flex gap-6">
            <a href="https://github.com/phillipkaraya" className="transition hover:text-white">
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/phillip-karaya"
              className="transition hover:text-white"
            >
              LinkedIn
            </a>
            <a href="https://instagram.com/phillip.karaya" className="transition hover:text-white">
              Instagram
            </a>
          </div>
          <span>© 2026 Phillip Karaya</span>
        </div>
      </div>
    </footer>
  );
}
