import { cn } from "@/lib/utils";
import { LOGO_URL } from "@/lib/site";

/** Absolute URL so the logo always loads from rout.be, also in preview. */
const logoSrc = LOGO_URL;

interface RoutLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

/**
 * ROUT brand lockup — official rout.be badge mark + monospace wordmark.
 * The mark is the canonical colour logo (public/img/logo.png), mirrored from
 * https://rout.be/img/logo.png, so header, footer, favicon and social cards
 * all resolve to the same asset.
 */
export function RoutLogo({ className, size = 28, showWordmark = true }: RoutLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={logoSrc}
        alt="ROUT"
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        className="block shrink-0 rounded-full object-contain"
        style={{ width: size, height: size }}
      />
      {showWordmark && (
        <span
          className="font-brand text-foreground tracking-[0.18em] font-bold leading-none"
          style={{ fontSize: Math.round(size * 0.72) }}
        >
          ROUT
        </span>
      )}
    </span>
  );
}

export { logoSrc as routLogoSrc, logoSrc as routBunnySrc };
