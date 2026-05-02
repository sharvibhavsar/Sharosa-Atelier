/**
 * Brand wordmark — single source of truth for "Sharosa Atelier".
 * Always renders Sha + rosa + Atelier with consistent baseline,
 * matching font family, size and weight for "Sha" and "Atelier",
 * with "rosa" as the accent.
 */
export const Wordmark = ({ className = "" }: { className?: string }) => (
  <span className={`wordmark inline-flex items-baseline whitespace-nowrap leading-none ${className}`}>
    <span>Sha</span><span className="rosa">rosa</span>
    <span className="ml-[0.35em]">Atelier</span>
  </span>
);
