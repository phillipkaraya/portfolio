"use client";

import { useMemo, useState } from "react";
import { BuildCard, DeepCard } from "@/components/project-cards";
import { builds, categories, platforms, systems } from "@/lib/projects";

type Filter = "All" | "Systems" | "Platforms" | (typeof categories)[number];

const FILTERS: Filter[] = ["All", "Systems", "Platforms", ...categories];

export function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("All");

  const { shownSystems, shownPlatforms, shownBuilds } = useMemo(() => {
    if (filter === "All") {
      return { shownSystems: systems, shownPlatforms: platforms, shownBuilds: builds };
    }
    if (filter === "Systems") {
      return { shownSystems: systems, shownPlatforms: [], shownBuilds: [] };
    }
    if (filter === "Platforms") {
      return { shownSystems: [], shownPlatforms: platforms, shownBuilds: [] };
    }
    // Category filters only apply to client builds; systems and platforms are
    // deliberately uncategorised because they span industries.
    return {
      shownSystems: [],
      shownPlatforms: [],
      shownBuilds: builds.filter((b) => b.category === filter),
    };
  }, [filter]);

  const total = shownSystems.length + shownPlatforms.length + shownBuilds.length;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 font-mono text-xs transition ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-line text-muted hover:border-ink/40 hover:text-ink"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <p className="text-muted mt-5 font-mono text-xs" aria-live="polite">
        {total} {total === 1 ? "project" : "projects"}
      </p>

      {shownSystems.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Systems I built and run
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {shownSystems.map((p) => (
              <DeepCard key={p.slug} project={p} showImage={false} />
            ))}
          </div>
        </section>
      )}

      {shownPlatforms.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Platforms shipped end to end
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {shownPlatforms.map((p) => (
              <DeepCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      {shownBuilds.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Live client builds</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shownBuilds.map((b) => (
              <BuildCard key={b.name} build={b} />
            ))}
          </div>
        </section>
      )}

      {total === 0 && (
        <p className="text-muted mt-12 text-sm">Nothing in this category yet.</p>
      )}
    </div>
  );
}
