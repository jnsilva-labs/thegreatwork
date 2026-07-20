import type { ReactNode } from "react";

export type EditorialSpreadVariant = "image-left" | "image-right" | "quote" | "map";

type EditorialSpreadProps = {
  variant: EditorialSpreadVariant;
  title: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  media?: ReactNode;
  marginalia?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
};

export function EditorialSpread({
  variant,
  title,
  eyebrow,
  children,
  media,
  marginalia,
  headingLevel = 2,
  className,
}: EditorialSpreadProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <section className={`editorial-spread editorial-spread--${variant} ${className ?? ""}`}>
      <div className="editorial-spread__copy">
        {eyebrow ? <p className="type-eyebrow editorial-spread__eyebrow">{eyebrow}</p> : null}
        <Heading className="type-title font-ritual editorial-spread__title">{title}</Heading>
        <div className="type-body editorial-spread__body">{children}</div>
      </div>
      {media ? <div className="editorial-spread__media">{media}</div> : null}
      {marginalia ? <div className="editorial-spread__marginalia">{marginalia}</div> : null}
    </section>
  );
}
