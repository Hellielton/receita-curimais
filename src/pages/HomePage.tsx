import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "@/types";
import { RecipeCard } from "@/components/RecipeCard";
import { MOCK_RECIPES } from "@/services/mockRecipes";
import { UtensilsCrossed } from "lucide-react";

const HomePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadRecipes = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setRecipes(MOCK_RECIPES);
      setLoading(false);
    };

    loadRecipes();
  }, []);

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
            <p className="text-on-surface-secondary text-lg max-w-2xl mx-auto">
              Seleção especial de receitas deliciosas criadas por nossa comunidade
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-on-surface-secondary">Carregando receitas deliciosas...</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="block">
                  <RecipeCard recipe={recipe} />
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
                Em breve teremos receitas deliciosas para você explorar!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
