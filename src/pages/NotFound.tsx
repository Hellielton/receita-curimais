import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-serif font-bold text-on-surface">404</h1>
        <p className="mb-6 text-xl text-on-surface-secondary">
          Ops! Página não encontrada
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-focus text-primary-foreground font-semibold rounded-full transition-colors"
        >
          Voltar para Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
