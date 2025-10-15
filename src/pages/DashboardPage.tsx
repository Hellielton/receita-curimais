import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UtensilsCrossed, Plus } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: string | null;
  category: string | null;
  user_id: string;
  created_at: string;
}

interface Rating {
  recipe_id: string;
  rating: number;
}

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      loadRecipes();
      loadUserRatings();
    }
  }, [user, authLoading]);

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar receitas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserRatings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("ratings")
        .select("recipe_id, rating")
        .eq("user_id", user.id);

      if (error) throw error;
      
      const ratingsMap: Record<string, number> = {};
      data?.forEach((r: Rating) => {
        ratingsMap[r.recipe_id] = r.rating;
      });
      setRatings(ratingsMap);
    } catch (error: any) {
      console.error("Error loading ratings:", error);
    }
  };

  const handleRate = async (recipeId: string, rating: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("ratings")
        .upsert({
          recipe_id: recipeId,
          user_id: user.id,
          rating: rating,
        });

      if (error) throw error;

      setRatings(prev => ({ ...prev, [recipeId]: rating }));
      
      toast({
        title: "Avaliação salva!",
        description: "Sua avaliação foi registrada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao avaliar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-4">
              Bem-vindo, {user.email}!
            </h1>
            <p className="text-lg text-on-surface-secondary mb-6">
              Explore receitas deliciosas e compartilhe suas próprias criações
            </p>
            <Link to="/add-recipe">
              <Button size="lg" className="rounded-full">
                <Plus className="mr-2 h-5 w-5" />
                Publicar Nova Receita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recipes Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-on-surface mb-3">
              Receitas Disponíveis
            </h2>
            <p className="text-on-surface-secondary">
              Avalie as receitas e descubra novos sabores
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-on-surface-secondary">Carregando receitas...</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id}>
                  <Link to={`/recipe/${recipe.id}`} className="block">
                    <RecipeCard 
                      recipe={{
                        id: recipe.id,
                        name: recipe.title,
                        description: recipe.description || "",
                        imageUrl: recipe.image_url || "/placeholder.svg",
                        imagePrompt: "",
                        ingredients: [],
                        instructions: [],
                        authorId: recipe.user_id,
                        authorName: "Chef",
                        category: recipe.category || "Receitas",
                        rating: ratings[recipe.id] || 0,
                        ratingsCount: 0,
                      }}
                      onRate={(rating) => handleRate(recipe.id, rating)}
                      userRating={ratings[recipe.id]}
                    />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
              <UtensilsCrossed className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-on-surface mb-2">
                Nenhuma receita encontrada
              </h3>
              <p className="text-on-surface-secondary mb-6">
                Seja o primeiro a compartilhar uma receita incrível!
              </p>
              <Link to="/add-recipe">
                <Button className="rounded-full">
                  Publicar Primeira Receita
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
