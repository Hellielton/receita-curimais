import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyRecipesPage = () => {
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
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-4xl font-bold text-on-surface mb-4">
            Minhas Receitas
          </h1>
          <p className="text-on-surface-secondary text-lg mb-8">
            Você ainda não publicou nenhuma receita
          </p>
          <Link to="/add-recipe">
            <Button variant="default" className="rounded-full px-8 py-6">
              Publicar Primeira Receita
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyRecipesPage;
