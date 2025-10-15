import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChefHat } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated] = useState(false); // Simulated auth state

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
            {isAuthenticated && (
              <>
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
            {isAuthenticated ? (
              <Link to="/add-recipe">
                <Button variant="default" className="rounded-full">
                  Publicar Receita
                </Button>
              </Link>
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
            {isAuthenticated && (
              <>
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
            {isAuthenticated ? (
              <Link
                to="/add-recipe"
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="default" className="w-full rounded-full">
                  Publicar Receita
                </Button>
              </Link>
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
