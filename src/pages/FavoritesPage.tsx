import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const FavoritesPage = () => {
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

        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-4xl font-bold text-on-surface mb-4">
            Suas Receitas Favoritas
          </h1>
          <p className="text-on-surface-secondary text-lg mb-8">
            Você ainda não adicionou nenhuma receita aos favoritos
          </p>
          <Link to="/">
            <Button variant="default" className="rounded-full px-8 py-6">
              Explorar Receitas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
