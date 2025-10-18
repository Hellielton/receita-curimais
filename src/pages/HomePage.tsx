import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "@/types";
import { RecipeCard } from "@/components/RecipeCard";
import { supabase } from "@/integrations/supabase/client";
import { UtensilsCrossed, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";

const HomePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<Map<string, number>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        // Buscar todas as receitas
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });

        if (recipesError) throw recipesError;

        if (!recipesData || recipesData.length === 0) {
          setRecipes([]);
          setLoading(false);
          return;
        }

        // Buscar profiles dos autores
        const userIds = [...new Set(recipesData.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        // Criar mapa de profiles
        const profilesMap = new Map(
          profilesData?.map(p => [p.id, p.full_name || 'Usuário']) || []
        );

        // Buscar todos os ratings
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
          authorName: profilesMap.get(recipe.user_id) || 'Usuário',
          category: recipe.category || 'Outros',
          rating: ratingsMap.get(recipe.id)?.avg || 0,
          ratingsCount: ratingsMap.get(recipe.id)?.count || 0,
        }));

        setRecipes(formattedRecipes);

        // Buscar avaliações do usuário
        const userRatingsMap = new Map<string, number>();
        
        if (user) {
          // Usuário autenticado: buscar do banco
          const { data: userRatingsData } = await supabase
            .from('ratings')
            .select('recipe_id, rating')
            .eq('user_id', user.id)
            .in('recipe_id', recipeIds);

          userRatingsData?.forEach(r => userRatingsMap.set(r.recipe_id, r.rating));
        } else {
          // Usuário não autenticado: buscar do localStorage
          const localRatings = JSON.parse(localStorage.getItem('guestRatings') || '{}');
          Object.entries(localRatings).forEach(([recipeId, rating]) => {
            if (recipeIds.includes(recipeId)) {
              userRatingsMap.set(recipeId, rating as number);
            }
          });
        }
        
        setUserRatings(userRatingsMap);
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        toast({
          title: "Erro ao carregar receitas",
          description: "Não foi possível carregar as receitas.",
          variant: "destructive",
        });
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [toast, user]);

  const handleRate = async (recipeId: string, rating: number) => {
    try {
      if (user) {
        // Usuário autenticado: salvar no banco de dados
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

        // Recarregar receitas para atualizar a média
        const { data: recipesData } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });

        if (recipesData) {
          const recipeIds = recipesData.map(r => r.id);
          const { data: ratingsData } = await supabase
            .from('ratings')
            .select('recipe_id, rating')
            .in('recipe_id', recipeIds);

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
        }
      } else {
        // Usuário não autenticado: salvar no localStorage
        const localRatings = JSON.parse(localStorage.getItem('guestRatings') || '{}');
        localRatings[recipeId] = rating;
        localStorage.setItem('guestRatings', JSON.stringify(localRatings));
      }

      setUserRatings(prev => new Map(prev).set(recipeId, rating));
      
      toast({
        title: "Avaliação registrada",
        description: `Você avaliou esta receita com ${rating} estrelas.`,
      });
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-on-surface mb-6">
              Descubra Sabores <br />
              <span className="text-primary">Extraordinários</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-secondary mb-8 max-w-2xl mx-auto">
              Explore receitas autênticas da culinária brasileira e compartilhe suas próprias criações com nossa comunidade apaixonada por gastronomia.
            </p>
            <div className="flex justify-center">
              <a
                href="#recipes"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-focus text-primary-foreground font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explorar Receitas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid Section */}
      <section id="recipes" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-on-surface mb-4">
              Receitas em Destaque
            </h2>
            <p className="text-on-surface-secondary text-lg max-w-2xl mx-auto mb-8">
              Seleção especial de receitas deliciosas criadas por nossa comunidade
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border-2 border-primary/30 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-6 w-6" />
                  <Input
                    type="text"
                    placeholder="Buscar receitas por nome, categoria ou ingredientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-14 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-on-surface-secondary">Carregando receitas deliciosas...</p>
            </div>
          ) : (() => {
            const filteredRecipes = recipes.filter(recipe => 
              recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            return filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe) => (
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
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <UtensilsCrossed className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-on-surface mb-2">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-on-surface-secondary">
                  Tente buscar com outros termos ou explore todas as receitas disponíveis.
                </p>
              </div>
            );
          })()}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
