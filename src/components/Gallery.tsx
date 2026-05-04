import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Artwork } from "../types";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkDialog } from "./ArtworkDialog";
import { Button } from "../components/ui/button";

type Props = {
  section: string;
  categories: string[];
};

export const Gallery = ({ section, categories }: Props) => {
  const [items, setItems] = useState<Artwork[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("artworks")
      .select("*")
      .eq("section", section)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(300);
    setItems((data as Artwork[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [section]);

  const filtered = useMemo(
    () => (active ? items.filter((i) => i.category === active) : items),
    [items, active]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        <Button
          variant={active === null ? "default" : "outline"}
          size="sm"
          className="rounded-none uppercase tracking-wider text-xs"
          onClick={() => setActive(null)}
        >
          All
        </Button>
        {categories.map((c) => (
          <Button
            key={c}
            variant={active === c ? "default" : "outline"}
            size="sm"
            className="rounded-none uppercase tracking-wider text-xs"
            onClick={() => setActive(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-muted animate-pulse break-inside-avoid" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border">
          <p className="font-display text-2xl text-muted-foreground">Nothing here yet.</p>
          <p className="text-sm text-muted-foreground mt-2">New work is added regularly — please check back.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {filtered.map((a, i) => (
            <div key={a.id} className="break-inside-avoid">
              <ArtworkCard artwork={a} index={i} onClick={() => setOpen(a)} />
            </div>
          ))}
        </div>
      )}

      <ArtworkDialog artwork={open} onClose={() => setOpen(null)} onDeleted={load} />
    </div>
  );
};
