import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MyRecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<Map<string, number>>(new Map());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserRecipes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Buscar receitas do usuário logado
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (recipesError) throw recipesError;

        if (!recipesData || recipesData.length === 0) {
          setRecipes([]);
          setLoading(false);
          return;
        }

        // Buscar profile do usuário
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        const authorName = profileData?.full_name || 'Você';

        // Buscar ratings das receitas
        const recipeIds = recipesData.map(r => r.id);
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select('recipe_id, rating')
          .in('recipe_id', recipeIds);

        // Criar mapa de ratings por receita
        const ratingsMap = new Map<string, { avg: number; count: number }>();
        ratingsData?.forEach(rating => {
          const current = ratingsMap.get(rating.recipe_id) || { avg: 0, count: 0, sum: 0 };
          const sum = (current.avg * current.count) + rating.rating;
          const count = current.count + 1;
          ratingsMap.set(rating.recipe_id, {
            avg: sum / count,
            count: count,
          });
        });

        // Buscar avaliações do próprio usuário
        const { data: userRatingsData } = await supabase
          .from('ratings')
          .select('recipe_id, rating')
          .eq('user_id', user.id)
          .in('recipe_id', recipeIds);

        const userRatingsMap = new Map<string, number>();
        userRatingsData?.forEach(r => userRatingsMap.set(r.recipe_id, r.rating));
        setUserRatings(userRatingsMap);

        // Transformar dados para formato Recipe
        const formattedRecipes: Recipe[] = recipesData.map(recipe => ({
          id: recipe.id,
          name: recipe.title,
          description: recipe.description || '',
          imagePrompt: '',
          imageUrl: recipe.image_url || '/placeholder.svg',
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          authorId: recipe.user_id,
          authorName: authorName,
          category: recipe.category || 'Outros',
          rating: ratingsMap.get(recipe.id)?.avg || 0,
          ratingsCount: ratingsMap.get(recipe.id)?.count || 0,
        }));

        setRecipes(formattedRecipes);
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        toast({
          title: "Erro ao carregar receitas",
          description: "Não foi possível carregar suas receitas.",
          variant: "destructive",
        });
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserRecipes();
  }, [user, toast]);

  const handleRate = async (recipeId: string, rating: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          recipe_id: recipeId,
          user_id: user.id,
          rating: rating,
        }, {
          onConflict: 'recipe_id,user_id'
        });

      if (error) throw error;

      setUserRatings(prev => new Map(prev).set(recipeId, rating));
      
      toast({
        title: "Avaliação registrada",
        description: `Você avaliou esta receita com ${rating} estrelas.`,
      });

      // Recarregar receitas para atualizar a média
      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('recipe_id, rating')
        .in('recipe_id', recipes.map(r => r.id));

      const ratingsMap = new Map<string, { avg: number; count: number }>();
      ratingsData?.forEach(r => {
        const current = ratingsMap.get(r.recipe_id) || { avg: 0, count: 0, sum: 0 };
        const sum = (current.avg * current.count) + r.rating;
        const count = current.count + 1;
        ratingsMap.set(r.recipe_id, {
          avg: sum / count,
          count: count,
        });
      });

      setRecipes(prev => prev.map(recipe => ({
        ...recipe,
        rating: ratingsMap.get(recipe.id)?.avg || 0,
        ratingsCount: ratingsMap.get(recipe.id)?.count || 0,
      })));
    } catch (error) {
      console.error('Erro ao avaliar receita:', error);
      toast({
        title: "Erro ao avaliar",
        description: "Não foi possível registrar sua avaliação.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center text-on-surface-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Voltar
        </Link>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-4xl font-bold text-on-surface mb-4">
              Minhas Receitas
            </h1>
            <p className="text-on-surface-secondary text-lg">
              {loading ? "Carregando suas receitas..." : `Você tem ${recipes.length} receita${recipes.length !== 1 ? 's' : ''} publicada${recipes.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-on-surface-secondary">Carregando suas receitas...</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="block">
                  <RecipeCard 
                    recipe={recipe}
                    onRate={(rating) => handleRate(recipe.id, rating)}
                    userRating={userRatings.get(recipe.id)}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center py-12">
              <p className="text-on-surface-secondary text-lg mb-8">
                Você ainda não publicou nenhuma receita
              </p>
              <Link to="/add-recipe">
                <Button variant="default" className="rounded-full px-8 py-6">
                  Publicar Primeira Receita
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecipesPage;
