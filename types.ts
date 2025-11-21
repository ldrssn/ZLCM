// FIX: Removed circular import that was causing declaration conflicts. A file should not import from itself.

export enum ItemType {
  Klappe = 'Klappe',
  Henkel = 'Henkel',
  Körper = 'Körper',
  Accessoire = 'Accessoire',
  Kombination = 'Kombination',
}

export enum ItemShape {
  Square = 'Square',
  Rund = 'Rund',
}

export interface Item {
  id: string;
  name: string;
  photo: string;
  type: ItemType;
  shape: ItemShape;
  color: string[];
  price: number;
  purchasePrice?: number;
  usageCount: number;
  isSold: boolean;
  sellingPrice?: number;
  notes?: string;
}

export interface Filters {
  type: 'all' | ItemType;
  shape: 'all' | ItemShape;
  color: 'all' | string;
  soldStatus: 'all' | 'sold' | 'in_collection';
}

export enum SortBy {
  Name = 'name',
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  Usage = 'usage',
}