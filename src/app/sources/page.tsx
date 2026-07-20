import { ArchivalFigure, EditorialSpread, RitualLink } from "@/components/editorial";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Sources",
  path: "/sources",
  description: "Primary texts, museum collections, and image provenance used by Awareness Paradox.",
});

export default function SourcesPage() {
  return (
    <div className="min-h-screen px-6 py-16 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl space-y-5 pb-12">
          <p className="type-eyebrow text-[color:var(--gilt)]">Provenance</p>
          <h1 className="type-display font-ritual">Sources</h1>
          <p className="type-body prose-measure text-[color:var(--mist)]">
            The archive favors primary texts, named translations, and collection records from libraries and museums. Interpretive synthesis is marked as interpretation.
          </p>
        </header>

        <EditorialSpread
          variant="image-left"
          eyebrow="Manuscript witness"
          title="Images keep their provenance"
          media={<ArchivalFigure figureId="splendor-solis-sun" sizes="(max-width: 767px) 100vw, 44vw" />}
        >
          <p>
            Plates identify their work, collection, and source page. Core textual reference points include the <cite>Corpus Hermeticum</cite>, the <cite>Emerald Tablet</cite>, alchemical emblem books, and later Hermetic commentary presented in its historical period.
          </p>
        </EditorialSpread>

        <EditorialSpread
          variant="image-right"
          eyebrow="Collection record"
          title="Public collections remain one click away"
          media={<ArchivalFigure figureId="alchemical-allegory" sizes="(max-width: 767px) 100vw, 44vw" />}
        >
          <p>
            The British Library, Wellcome Collection, Rijksmuseum, and Wikimedia Commons records used here remain linked in visible captions so readers can inspect the source context directly.
          </p>
        </EditorialSpread>

        <div className="mt-10 flex flex-wrap gap-4">
          <RitualLink href="/method" location="sources" label="Read the Method">Read the Method</RitualLink>
          <RitualLink href="/privacy" location="sources" label="Privacy" tone="quiet">Privacy</RitualLink>
        </div>
      </div>
    </div>
  );
}
