export interface CategoryBase {
  name: string;
  description?: string | null;
  icon?: string | null;
}

export interface Category extends CategoryBase {
  id: number;
}

export type CategoryCreate = CategoryBase;

export type CategoryUpdate = Partial<CategoryBase>;
