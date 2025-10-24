import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<Map<string, number>>(new Map());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Buscar IDs das receitas favoritas
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('recipe_id')
          .eq('user_id', user.id);

        if (favoritesError) throw favoritesError;
        if (!favoritesData || favoritesData.length === 0) {
          setRecipes([]);
          setLoading(false);
          return;
        }

        const recipeIds = favoritesData.map(f => f.recipe_id);

        // Buscar receitas
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .in('id', recipeIds);

        if (recipesError) throw recipesError;

        // Buscar perfis dos autores
        const userIds = recipesData?.map(r => r.user_id) || [];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        // Buscar ratings
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select('recipe_id, rating')
          .in('recipe_id', recipeIds);

        // Buscar ratings do usuário
        const { data: userRatingsData } = await supabase
          .from('ratings')
          .select('recipe_id, rating')
          .eq('user_id', user.id)
          .in('recipe_id', recipeIds);

        // Mapear ratings do usuário
        const ratingsMap = new Map<string, number>();
        userRatingsData?.forEach(r => {
          ratingsMap.set(r.recipe_id, r.rating);
        });
        setUserRatings(ratingsMap);

        // Formatar receitas
        const formattedRecipes: Recipe[] = recipesData?.map(recipe => {
          const profile = profilesData?.find(p => p.id === recipe.user_id);
          const recipeRatings = ratingsData?.filter(r => r.recipe_id === recipe.id) || [];
          const avgRating = recipeRatings.length > 0
            ? recipeRatings.reduce((acc, r) => acc + r.rating, 0) / recipeRatings.length
            : 0;

          return {
            id: recipe.id,
            name: recipe.title,
            description: recipe.description || '',
            imagePrompt: '',
            imageUrl: recipe.image_url || '/placeholder.svg',
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            authorId: recipe.user_id,
            authorName: profile?.full_name || 'Usuário',
            category: recipe.category || 'Geral',
            rating: avgRating,
            ratingsCount: recipeRatings.length,
          };
        }) || [];

        setRecipes(formattedRecipes);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        toast({
          title: "Erro ao carregar favoritos",
          description: "Não foi possível carregar suas receitas favoritas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, toast]);

  const handleRate = async (recipeId: string, rating: number) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para avaliar receitas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          recipe_id: recipeId,
          rating: rating,
        });

      if (error) throw error;

      setUserRatings(prev => new Map(prev).set(recipeId, rating));

      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('rating')
        .eq('recipe_id', recipeId);

      if (ratingsData) {
        const avgRating = ratingsData.reduce((acc, r) => acc + r.rating, 0) / ratingsData.length;
        setRecipes(prev =>
          prev.map(r =>
            r.id === recipeId
              ? { ...r, rating: avgRating, ratingsCount: ratingsData.length }
              : r
          )
        );
      }

      toast({
        title: "Avaliação registrada",
        description: "Sua avaliação foi salva com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao avaliar receita:', error);
      toast({
        title: "Erro ao avaliar",
        description: "Não foi possível salvar sua avaliação.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-4xl font-bold text-on-surface mb-4">
              Suas Receitas Favoritas
            </h1>
            <p className="text-on-surface-secondary text-lg mb-8">
              Você precisa estar logado para ver seus favoritos
            </p>
            <Link to="/auth">
              <Button variant="default" className="rounded-full px-8 py-6">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="mb-12">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold text-on-surface text-center mb-2">
            Suas Receitas Favoritas
          </h1>
          <p className="text-on-surface-secondary text-center">
            {recipes.length} {recipes.length === 1 ? 'receita favorita' : 'receitas favoritas'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
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
              Você ainda não adicionou nenhuma receita aos favoritos
            </p>
            <Link to="/">
              <Button variant="default" className="rounded-full px-8 py-6">
                Explorar Receitas
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
