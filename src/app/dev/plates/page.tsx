import { GEOMETRY } from "@/data/geometryCatalog";
import { PlateSVG } from "@/components/PlateSVG";

export default function DevPlatesPage() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Dev Plates
          </p>
          <h1 className="font-ritual text-4xl">Plate Registry</h1>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GEOMETRY.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/50 p-4"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[color:var(--copper)]/30">
                <PlateSVG slug={item.slug} variant="thumbnail" className="h-full w-full" />
              </div>
              <div className="mt-3 space-y-1 text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]">
                <div>{item.title}</div>
                <div>{item.slug}</div>
                <div>generator: {item.generatorId}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
