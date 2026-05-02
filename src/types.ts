export type Artwork = {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  duration: string | null;
  section: string;
  category: string | null;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};
