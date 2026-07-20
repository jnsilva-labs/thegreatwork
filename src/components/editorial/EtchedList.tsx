import type { ReactNode } from "react";

export type EtchedListItem = {
  id?: string;
  title?: ReactNode;
  body: ReactNode;
  glyph?: ReactNode;
};

type EtchedListProps = {
  items: readonly EtchedListItem[];
  ordered?: boolean;
  marker?: "numeral" | "glyph";
  className?: string;
};

export function EtchedList({ items, ordered = false, marker = ordered ? "numeral" : "glyph", className }: EtchedListProps) {
  const List = ordered ? "ol" : "ul";

  return (
    <List className={`etched-list etched-list--${marker} ${className ?? ""}`}>
      {items.map((item, index) => (
        <li key={item.id ?? `${index}-${String(item.title ?? "item")}`} className="etched-list__item">
          <span className="etched-list__marker" aria-hidden="true">
            {marker === "numeral" ? toRoman(index + 1) : (item.glyph ?? "◇")}
          </span>
          <div>
            {item.title ? <h3 className="etched-list__title">{item.title}</h3> : null}
            <div className="etched-list__body">{item.body}</div>
          </div>
        </li>
      ))}
    </List>
  );
}

function toRoman(value: number) {
  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return numerals[value - 1] ?? String(value).padStart(2, "0");
}
