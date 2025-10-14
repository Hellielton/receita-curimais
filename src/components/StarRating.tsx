import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  ratingsCount?: number;
  size?: number;
}

export const StarRating = ({ rating, ratingsCount, size = 16 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < Math.floor(rating)
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
          }
        />
      ))}
      {ratingsCount !== undefined && (
        <span className="text-sm text-on-surface-secondary ml-1">
          ({ratingsCount})
        </span>
      )}
    </div>
  );
};
