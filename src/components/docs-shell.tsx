"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Code2, ExternalLink, Search, X } from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { docGroups, documentationNav, docIntroPanels, docToc } from "@/lib/docs-content";
import { site } from "@/lib/site";

export function DocsShell() {
  const [query, setQuery] = useState("");
  const [activeHref, setActiveHref] = useState("#docs-first-time");
  const normalisedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!normalisedQuery) {
      return docGroups;
    }

    return docGroups
      .map((group) => {
        const groupMatches = [group.title, group.body].some((value) =>
          value.toLowerCase().includes(normalisedQuery),
        );
        const cards = groupMatches
          ? group.cards
          : group.cards.filter((card) =>
              [card.title, card.body, card.code].some((value) =>
                value.toLowerCase().includes(normalisedQuery),
              ),
            );

        return { ...group, cards };
      })
      .filter((group) => group.cards.length > 0);
  }, [normalisedQuery]);

  const resultCount = filteredGroups.reduce((count, group) => count + group.cards.length, 0);

  useEffect(() => {
    const ids = docGroups.flatMap((group) => [group.id, ...group.cards.map((card) => card.id)]);

    function updateFromHash() {
      if (window.location.hash) {
        setActiveHref(window.location.hash);
      }
    }

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0.08, 0.32, 0.56] },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
    };
  }, []);

  function renderHighlighted(text: string): ReactNode {
    if (!normalisedQuery) {
      return text;
    }

    const lower = text.toLowerCase();
    const parts: ReactNode[] = [];
    let cursor = 0;
    let matchIndex = lower.indexOf(normalisedQuery);

    while (matchIndex !== -1) {
      if (matchIndex > cursor) {
        parts.push(text.slice(cursor, matchIndex));
      }
      const end = matchIndex + normalisedQuery.length;
      parts.push(
        <mark key={`${text}-${matchIndex}`} className="rounded bg-[#14213a] px-0.5 text-[#b7cfff]">
          {text.slice(matchIndex, end)}
        </mark>,
      );
      cursor = end;
      matchIndex = lower.indexOf(normalisedQuery, cursor);
    }

    if (cursor < text.length) {
      parts.push(text.slice(cursor));
    }

    return parts;
  }

  return (
    <section className="bg-[#071021] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-primary">Documentation</p>
          <h1 className="mt-4 text-4xl font-black leading-none sm:text-5xl">
            Deploy the gate, then prove every admitted build.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Start with a local gate, move the same policy into CI, then verify signed admission
            evidence before build or deployment steps are allowed to continue.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-[#0b1224] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border bg-[#081020] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary" aria-hidden="true" />
                {site.name} documentation
              </span>
              <label className="sr-only" htmlFor="docs-version">
                Documentation version
              </label>
              <select
                id="docs-version"
                defaultValue="stable"
                className="h-8 rounded-md border border-border bg-[#0b1224] px-2 text-xs text-muted-foreground"
              >
                <option value="stable">stable 0.3</option>
                <option value="next" disabled>
                  next
                </option>
              </select>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-80 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="docs-search">
                Search documentation
              </label>
              <div className="relative w-full">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="docs-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search documentation"
                  className="h-9 pl-9 pr-9 text-xs"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              {normalisedQuery ? (
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {resultCount} result{resultCount === 1 ? "" : "s"} for &quot;{query.trim()}&quot;
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 border-b border-border bg-[#081020] p-4 lg:hidden">
            {documentationNav.map((section) => (
              <div key={section.group}>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {section.group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-md border px-2.5 py-1.5 text-xs ${
                        activeHref === item.href
                          ? "border-[#30466f] bg-[#0b1428] text-[#b7cfff]"
                          : "border-border bg-[#0b1224] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_220px]">
            <aside className="hidden border-r border-border bg-[#081020] lg:block">
              <nav className="sticky top-20 grid gap-6 p-5 text-sm" aria-label="Documentation">
                {documentationNav.map((section) => (
                  <div key={section.group}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {section.group}
                    </p>
                    <div className="grid gap-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-md px-2 py-1.5 ${
                            activeHref === item.href
                              ? "bg-[#13213a] font-semibold text-[#b7cfff]"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>

            <article className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="size-3" aria-hidden="true" />
                <span>Docs</span>
                <ChevronRight className="size-3" aria-hidden="true" />
                <span>stable</span>
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                {site.name}: package admission simplified
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {site.name} is a self-hosted package firewall for teams that need enforceable
                approval evidence, not only vulnerability alerts.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="https://github.com/njlane314/palsy/edit/main/website/src/lib/docs-content.ts"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#30466f] bg-[#0b1428] px-3 py-2 text-[#b7cfff] hover:bg-[#172946]"
                >
                  Edit this page <ExternalLink className="size-3.5" aria-hidden="true" />
                </Link>
                {normalisedQuery ? (
                  <span className="text-xs text-muted-foreground">
                    Highlighting matches for &quot;{query.trim()}&quot;
                  </span>
                ) : null}
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {docIntroPanels.map((panel) => (
                  <div key={panel.title} className="rounded-lg border border-border border-t-4 border-t-[#30466f] bg-[#0b1428] p-4">
                    <h3 className="font-bold">{panel.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{panel.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-12">
                {filteredGroups.length ? (
                  filteredGroups.map((group) => (
                    <section key={group.id} id={group.id}>
                      <h3 className="text-2xl font-black tracking-tight">{renderHighlighted(group.title)}</h3>
                      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                        {renderHighlighted(group.body)}
                      </p>
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {group.cards.map((card) => (
                          <div
                            key={card.id}
                            id={card.id}
                            className="rounded-lg border border-border border-t-4 border-t-[#30466f] bg-[#0b1224] p-4 shadow-sm transition-shadow hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-md bg-[#06352f] text-primary">
                                <Code2 className="size-4" aria-hidden="true" />
                              </span>
                              <div>
                                <h4 className="font-bold">{renderHighlighted(card.title)}</h4>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                  {renderHighlighted(card.body)}
                                </p>
                              </div>
                            </div>
                            <CodeBlock code={card.code} />
                          </div>
                        ))}
                      </div>
                    </section>
                  ))
                ) : (
                  <div className="rounded-lg border border-border bg-[#0b1428] p-8 text-center">
                    <h3 className="text-xl font-black">No documentation results</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      Try terms like permit, GitHub Actions, API, policy, or quarantine.
                    </p>
                    <Button type="button" variant="outline" className="mt-5" onClick={() => setQuery("")}>
                      Clear search
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                <Link
                  href="#docs-first-time"
                  className="flex items-center gap-2 rounded-lg border border-border bg-[#081020] p-4 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Previous: First time here?
                </Link>
                <Link
                  href="#docs-reference"
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-[#081020] p-4 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Next: Reference
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>

            <aside className="hidden border-l border-border bg-[#081020] xl:block">
              <nav className="sticky top-20 p-5 text-sm" aria-label="On this page">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  On this page
                </p>
                <div className="grid gap-1">
                  {docToc.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-md px-2 py-1.5 ${
                        activeHref === item.href
                          ? "bg-[#13213a] font-semibold text-[#b7cfff]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
