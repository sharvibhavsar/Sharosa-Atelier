import { Artwork } from "../types";

type Props = {
  artwork: Artwork;
  onClick: () => void;
  index?: number;
};

export const ArtworkCard = ({ artwork, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="art-card group text-left w-full"
  >
    <div className="overflow-hidden bg-muted relative">
      <img
        src={artwork.image_url}
        alt={artwork.title}
        loading="lazy"
        className="w-full h-auto"
      />
    </div>
    <div className="p-4">
      {artwork.category && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
          {artwork.category}
        </p>
      )}
      <h3 className="font-display text-xl leading-tight">{artwork.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
        {artwork.short_description}
      </p>
    </div>
  </button>
);
