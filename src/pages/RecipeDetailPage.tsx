import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RecipeData {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  ingredients: string[];
  instructions: string[];
  category: string | null;
  user_id: string;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: string | null;
  author_name?: string;
  rating?: number;
  ratings_count?: number;
}

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Buscar receita
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (recipeError) throw recipeError;
        if (!recipeData) {
          setRecipe(null);
          setLoading(false);
          return;
        }

        // Buscar perfil do autor
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', recipeData.user_id)
          .maybeSingle();

        // Buscar ratings
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select('rating')
          .eq('recipe_id', id);

        // Calcular média de ratings
        let avgRating = 0;
        let ratingsCount = 0;
        if (ratingsData && ratingsData.length > 0) {
          const sum = ratingsData.reduce((acc, r) => acc + r.rating, 0);
          avgRating = sum / ratingsData.length;
          ratingsCount = ratingsData.length;
        }

        setRecipe({
          ...recipeData,
          author_name: profileData?.full_name || 'Usuário',
          rating: avgRating,
          ratings_count: ratingsCount,
        });
      } catch (error) {
        console.error('Erro ao carregar receita:', error);
        toast({
          title: "Erro ao carregar receita",
          description: "Não foi possível carregar os dados da receita.",
          variant: "destructive",
        });
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, toast]);

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
                src={recipe.image_url || '/placeholder.svg'}
                alt={recipe.title}
              />
            </div>
            
            <div className="p-8 md:p-12">
              <div className="uppercase tracking-wide text-sm text-secondary font-semibold">
                {recipe.category}
              </div>
              
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-on-surface mt-2 mb-4">
                {recipe.title}
              </h1>
              
              <p className="text-lg text-on-surface-secondary mb-6">
                {recipe.description}
              </p>
              
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <StarRating rating={recipe.rating || 0} ratingsCount={recipe.ratings_count || 0} size={20} />
                <div className="flex items-center text-on-surface-secondary">
                  <ChefHat size={18} className="mr-2" />
                  <span className="text-sm">Por {recipe.author_name}</span>
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
