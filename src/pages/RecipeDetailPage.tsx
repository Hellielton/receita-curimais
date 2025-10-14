import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Recipe } from "@/types";
import { StarRating } from "@/components/StarRating";
import { MOCK_RECIPES } from "@/services/mockRecipes";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundRecipe = MOCK_RECIPES.find((r) => r.id === id);
      setRecipe(foundRecipe || null);
      setLoading(false);
    };

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-on-surface mb-4">
            Receita não encontrada
          </h1>
          <Link to="/">
            <Button variant="default" className="rounded-full">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center text-on-surface-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Voltar
        </Link>

        <div className="bg-surface rounded-3xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-64 w-full object-cover md:h-full md:w-96 lg:w-[32rem]"
                src={recipe.imageUrl}
                alt={recipe.name}
              />
            </div>
            
            <div className="p-8 md:p-12">
              <div className="uppercase tracking-wide text-sm text-secondary font-semibold">
                {recipe.category}
              </div>
              
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-on-surface mt-2 mb-4">
                {recipe.name}
              </h1>
              
              <p className="text-lg text-on-surface-secondary mb-6">
                {recipe.description}
              </p>
              
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <StarRating rating={recipe.rating} ratingsCount={recipe.ratingsCount} size={20} />
                <div className="flex items-center text-on-surface-secondary">
                  <ChefHat size={18} className="mr-2" />
                  <span className="text-sm">Por {recipe.authorName}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="default" className="rounded-full">
                  Adicionar aos Favoritos
                </Button>
                <Button variant="outline" className="rounded-full">
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients and Instructions */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Ingredients */}
          <div className="bg-surface rounded-2xl p-8 shadow-lg">
            <h2 className="font-serif text-3xl font-bold text-on-surface mb-6">
              Ingredientes
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start text-on-surface-secondary"
                >
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-surface rounded-2xl p-8 shadow-lg">
            <h2 className="font-serif text-3xl font-bold text-on-surface mb-6">
              Modo de Preparo
            </h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-on-surface-secondary pt-1">
                    {instruction}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
