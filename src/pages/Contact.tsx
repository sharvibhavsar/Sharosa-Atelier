import { Layout } from "../components/Layout";
import { Mail, Linkedin, ExternalLink, Phone } from "lucide-react";

const Pinterest = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.082.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
);

const Contact = () => (
  <Layout>
    <section className="container py-20 md:py-28 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Get in touch</p>
      <h1 className="font-display text-5xl md:text-6xl font-light leading-tight">
        Say hello.
      </h1>
      <p className="mt-5 text-lg text-muted-foreground">
        For commissions, collaborations, or just a kind word about the work — write to me.
      </p>

      <div className="mt-14 space-y-px bg-border animate-fade-in-soft">
        <a href="mailto:sharvibhavsar12@gmail.com?subject=Hello%20Sharvi" className="flex items-center gap-4 bg-background hover:bg-secondary/50 transition px-6 py-5">
          <Mail className="h-5 w-5 text-foreground/60" />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
            <p className="text-base">sharvibhavsar12@gmail.com</p>
          </div>
        </a>
        <a href="tel:+917990049150" className="flex items-center gap-4 bg-background hover:bg-secondary/50 transition px-6 py-5">
          <Phone className="h-5 w-5 text-foreground/60" />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Phone</p>
            <p className="text-base">+91 79900 49150</p>
          </div>
        </a>
        <a href="https://in.pinterest.com/sharvibhavsar/" target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-background hover:bg-secondary/50 transition px-6 py-5">
          <Pinterest />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Pinterest</p>
            <p className="text-base">@sharvibhavsar</p>
          </div>
          <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
        </a>
        <a href="https://www.linkedin.com/in/sharvi-bhavsar-914344344/" target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-background hover:bg-secondary/50 transition px-6 py-5">
          <Linkedin className="h-5 w-5 text-foreground/60" />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">LinkedIn</p>
            <p className="text-base">Sharvi Bhavsar</p>
          </div>
          <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
        </a>
        <a href="https://sharvi-bhavsar-portfolio.vercel.app/" target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-background hover:bg-secondary/50 transition px-6 py-5">
          <ExternalLink className="h-5 w-5 text-foreground/60" />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Portfolio</p>
            <p className="text-base">sharvi-bhavsar-portfolio.vercel.app</p>
          </div>
        </a>
      </div>
      
      <p className="mt-16 text-center text-lg font-display italic text-foreground/80">
        Creavtivity flows naturally. Contact for custom paintings.
      </p>
    </section>
  </Layout>
);

export default Contact;
