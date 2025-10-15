import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  ratingsCount?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const StarRating = ({ 
  rating, 
  ratingsCount, 
  size = 16, 
  interactive = false,
  onChange 
}: StarRatingProps) => {
  const handleClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              index < Math.floor(rating)
                ? "fill-primary text-primary"
                : "fill-muted text-muted",
              interactive && "cursor-pointer hover:scale-110 transition-transform"
            )}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
      {ratingsCount !== undefined && (
        <span className="text-sm text-on-surface-secondary ml-1">
          ({ratingsCount})
        </span>
      )}
    </div>
  );
};
