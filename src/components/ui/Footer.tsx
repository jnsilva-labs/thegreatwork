import Link from "next/link";
import { SocialLinks } from "@/components/ui/SocialLinks";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/great-work", label: "The Great Work" },
  { href: "/tarot", label: "Tarot" },
  { href: "/astrology", label: "Astrology" },
  { href: "/gallery", label: "Sacred Geometry" },
  { href: "/principles", label: "Principles" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[color:var(--copper)]/40 bg-[color:var(--obsidian)]">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:px-20">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[color:var(--mist)]">
              <span className="h-px w-8 bg-[color:var(--copper)]" />
              Awareness Paradox
            </div>
            <FlowerOfLifeEmblem />
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            <div className="text-[0.65rem] sm:text-[0.55rem] uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Explore
            </div>
            <ul className="space-y-1">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 text-xs uppercase tracking-[0.3em] text-[color:var(--mist)] transition-colors hover:text-[color:var(--bone)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="space-y-3">
            <div className="text-[0.65rem] sm:text-[0.55rem] uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Connect
            </div>
            <SocialLinks variant="compact" />
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--copper)]/20 pt-6 text-center text-[0.55rem] uppercase tracking-[0.4em] text-[color:var(--mist)]">
          &copy; {new Date().getFullYear()} Awareness Paradox
        </div>
      </div>
    </footer>
  );
}

function FlowerOfLifeEmblem() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className="text-[color:var(--copper)] opacity-50"
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="6" />
      <circle cx="18" cy="12" r="6" />
      <circle cx="18" cy="24" r="6" />
      <circle cx="23.2" cy="15" r="6" />
      <circle cx="23.2" cy="21" r="6" />
      <circle cx="12.8" cy="15" r="6" />
      <circle cx="12.8" cy="21" r="6" />
    </svg>
  );
}
