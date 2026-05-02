import { useState, useEffect } from "react";
import { Artwork } from "../types";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

type Props = {
  artwork: Artwork | null;
  onClose: () => void;
  onDeleted?: () => void;
};

export const ArtworkDialog = ({ artwork, onClose, onDeleted }: Props) => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (artwork) {
      setSubmitted(localStorage.getItem(`feedback_artwork_${artwork.id}`) === "true");
    }
  }, [artwork]);



  return (
    <Dialog open={!!artwork} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-y-auto max-h-[90vh] border-border">
        {artwork && (
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-muted aspect-square md:aspect-auto md:h-full min-h-[50vh] flex items-center justify-center p-4">
              <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-contain max-h-[85vh]" />
            </div>
            <div className="p-8 md:p-10 flex flex-col">
              {artwork.category && (
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                  {artwork.category}
                </p>
              )}
              <DialogTitle className="font-display text-3xl md:text-4xl font-light">
                {artwork.title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-base text-foreground/80 italic">
                {artwork.short_description}
              </DialogDescription>
              {artwork.duration && (
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  Duration: {artwork.duration}
                </p>
              )}
              <div className="mt-6 prose prose-sm text-foreground/80 whitespace-pre-line">
                {artwork.full_description || "—"}
              </div>
              <div className="mt-8 flex items-center justify-between pb-8 border-b border-border">
                <p className="text-xs text-muted-foreground">
                  {new Date(artwork.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={async () => {
                      try {
                        const response = await fetch(artwork.image_url);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        const ext = artwork.image_url.split(".").pop() || "jpg";
                        link.download = `${artwork.title.replace(/\\s+/g, '_').toLowerCase()}.${ext}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (err) {
                        toast.error("Could not download image.");
                      }
                    }} 
                    className="h-8 rounded-none text-[10px] uppercase tracking-widest px-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                {submitted ? (
                  <Button disabled className="w-full rounded-none uppercase tracking-wider text-[10px] h-10">
                    Feedback Submitted
                  </Button>
                ) : (
                  <Button asChild className="w-full rounded-none uppercase tracking-wider text-[10px] h-10">
                    <a href={`/feedback?artwork=${artwork.id}&title=${encodeURIComponent(artwork.title)}`}>
                      Give Feedback
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
