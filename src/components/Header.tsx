import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChefHat, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-2xl font-serif font-bold text-primary">CuriMais</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-on-surface-secondary hover:text-primary font-medium transition-colors"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-on-surface-secondary hover:text-primary font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-recipes"
                  className="text-on-surface-secondary hover:text-primary font-medium transition-colors"
                >
                  Minhas Receitas
                </Link>
                <Link
                  to="/favorites"
                  className="text-on-surface-secondary hover:text-primary font-medium transition-colors"
                >
                  Favoritos
                </Link>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/add-recipe">
                  <Button variant="default" className="rounded-full">
                    Publicar Receita
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="rounded-full">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-on-surface"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
            <Link
              to="/"
              className="block text-on-surface-secondary hover:text-primary font-medium transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block text-on-surface-secondary hover:text-primary font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-recipes"
                  className="block text-on-surface-secondary hover:text-primary font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Minhas Receitas
                </Link>
                <Link
                  to="/favorites"
                  className="block text-on-surface-secondary hover:text-primary font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favoritos
                </Link>
              </>
            )}
            {user ? (
              <>
                <Link
                  to="/add-recipe"
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="default" className="w-full rounded-full">
                    Publicar Receita
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full rounded-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="w-full rounded-full">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
