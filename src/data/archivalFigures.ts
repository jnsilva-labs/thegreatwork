export type ArchivalFigureMetadata = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
  sourceHref?: string;
  width: number;
  height: number;
  aspect: number;
};

export const archivalFigures = {
  "splendor-solis-sun": {
    id: "splendor-solis-sun",
    src: "/ebook/hermetic-principles/p04-splendor-solis-sun-rising.jpg",
    alt: "Sun with human face rising over a city, from the Splendor Solis manuscript",
    caption: "Splendor Solis, BL Harley MS 3469 (1582), public domain",
    sourceLabel: "British Library",
    sourceHref: "https://www.bl.uk/manuscripts/FullDisplay.aspx?ref=Harley_MS_3469",
    width: 1390,
    height: 1994,
    aspect: 1390 / 1994,
  },
  "the-alchemist": {
    id: "the-alchemist",
    src: "/ebook/hermetic-principles/img-01-cover-the-alchemist-rijksmuseum.jpg",
    alt: "An alchemist working among vessels and instruments in a shadowed workshop",
    caption: "Thomas Wijck, The Alchemist, Rijksmuseum (public domain/CC0)",
    sourceLabel: "Wikimedia Commons",
    sourceHref: "https://commons.wikimedia.org/wiki/File:De_alchemist_Rijksmuseum_SK-A-489.jpeg",
    width: 4128,
    height: 4696,
    aspect: 4128 / 4696,
  },
  "alchemical-allegory": {
    id: "alchemical-allegory",
    src: "/ebook/hermetic-principles/img-03-m0007044-alchemical-allegory-wellcome.jpg",
    alt: "Alchemical allegory with a central tree and surrounding celestial symbols",
    caption: "Alchemical allegory, Wellcome Collection M0007044 (Public Domain Mark)",
    sourceLabel: "Wellcome Collection",
    sourceHref: "https://wellcomecollection.org/works/dux9fc95",
    width: 2600,
    height: 3631,
    aspect: 2600 / 3631,
  },
  "alchemical-manuscript": {
    id: "alchemical-manuscript",
    src: "/ebook/hermetic-principles/img-06-ms23-folio-9r-wellcome.jpg",
    alt: "A sixteenth-century alchemical manuscript page with vessels and process symbols",
    caption: "Alchemy: 16th cent., MS.23, page 9r, Wellcome Collection (Public Domain Mark)",
    sourceLabel: "Wellcome Collection",
    sourceHref:
      "https://preview.wellcomecollection.org/works/txyeduht/items?canvas=22&page=4&shouldScrollToCanvas=true",
    width: 2600,
    height: 3363,
    aspect: 2600 / 3363,
  },
} as const satisfies Record<string, ArchivalFigureMetadata>;

export type ArchivalFigureId = keyof typeof archivalFigures;

export function getArchivalFigure(id: ArchivalFigureId): ArchivalFigureMetadata {
  return archivalFigures[id];
}
