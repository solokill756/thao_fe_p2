import prisma from '../prisma';
import { Category } from '../types/tourTypes';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const categories = await prisma.category.findMany();
    return categories.map((category) => ({
      category_id: category.category_id,
      name: category.name,
      description: category.description,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
