import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";
import { Atmosphere, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { counts } from "@/lib/projects";

export const metadata: Metadata = {
  title: "All work",
  description: `${counts.total} shipped projects: ${counts.systems} systems built and operated in-house, ${counts.platforms} multi-app platforms, and ${counts.builds} live client builds.`,
};

export default function WorkPage() {
  return (
    <div>
      <header className="bg-night relative overflow-hidden text-white">
        <Atmosphere intensity={0.85} />
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <SiteHeader />
          <div className="py-16 md:py-24">
            <p className="text-royal-light font-mono text-xs tracking-[0.2em] uppercase">
              Everything, in one place
            </p>
            <h1 className="font-display mt-5 max-w-[18ch] text-4xl leading-[1.04] font-semibold tracking-tight md:text-6xl">
              {counts.total} projects, built and shipped.
            </h1>
            <p className="mt-5 max-w-[58ch] text-white/60">
              {counts.systems} systems I built and operate myself, {counts.platforms} multi-app
              platforms delivered end to end, and {counts.builds} live client sites and tools. Filter
              by what you came to see.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
        <WorkGrid />
      </main>

      <SiteFooter />
    </div>
  );
}
