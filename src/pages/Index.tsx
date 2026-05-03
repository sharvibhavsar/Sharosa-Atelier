import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import { Layout } from "../components/Layout";
import { Link } from "react-router-dom";

import { SECTIONS } from "../lib/categories";
import { Artwork } from "../types";
import { ArtworkCard } from "../components/ArtworkCard";
import { ArtworkDialog } from "../components/ArtworkDialog";
import { Wordmark } from "../components/Wordmark";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const [open, setOpen] = useState<Artwork | null>(null);

  useEffect(() => {
    supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const artworks = (data as Artwork[]) ?? [];
        
        const traditional = artworks.find(a => a.section === "traditional");
        const mandala = artworks.find(a => a.category === "Mandala Art");
        const creative = artworks.find(a => a.category === "Creative & Designer Art");
        const architectural = artworks.find(a => a.section === "architectural");
        const christmas = artworks.find(a => a.category?.includes("Christmas"));

        const featuredList = [traditional, mandala, creative, architectural, christmas]
          .filter((a): a is Artwork => a !== undefined)
          .filter((a, index, self) => index === self.findIndex((t) => t.id === a.id));

        setFeatured(featuredList);
      });
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div className="container relative py-28 md:py-44 animate-fade-in [--hero-fg:var(--foreground)]">
          <p className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: 'hsl(var(--hero-fg) / 0.75)' }}>
            An atelier of handmade things
          </p>
          <h1 className="font-display leading-[1.05] max-w-4xl">
            <Wordmark className="text-5xl md:text-7xl lg:text-8xl" />
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: 'hsl(var(--hero-fg) / 0.85)' }}>
            Pichhwai, mandala, paper gardens and upcycled crafts — a quiet
            collection of work made by hand, kept by heart, never sold.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/traditional"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm uppercase tracking-widest transition hover:opacity-90 bg-primary text-primary-foreground dark:bg-white dark:text-black"
            >
              View the work <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 px-7 py-3 border text-sm uppercase tracking-widest transition hover:bg-white/10" style={{ color: 'hsl(var(--hero-fg))', borderColor: 'hsl(var(--hero-fg) / 0.4)' }}>
              About the artist
            </Link>
          </div>
        </div>
      </section>

      {/* SECTIONS NAV STRIP */}
      <section className="container py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">The collections</p>
            <h2 className="font-display text-4xl md:text-5xl font-light">Six rooms in the atelier.</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {SECTIONS.map((s) => (
            <Link
              key={s.slug}
              to={`/${s.slug}`}
              className="group bg-background hover:bg-secondary/50 transition-colors p-8 md:p-10 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{s.shortLabel}</p>
                <h3 className="font-display text-3xl font-light leading-tight">{s.label}</h3>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground max-w-xs">{s.tagline}</p>
                <ArrowRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="container py-20 md:py-28 border-t border-border">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Featured Works</p>
              <h2 className="font-display text-4xl md:text-5xl font-light">From the studio.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featured.map((a, i) => (
              <ArtworkCard key={a.id} artwork={a} index={i} onClick={() => setOpen(a)} />
            ))}
          </div>
        </section>
      )}

      <ArtworkDialog artwork={open} onClose={() => setOpen(null)} />
    </Layout>
  );
};

export default Index;
