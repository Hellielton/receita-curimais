import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    ingredients: "",
    instructions: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para publicar receitas");
      navigate("/auth");
      return;
    }

    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!imageFile) {
      toast.error("Por favor, adicione uma imagem para a receita");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      // Parse ingredients and instructions
      const ingredientsArray = formData.ingredients
        .split('\n')
        .filter(line => line.trim() !== '');
      
      const instructionsArray = formData.instructions
        .split('\n')
        .filter(line => line.trim() !== '');

      // Insert recipe into database
      const { error: insertError } = await supabase
        .from('recipes')
        .insert({
          title: formData.name,
          description: formData.description,
          category: formData.category,
          ingredients: ingredientsArray,
          instructions: instructionsArray,
          image_url: publicUrl,
          user_id: user.id,
        });

      if (insertError) throw insertError;

      toast.success("Receita publicada com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error publishing recipe:", error);
      toast.error("Erro ao publicar receita. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
              <Label htmlFor="image" className="text-on-surface font-medium">
                Imagem da Receita *
              </Label>
              <div className="mt-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                <Label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-surface-secondary transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-on-surface-secondary mb-2" />
                      <span className="text-on-surface-secondary">
                        Clique para adicionar uma imagem
                      </span>
                      <span className="text-xs text-on-surface-secondary mt-1">
                        JPG, PNG ou WEBP (máx. 5MB)
                      </span>
                    </div>
                  )}
                </Label>
              </div>
            </div>

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
                disabled={isSubmitting}
                className="flex-1 py-6 text-base font-semibold rounded-full"
              >
                {isSubmitting ? "Publicando..." : "Publicar Receita"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
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
