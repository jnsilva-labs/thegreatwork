export function HeroSigil() {
  return (
    <div className="hero-sigil-shell" aria-hidden="true">
      <div className="hero-sigil-glow" />
      <svg className="hero-sigil" viewBox="0 0 560 560" fill="none">
        <g className="hero-sigil__drift">
          <circle className="hero-sigil__halo" cx="280" cy="280" r="184" />
          <circle className="hero-sigil__halo hero-sigil__halo--inner" cx="280" cy="280" r="124" />
          <g className="hero-sigil__flower">
            <circle className="hero-sigil__ring" cx="280" cy="280" r="70" />
            <circle className="hero-sigil__ring" cx="280" cy="206" r="70" />
            <circle className="hero-sigil__ring" cx="344" cy="243" r="70" />
            <circle className="hero-sigil__ring" cx="344" cy="317" r="70" />
            <circle className="hero-sigil__ring" cx="280" cy="354" r="70" />
            <circle className="hero-sigil__ring" cx="216" cy="317" r="70" />
            <circle className="hero-sigil__ring" cx="216" cy="243" r="70" />
          </g>
          <g className="hero-sigil__orbit">
            <circle className="hero-sigil__node" cx="280" cy="96" r="6" />
            <circle className="hero-sigil__node" cx="427" cy="170" r="6" />
            <circle className="hero-sigil__node" cx="464" cy="318" r="6" />
            <circle className="hero-sigil__node" cx="391" cy="464" r="6" />
            <circle className="hero-sigil__node" cx="243" cy="501" r="6" />
            <circle className="hero-sigil__node" cx="96" cy="428" r="6" />
            <circle className="hero-sigil__node" cx="59" cy="280" r="6" />
            <circle className="hero-sigil__node" cx="132" cy="133" r="6" />
          </g>
        </g>
      </svg>
    </div>
  );
}
