import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { SECTIONS } from "../lib/categories";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { Trash2, Upload, Pencil, X } from "lucide-react";
import { Artwork } from "../types";

const Admin = () => {
  const { isAdmin, loading, user } = useAuth();
  const [items, setItems] = useState<Artwork[]>([]);
  const [section, setSection] = useState(SECTIONS[0].slug);
  const [category, setCategory] = useState(SECTIONS[0].categories[0]);
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [artworksLimit, setArtworksLimit] = useState(50);
  const [feedbacksLimit, setFeedbacksLimit] = useState(50);

  const sectionObj = SECTIONS.find((s) => s.slug === section)!;
  const isEditing = editingId !== null;

  const load = async () => {
    const { data } = await supabase.from("artworks").select("*").order("created_at", { ascending: false }).limit(artworksLimit);
    setItems((data as Artwork[]) ?? []);
    
    const { data: fData } = await supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(feedbacksLimit);
    setFeedbacks(fData ?? []);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin, artworksLimit, feedbacksLimit]);

  useEffect(() => {
    if (!isEditing) setCategory(sectionObj.categories[0]);
  }, [section]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm uppercase tracking-widest">Loading…</div>;
  if (!isAdmin) {
    window.location.href = "/auth";
    return null;
  }

  const resetForm = () => {
    setEditingId(null);
    setExistingImageUrl("");
    setTitle("");
    setShortDesc("");
    setFullDesc("");
    setDuration("");
    setFile(null);
    setSection(SECTIONS[0].slug);
    setCategory(SECTIONS[0].categories[0]);
    const el = document.getElementById("artfile") as HTMLInputElement | null;
    if (el) el.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (a: Artwork) => {
    setEditingId(a.id);
    setExistingImageUrl(a.image_url);
    setTitle(a.title);
    setShortDesc(a.short_description);
    setFullDesc(a.full_description ?? "");
    setDuration(a.duration ?? "");
    setSection(a.section);
    setCategory(a.category ?? SECTIONS.find((s) => s.slug === a.section)?.categories[0] ?? "");
    setFile(null);
    const el = document.getElementById("artfile") as HTMLInputElement | null;
    if (el) el.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = existingImageUrl;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${section}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("artworks").upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("artworks").getPublicUrl(path);
        imageUrl = publicUrl;

        // If editing and image changed, remove the old one
        if (isEditing && existingImageUrl) {
          try {
            const url = new URL(existingImageUrl);
            const idx = url.pathname.indexOf("/artworks/");
            if (idx >= 0) {
              const oldPath = url.pathname.slice(idx + "/artworks/".length);
              await supabase.storage.from("artworks").remove([oldPath]);
            }
          } catch { /* ignore */ }
        }
      }

      if (!imageUrl) {
        toast.error("Please choose an image.");
        setUploading(false);
        return;
      }

      if (isEditing) {
        const { error } = await supabase
          .from("artworks")
          .update({
            title, short_description: shortDesc, full_description: fullDesc, duration: duration || null,
            section, category, image_url: imageUrl,
          })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Piece updated.");
      } else {
        const { error } = await supabase.from("artworks").insert({
          title, short_description: shortDesc, full_description: fullDesc, duration: duration || null,
          section, category, image_url: imageUrl,
        });
        if (error) throw error;
        toast.success("Added to the atelier.");
      }

      resetForm();
      load();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Save failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (a: Artwork) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try {
      const url = new URL(a.image_url);
      const idx = url.pathname.indexOf("/artworks/");
      if (idx >= 0) {
        const path = url.pathname.slice(idx + "/artworks/".length);
        await supabase.storage.from("artworks").remove([path]);
      }
    } catch { /* ignore */ }
    const { error } = await supabase.from("artworks").delete().eq("id", a.id);
    if (error) toast.error(error.message);
    else {
      if (editingId === a.id) resetForm();
      toast.success("Removed.");
      load();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-xl font-medium tracking-wide">Sharosa Admin</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">Dashboard</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/"} className="text-xs uppercase tracking-widest rounded-none h-8">
              View Website
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {
              localStorage.removeItem('adminAuth');
              window.location.href = "/auth";
            }} className="text-xs uppercase tracking-widest rounded-none h-8 text-muted-foreground">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <section className="container py-12 md:py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <h2 className="font-display text-3xl font-light">
            {isEditing ? "Edit Artwork" : "Upload New Artwork"}
          </h2>
          {isEditing && (
            <Button type="button" variant="ghost" onClick={resetForm} className="rounded-none uppercase tracking-widest text-xs">
              <X className="h-4 w-4 mr-1" /> Cancel edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 max-w-5xl">
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-widest">Section</Label>
              <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full mt-1.5 h-10 bg-background border border-input px-3 text-sm">
                {SECTIONS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1.5 h-10 bg-background border border-input px-3 text-sm">
                {sectionObj.categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">Title</Label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="rounded-none mt-1.5" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">Short description (one line)</Label>
              <Input required value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} maxLength={160} className="rounded-none mt-1.5" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">Duration of making</Label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 weeks, 15 hours" maxLength={100} className="rounded-none mt-1.5" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">Full description</Label>
              <Textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} rows={5} maxLength={2000} className="rounded-none mt-1.5" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest">
                Image {isEditing && <span className="text-muted-foreground normal-case tracking-normal">(leave empty to keep current)</span>}
              </Label>
              <Input
                id="artfile"
                type="file"
                accept="image/*"
                required={!isEditing}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="rounded-none mt-1.5"
              />
            </div>
            <Button type="submit" disabled={uploading} className="rounded-none uppercase tracking-widest text-xs h-12 px-8">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Saving…" : isEditing ? "Save changes" : "Publish"}
            </Button>
          </div>

          {(file || existingImageUrl) && (
            <div className="border border-border p-4 h-fit">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {file ? "New preview" : "Current image"}
              </p>
              <img
                src={file ? URL.createObjectURL(file) : existingImageUrl}
                alt="preview"
                className="w-full h-auto"
              />
            </div>
          )}
        </form>

        <div className="mt-16 md:mt-20 border-t border-border pt-10 md:pt-12">
          <h2 className="font-display text-2xl md:text-3xl font-light mb-6 md:mb-8">All pieces ({items.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {items.map((a) => (
              <div key={a.id} className={`relative group border bg-muted ${editingId === a.id ? "border-rosa" : "border-border"}`}>
                <img src={a.image_url} alt={a.title} loading="lazy" decoding="async" className="w-full aspect-square object-contain" />
                <div className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition flex flex-col items-center justify-center p-3 text-center gap-2">
                  <p className="text-xs font-medium line-clamp-2">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{a.category}</p>
                  <div className="flex gap-1.5 mt-1">
                    <Button size="sm" variant="outline" onClick={() => startEdit(a)} className="rounded-none h-8 px-2">
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(a)} className="rounded-none h-8 px-2">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {editingId === a.id && (
                  <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest bg-rosa text-rosa-foreground px-2 py-0.5">
                    editing
                  </span>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground py-12 text-center">
                No pieces yet. Add your first work above.
              </p>
            )}
          </div>
          {items.length >= artworksLimit && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => setArtworksLimit((l) => l + 50)} className="rounded-none uppercase tracking-widest text-xs h-10 px-8">
                Load More Artworks
              </Button>
            </div>
          )}
        </div>

        <div className="mt-16 md:mt-20 border-t border-border pt-10 md:pt-12">
          <h2 className="font-display text-2xl md:text-3xl font-light mb-6 md:mb-8">User Feedbacks ({feedbacks.length})</h2>
          {feedbacks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No feedbacks received yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((f) => (
                <div key={f.id} className="bg-card border border-border p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-start border-b border-border pb-3">
                    <div>
                      <p className="font-medium text-sm">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.email}</p>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                      {f.type}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 italic">"{f.message}"</p>
                  {f.fav_artwork && (
                    <p className="text-xs mt-2"><span className="text-muted-foreground">Fav Artwork:</span> {f.fav_artwork}</p>
                  )}
                  {f.artwork_id && (
                    <p className="text-[10px] text-muted-foreground mt-auto pt-4 border-t border-border">
                      Artwork ID: {f.artwork_id}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(f.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          {feedbacks.length >= feedbacksLimit && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => setFeedbacksLimit((l) => l + 50)} className="rounded-none uppercase tracking-widest text-xs h-10 px-8">
                Load More Feedbacks
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admin;
