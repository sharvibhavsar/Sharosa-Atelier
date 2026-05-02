import { NavLink, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  Sheet, SheetContent, SheetTrigger,
} from "../components/ui/sheet";

const links = [
  { to: "/", label: "Home", end: true, key: "home" },
  { to: "/traditional", label: "Traditional Art", key: "traditional" },
  { to: "/artwork", label: "Artwork", key: "artwork" },
  { to: "/crafts", label: "Crafts", key: "crafts" },
  { to: "/architectural", label: "Architectural", key: "architectural" },
  { to: "/rangoli", label: "Rangoli", key: "rangoli" },
  { to: "/about", label: "About", key: "about" },
  { to: "/contact", label: "Contact", key: "contact" },
];

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container flex items-center justify-between gap-4 h-16 md:h-20">
        <Logo />

        <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-nowrap">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-link={l.key}
              className={({ isActive }) => `nav-link whitespace-nowrap ${isActive ? "active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 flex-nowrap">
          {user ? (
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex whitespace-nowrap">
              <Link to="/feedback">Feedback</Link>
            </Button>
          )}
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `mobile-nav-link py-3 px-2 text-sm uppercase tracking-wider border-b border-border ${
                        isActive ? "active text-foreground" : "text-foreground/60"
                      }`
                    }
                  >
                    <span className="mobile-nav-label">{l.label}</span>
                  </NavLink>
                ))}
                {!user && (
                  <Link to="/feedback" onClick={() => setOpen(false)} className="py-3 px-2 text-sm uppercase tracking-wider">
                    Feedback
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
