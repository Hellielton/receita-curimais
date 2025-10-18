import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 text-on-surface-secondary">
            <span>Desenvolvido com</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            <span>por</span>
            <span className="font-semibold text-primary">Hellielton Reis</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CuriMais Recipe. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
