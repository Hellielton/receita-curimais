import { Recipe } from "@/types";
import { StarRating } from "./StarRating";

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="bg-surface rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col h-full group">
      <div className="relative overflow-hidden">
        <img
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          src={recipe.imageUrl}
          alt={recipe.name}
        />
        <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {recipe.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-on-surface mb-2 line-clamp-2">
          {recipe.name}
        </h3>
        
        <p className="text-on-surface-secondary text-sm mb-3 line-clamp-2 flex-grow">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <StarRating rating={recipe.rating} ratingsCount={recipe.ratingsCount} />
          <span className="text-xs text-on-surface-secondary">
            Por {recipe.authorName}
          </span>
        </div>
      </div>
    </div>
  );
};
