import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    ingredients: "",
    instructions: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    toast.success("Receita publicada com sucesso!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center text-on-surface-secondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Voltar
        </Link>

        <div className="max-w-4xl mx-auto bg-surface p-8 md:p-12 rounded-3xl shadow-xl">
          <h1 className="font-serif text-4xl font-bold text-on-surface text-center mb-8">
            Publique Sua Receita
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-on-surface font-medium">
                Nome da Receita *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Brigadeiro Gourmet"
                className="mt-2 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-on-surface font-medium">
                Descrição *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva sua receita de forma atraente..."
                className="mt-2 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-on-surface font-medium">
                Categoria *
              </Label>
              <Input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Sobremesa, Prato Principal, Entrada"
                className="mt-2 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="ingredients" className="text-on-surface font-medium">
                Ingredientes (um por linha)
              </Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows={6}
                placeholder="1 lata de leite condensado&#10;2 colheres de chocolate em pó&#10;1 colher de manteiga"
                className="mt-2 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="instructions" className="text-on-surface font-medium">
                Modo de Preparo (um passo por linha)
              </Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={8}
                placeholder="Misture todos os ingredientes em uma panela&#10;Cozinhe em fogo médio mexendo sempre&#10;Deixe esfriar e faça as bolinhas"
                className="mt-2 rounded-xl"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 py-6 text-base font-semibold rounded-full"
              >
                Publicar Receita
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="px-8 py-6 rounded-full"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipePage;
