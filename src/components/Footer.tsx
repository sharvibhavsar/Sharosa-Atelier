import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Wordmark } from "./Wordmark";

export const Footer = () => (
  <footer className="border-t border-border mt-24 bg-secondary/30">
    <div className="container py-12 grid gap-8 md:grid-cols-3">
      <div>
        <Logo />
        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
          A quiet studio of traditional art, paper craft and rangoli — handmade by Sharvi Bhavsar.
        </p>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Explore</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/traditional" className="hover:text-foreground/100 text-foreground/80">Traditional Art</Link></li>
          <li><Link to="/artwork" className="hover:text-foreground/100 text-foreground/80">Artwork</Link></li>
          <li><Link to="/crafts" className="hover:text-foreground/100 text-foreground/80">Crafts</Link></li>
          <li><Link to="/rangoli" className="hover:text-foreground/100 text-foreground/80">Rangoli</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Studio</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/about" className="hover:text-foreground/100 text-foreground/80">About</Link></li>
          <li><Link to="/contact" className="hover:text-foreground/100 text-foreground/80">Contact</Link></li>
          <li><a href="mailto:sharvibhavsar12@gmail.com" className="text-foreground/80 hover:text-foreground">sharvibhavsar12@gmail.com</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} <Wordmark className="text-xs" />. Each piece, made by hand.
    </div>
  </footer>
);
