import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const artworkId = searchParams.get("artwork");
  const artworkTitle = searchParams.get("title");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [favArtwork, setFavArtwork] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Create a specific key for artwork vs general feedback
  const storageKey = artworkId ? `feedback_artwork_${artworkId}` : "general_feedback_submitted";
  const [submitted, setSubmitted] = useState(() => {
    return localStorage.getItem(storageKey) === "true";
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) {
      toast.error("You have already submitted feedback.");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.from("feedback").insert({
        type: artworkId ? "artwork" : "general",
        artwork_id: artworkId || null,
        fav_artwork: favArtwork || null,
        name,
        email,
        message,
      });
      
      if (error) throw error;
      
      toast.success("Thank you for your feedback.");
      localStorage.setItem(storageKey, "true");
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setFavArtwork("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container max-w-2xl py-20 md:py-28">
        <h1 className="font-display text-4xl md:text-5xl font-light mb-6">
          Feedback
        </h1>
        {artworkTitle && (
          <p className="text-sm text-muted-foreground mb-4">
            For artwork: <span className="italic">{artworkTitle}</span>
          </p>
        )}
        
        {submitted ? (
          <div className="bg-card border border-border p-8 text-center mt-12 shadow-soft">
            <h2 className="font-display text-2xl mb-2">Thank you!</h2>
            <p className="text-muted-foreground">We have received your thoughts.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-12 bg-card border border-border p-6 md:p-10 shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs uppercase tracking-widest">Name</Label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-none mt-1.5 h-11" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest">Email</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none mt-1.5 h-11" />
              </div>
            </div>
            
            {artworkId && (
              <div>
                <Label className="text-xs uppercase tracking-widest">Most fav artwork <span className="normal-case tracking-normal">(Max 50 chars)</span></Label>
                <Input required value={favArtwork} onChange={(e) => setFavArtwork(e.target.value)} maxLength={50} className="rounded-none mt-1.5 h-11" />
                <p className="text-[10px] text-right mt-1 text-muted-foreground">
                  {favArtwork.length} / 50
                </p>
              </div>
            )}
            
            <div>
              <Label className="text-xs uppercase tracking-widest">Your Ideas & Feedback</Label>
              <Textarea 
                required 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                maxLength={150} 
                className="rounded-none mt-1.5" 
                rows={4}
                placeholder="Maximum 150 characters..."
              />
              <p className="text-[10px] text-right mt-1 text-muted-foreground">
                {message.length} / 150
              </p>
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-none uppercase tracking-wider text-xs h-12">
              {loading ? "Submitting…" : "Submit Feedback"}
            </Button>
          </form>
        )}
      </section>
    </Layout>
  );
};

export default Feedback;
