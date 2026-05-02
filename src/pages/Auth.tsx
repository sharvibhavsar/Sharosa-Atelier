import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailLower = email.toLowerCase();
    if (emailLower !== 'sharvibhavsar12@gmail.com' && emailLower !== 'admin@sharosa.com' && emailLower !== 'admin@sharosa') {
      toast.error("Unauthorized access.");
      return;
    }
    
    if (password !== 'Honeycomb*67') {
      toast.error("Invalid credentials.");
      return;
    }

    localStorage.setItem('adminAuth', 'true');
    toast.success("Signed in as Admin.");
    // Force a hard reload so the app picks up the new localStorage state instantly
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <section className="container max-w-md py-20 px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 text-center">Sharosa Atelier</p>
        <h1 className="font-display text-4xl md:text-5xl font-light mb-8 text-center">Admin Portal</h1>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest">Admin Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none mt-1.5 h-11" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest">Password</Label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-none mt-1.5 h-11" />
          </div>
          <Button type="submit" className="w-full rounded-none uppercase tracking-wider text-xs h-12 mt-4">
            Sign in
          </Button>
        </form>

        <p className="mt-10 text-xs text-muted-foreground leading-relaxed text-center">
          Restricted access.
        </p>
      </section>
    </div>
  );
};

export default Auth;

