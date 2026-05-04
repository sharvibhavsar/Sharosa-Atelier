import { Layout } from "../components/Layout";
import { Wordmark } from "../components/Wordmark";
import { Award, Palette, Sparkles } from "lucide-react";

const About = () => (
  <Layout>
    <section className="container py-20 md:py-28 max-w-4xl">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">About the atelier</p>
      <h1 className="font-display text-5xl md:text-6xl font-light leading-tight">
        Hands that work with paint, art<span className="italic"> and heart</span>.
      </h1>

      <div className="mt-12 prose prose-lg dark:prose-invert text-foreground/80">
        <p>
          Hello — I'm <strong>Sharvi Bhavsar</strong>,a 20 year old artist behind <Wordmark className="text-base" />.
          What began as childhood hobbies has grown into a practice of traditional Indian art,
          paper crafts, architectural sketching and the bright, fleeting beauty of rangoli.
        </p>
        <p>
          The website is named after artist Sharvi who loves pink, Sha coming from name and Rosa is standing for pink in Spanish.
        </p>

        <p>
          Every piece on this site is made by hand, kept at my home, some made years ago whereas some recent and shared here for joy — not for sale. The atelier is a window, not a shop.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-px bg-border">
        <div className="bg-background p-8">
          <Palette className="h-6 w-6 text-foreground/60 mb-4" />
          <h3 className="font-display text-xl mb-2">Skills & interests</h3>
          <p className="text-sm text-muted-foreground">
            Pichhwai, Madhubani, Shrinathji art, mandala, pencil shading, paper sculpture,
            interior &amp; exterior sketching, fashion illustrations.
          </p>
        </div>
        <div className="bg-background p-8">
          <Sparkles className="h-6 w-6 text-foreground/60 mb-4" />
          <h3 className="font-display text-xl mb-2">Rangoli</h3>
          <p className="text-sm text-muted-foreground">
            Festive, themed as well as competition rangoli — color poured directly onto the floor.

          </p>
        </div>
        <div className="bg-background p-8">
          <Award className="h-6 w-6 text-foreground/60 mb-4" />
          <h3 className="font-display text-xl mb-2">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            Multiple rangoli competition winner at interclass as well as interschool and university level. Cleared Elementary and Intermediate state level art examinations. Certifications in traditional Indian art forms.

          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
