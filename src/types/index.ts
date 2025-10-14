export interface Recipe {
  id: string;
  name: string;
  description: string;
  imagePrompt: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  authorId: string;
  authorName: string;
  category: string;
  rating: number;
  ratingsCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
