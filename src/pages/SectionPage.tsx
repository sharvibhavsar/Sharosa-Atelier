import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { sectionBySlug } from "../lib/categories";
import { Gallery } from "../components/Gallery";
import NotFound from "./NotFound";

const SectionPage = () => {
  const { slug } = useParams();
  const section = sectionBySlug(slug);
  if (!section) return <NotFound />;

  return (
    <Layout>
      <section className="container py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">The collection</p>
        <h1 className="font-display text-5xl md:text-6xl font-light max-w-3xl leading-tight">
          {section.label}.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{section.tagline}</p>
      </section>

      <section className="container pb-24">
        <Gallery section={section.slug} categories={section.categories} />
      </section>
    </Layout>
  );
};

export default SectionPage;
