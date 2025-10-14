import { Recipe } from '@/types';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Feijoada Completa",
    description: "Um rico e saboroso cozido de feijão preto com vários cortes de carne de porco, um verdadeiro clássico brasileiro.",
    imagePrompt: "A vibrant, steaming pot of Brazilian feijoada",
    imageUrl: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "500g de feijão preto",
      "300g de costela de porco",
      "200g de linguiça calabresa",
      "150g de bacon",
      "2 cebolas médias",
      "4 dentes de alho",
      "2 folhas de louro",
      "Sal e pimenta a gosto"
    ],
    instructions: [
      "Deixe o feijão de molho na noite anterior",
      "Cozinhe o feijão em água com sal por cerca de 1 hora",
      "Em uma panela separada, refogue as carnes com cebola e alho",
      "Adicione as carnes ao feijão e cozinhe por mais 40 minutos",
      "Ajuste o tempero e sirva com arroz, farofa e laranja"
    ],
    authorId: "user-1",
    authorName: "Chef Maria Silva",
    category: "Prato Principal",
    rating: 4.8,
    ratingsCount: 156
  },
  {
    id: "2",
    name: "Brigadeiro Gourmet",
    description: "Clássico doce brasileiro feito com leite condensado, chocolate e manteiga, perfeito para qualquer ocasião.",
    imagePrompt: "Gourmet Brazilian brigadeiros in elegant cups",
    imageUrl: "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "1 lata de leite condensado",
      "2 colheres de sopa de chocolate em pó",
      "1 colher de sopa de manteiga",
      "Chocolate granulado para decorar"
    ],
    instructions: [
      "Em uma panela, misture o leite condensado, chocolate em pó e manteiga",
      "Cozinhe em fogo médio, mexendo sempre, até desgrudar do fundo da panela",
      "Deixe esfriar completamente",
      "Faça bolinhas com as mãos untadas com manteiga",
      "Passe no chocolate granulado e sirva em forminhas"
    ],
    authorId: "user-2",
    authorName: "Patrícia Confeiteira",
    category: "Sobremesa",
    rating: 4.9,
    ratingsCount: 203
  },
  {
    id: "3",
    name: "Moqueca de Peixe",
    description: "Delicioso ensopado de peixe com leite de coco, azeite de dendê e temperos típicos da culinária baiana.",
    imagePrompt: "Traditional Brazilian moqueca in clay pot",
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "800g de peixe (badejo ou robalo)",
      "400ml de leite de coco",
      "3 tomates maduros",
      "1 cebola grande",
      "1 pimentão vermelho",
      "Coentro fresco",
      "Azeite de dendê",
      "Limão, sal e pimenta"
    ],
    instructions: [
      "Tempere o peixe com limão, sal e pimenta",
      "Em uma panela de barro, faça camadas de cebola, tomate e pimentão",
      "Adicione o peixe por cima",
      "Despeje o leite de coco e o azeite de dendê",
      "Cozinhe em fogo baixo por 20 minutos",
      "Finalize com coentro fresco e sirva com arroz"
    ],
    authorId: "user-1",
    authorName: "Chef Maria Silva",
    category: "Prato Principal",
    rating: 4.7,
    ratingsCount: 89
  },
  {
    id: "4",
    name: "Pão de Queijo",
    description: "Tradicional quitute mineiro, crocante por fora e macio por dentro, perfeito para o café da manhã.",
    imagePrompt: "Golden cheese bread rolls from Brazil",
    imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "500g de polvilho azedo",
      "250ml de leite",
      "100ml de óleo",
      "2 ovos",
      "200g de queijo minas ralado",
      "1 colher de chá de sal"
    ],
    instructions: [
      "Ferva o leite com óleo e sal",
      "Despeje sobre o polvilho e misture bem",
      "Deixe esfriar um pouco e adicione os ovos",
      "Acrescente o queijo ralado e misture",
      "Faça bolinhas e coloque em forma untada",
      "Asse em forno pré-aquecido a 180°C por 25 minutos"
    ],
    authorId: "user-3",
    authorName: "Ana Padeira",
    category: "Lanche",
    rating: 4.9,
    ratingsCount: 342
  },
  {
    id: "5",
    name: "Caipirinha Tradicional",
    description: "O coquetel mais famoso do Brasil, refrescante e perfeito para celebrações.",
    imagePrompt: "Fresh Brazilian caipirinha with lime",
    imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "1 limão tahiti",
      "2 colheres de sopa de açúcar",
      "50ml de cachaça",
      "Gelo picado"
    ],
    instructions: [
      "Corte o limão em rodelas",
      "Coloque o limão e o açúcar em um copo",
      "Macere bem com um pilão",
      "Adicione o gelo picado",
      "Despeje a cachaça e misture",
      "Sirva imediatamente"
    ],
    authorId: "user-4",
    authorName: "Bartender João",
    category: "Bebida",
    rating: 4.6,
    ratingsCount: 178
  },
  {
    id: "6",
    name: "Acarajé",
    description: "Bolinho de feijão fradinho frito no azeite de dendê, recheado com vatapá, caruru e camarão.",
    imagePrompt: "Traditional Brazilian acarajé with toppings",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "500g de feijão fradinho",
      "1 cebola",
      "Sal a gosto",
      "Azeite de dendê para fritar",
      "Camarão seco",
      "Vatapá",
      "Molho de pimenta"
    ],
    instructions: [
      "Deixe o feijão de molho por 12 horas",
      "Retire a casca dos grãos",
      "Bata no liquidificador com cebola e sal",
      "Frite os bolinhos em azeite de dendê quente",
      "Abra os bolinhos e recheie com vatapá, caruru e camarão",
      "Finalize com molho de pimenta"
    ],
    authorId: "user-1",
    authorName: "Chef Maria Silva",
    category: "Entrada",
    rating: 4.8,
    ratingsCount: 124
  },
  {
    id: "7",
    name: "Pudim de Leite Condensado",
    description: "Sobremesa cremosa e suave com calda de caramelo, um clássico das festas brasileiras.",
    imagePrompt: "Creamy Brazilian flan with caramel sauce",
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "1 lata de leite condensado",
      "2 medidas (da lata) de leite",
      "3 ovos",
      "1 xícara de açúcar (para a calda)"
    ],
    instructions: [
      "Faça a calda de caramelo derretendo o açúcar em uma forma",
      "No liquidificador, bata o leite condensado, leite e ovos",
      "Despeje a mistura sobre a calda",
      "Asse em banho-maria em forno médio por 50 minutos",
      "Deixe esfriar e desenforme",
      "Leve à geladeira por pelo menos 3 horas"
    ],
    authorId: "user-2",
    authorName: "Patrícia Confeiteira",
    category: "Sobremesa",
    rating: 4.9,
    ratingsCount: 267
  },
  {
    id: "8",
    name: "Coxinha de Frango",
    description: "Salgado tradicional brasileiro em formato de gota, com massa macia e recheio cremoso de frango.",
    imagePrompt: "Golden fried Brazilian coxinhas",
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "500g de peito de frango",
      "3 xícaras de farinha de trigo",
      "2 xícaras de caldo de frango",
      "1 cebola",
      "2 dentes de alho",
      "Farinha de rosca",
      "2 ovos para empanar"
    ],
    instructions: [
      "Cozinhe e desfi o frango, refogue com cebola e alho",
      "Ferva o caldo de frango e adicione a farinha aos poucos",
      "Mexa até formar uma massa lisa",
      "Deixe esfriar e modele as coxinhas com o recheio",
      "Passe no ovo batido e na farinha de rosca",
      "Frite em óleo quente até dourar"
    ],
    authorId: "user-3",
    authorName: "Ana Padeira",
    category: "Lanche",
    rating: 4.7,
    ratingsCount: 198
  }
];
