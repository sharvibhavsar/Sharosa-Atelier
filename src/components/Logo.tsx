import { Link } from "react-router-dom";
import { Wordmark } from "./Wordmark";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const cls = size === "lg" ? "text-6xl md:text-8xl" : size === "sm" ? "text-2xl" : "text-3xl md:text-4xl";
  return (
    <Link to="/" className="inline-block group">
      <Wordmark className={cls} />
    </Link>
  );
};
