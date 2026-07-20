import Image from "next/image";
import type { ArchivalFigureId } from "@/data/archivalFigures";
import { getArchivalFigure } from "@/data/archivalFigures";

type ArchivalFigureProps = {
  figureId: ArchivalFigureId;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function ArchivalFigure({
  figureId,
  className,
  imageClassName,
  sizes = "(max-width: 767px) 100vw, 50vw",
  priority = false,
}: ArchivalFigureProps) {
  const figure = getArchivalFigure(figureId);

  return (
    <figure className={`archival-figure ${className ?? ""}`}>
      <div className="archival-figure__image" style={{ aspectRatio: figure.aspect }}>
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          sizes={sizes}
          priority={priority}
          className={imageClassName ?? ""}
        />
      </div>
      <figcaption className="plate-caption">
        <span>{figure.caption}</span>
        {figure.sourceHref ? (
          <a href={figure.sourceHref} target="_blank" rel="noopener noreferrer">
            {figure.sourceLabel} source
          </a>
        ) : (
          <span>{figure.sourceLabel}</span>
        )}
      </figcaption>
    </figure>
  );
}
