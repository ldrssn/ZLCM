import { Item, ItemType, ItemShape } from './types';

export const COLORS = [
  'Rot', 'Grün', 'Blau', 'Gelb', 'Orange', 'Lila', 'Pink',
  'Braun', 'Schwarz', 'Weiß', 'Grau', 'Türkis', 'Marineblau',
  'Lindgrün', 'Bordeaux', 'Beige', 'Senfgelb', 'Altrosa',
  'Mintgrün', 'Lavendel'
];

export const COLOR_MAP: { [key: string]: string } = {
  'Rot': '#ef4444',
  'Grün': '#22c55e',
  'Blau': '#3b82f6',
  'Gelb': '#eab308',
  'Orange': '#f97316',
  'Lila': '#a855f7',
  'Pink': '#ec4899',
  'Braun': '#854d0e',
  'Schwarz': '#18181b',
  'Weiß': '#ffffff',
  'Grau': '#6b7280',
  'Türkis': '#14b8a6',
  'Marineblau': '#064e3b',
  'Lindgrün': '#a3e635',
  'Bordeaux': '#881337',
  'Beige': '#f5f5d4',
  'Senfgelb': '#d97706',
  'Altrosa': '#E6C5C5',
  'Mintgrün': '#6ee7b7',
  'Lavendel': '#c4b5fd',
};

// Generates a placeholder image URL
const getPlaceholder = (type: string, color: string, text: string) => `https://placehold.co/280x256/${color.substring(1)}/333333?text=${encodeURIComponent(type)}\\n${text}`;

export const SAMPLE_ITEMS: Item[] = [
  { id: '1', name: 'Rote Verführung', photo: getPlaceholder('Klappe', COLOR_MAP['Rot'], 'Rote Verführung'), type: ItemType.Klappe, shape: ItemShape.Square, color: 'Rot', price: 125.00, purchasePrice: 125.00, usageCount: 5, isSold: false, notes: 'Passt gut zu schwarzen Taschen.' },
  { id: '2', name: 'Grüne Oase', photo: getPlaceholder('Henkel', COLOR_MAP['Grün'], 'Grüne Oase'), type: ItemType.Henkel, shape: ItemShape.Rund, color: 'Grün', price: 75.50, purchasePrice: 70.00, usageCount: 12, isSold: false },
  { id: '3', name: 'Blauer Ozean', photo: getPlaceholder('Körper', COLOR_MAP['Blau'], 'Blauer Ozean'), type: ItemType.Körper, shape: ItemShape.Square, color: 'Blau', price: 280.00, usageCount: 2, isSold: true, sellingPrice: 250.00, notes: 'Verkauft an eine Freundin.' },
  { id: '4', name: 'Sonnengelb', photo: getPlaceholder('Klappe', COLOR_MAP['Gelb'], 'Sonnengelb'), type: ItemType.Klappe, shape: ItemShape.Rund, color: 'Gelb', price: 110.00, usageCount: 20, isSold: false },
  { id: '5', name: 'Orangen-Akzent', photo: getPlaceholder('Henkel', COLOR_MAP['Orange'], 'Orangen-Akzent'), type: ItemType.Henkel, shape: ItemShape.Square, color: 'Orange', price: 65.00, purchasePrice: 50.00, usageCount: 8, isSold: false },
  { id: '6', name: 'Lila Traum', photo: getPlaceholder('Körper', COLOR_MAP['Lila'], 'Lila Traum'), type: ItemType.Körper, shape: ItemShape.Rund, color: 'Lila', price: 300.00, usageCount: 1, isSold: false },
  { id: '7', name: 'Pretty in Pink', photo: getPlaceholder('Klappe', COLOR_MAP['Pink'], 'Pretty in Pink'), type: ItemType.Klappe, shape: ItemShape.Square, color: 'Pink', price: 130.00, usageCount: 15, isSold: false },
  { id: '8', name: 'Erdige Töne', photo: getPlaceholder('Körper', COLOR_MAP['Braun'], 'Erdige Töne'), type: ItemType.Körper, shape: ItemShape.Square, color: 'Braun', price: 260.00, usageCount: 18, isSold: true, sellingPrice: 260.00 },
  { id: '9', name: 'Schwarze Eleganz', photo: getPlaceholder('Klappe', COLOR_MAP['Schwarz'], 'Schwarze Eleganz'), type: ItemType.Klappe, shape: ItemShape.Rund, color: 'Schwarz', price: 150.00, usageCount: 30, isSold: false },
  { id: '10', name: 'Schneeweiß', photo: getPlaceholder('Henkel', COLOR_MAP['Weiß'], 'Schneeweiß'), type: ItemType.Henkel, shape: ItemShape.Rund, color: 'Weiß', price: 80.00, usageCount: 4, isSold: false },
  { id: '11', name: 'Graue Maus', photo: getPlaceholder('Körper', COLOR_MAP['Grau'], 'Graue Maus'), type: ItemType.Körper, shape: ItemShape.Square, color: 'Grau', price: 240.00, usageCount: 7, isSold: false },
  { id: '12', name: 'Türkis-Tupfer', photo: getPlaceholder('Klappe', COLOR_MAP['Türkis'], 'Türkis-Tupfer'), type: ItemType.Klappe, shape: ItemShape.Square, color: 'Türkis', price: 115.00, usageCount: 9, isSold: false },
  { id: '13', name: 'Marine-Look', photo: getPlaceholder('Henkel', COLOR_MAP['Marineblau'], 'Marine-Look'), type: ItemType.Henkel, shape: ItemShape.Rund, color: 'Marineblau', price: 90.00, usageCount: 6, isSold: false },
  { id: '14', name: 'Lindgrüner Frosch', photo: getPlaceholder('Klappe', COLOR_MAP['Lindgrün'], 'Lindgrüner Frosch'), type: ItemType.Klappe, shape: ItemShape.Rund, color: 'Lindgrün', price: 105.00, purchasePrice: 105.00, usageCount: 3, isSold: false },
  { id: '15', name: 'Bordeaux-Rot', photo: getPlaceholder('Körper', COLOR_MAP['Bordeaux'], 'Bordeaux-Rot'), type: ItemType.Körper, shape: ItemShape.Square, color: 'Bordeaux', price: 320.00, usageCount: 1, isSold: false },
  { id: '16', name: 'Beige Basic', photo: getPlaceholder('Henkel', COLOR_MAP['Beige'], 'Beige Basic'), type: ItemType.Henkel, shape: ItemShape.Square, color: 'Beige', price: 70.00, usageCount: 25, isSold: false },
  { id: '17', name: 'Senfgelber Herbst', photo: getPlaceholder('Klappe', COLOR_MAP['Senfgelb'], 'Senfgelber Herbst'), type: ItemType.Klappe, shape: ItemShape.Square, color: 'Senfgelb', price: 120.00, usageCount: 11, isSold: true, sellingPrice: 100.00, notes: 'Geringe Gebrauchsspuren.' },
  { id: '18', name: 'Zartes Altrosa', photo: getPlaceholder('Körper', COLOR_MAP['Altrosa'], 'Zartes Altrosa'), type: ItemType.Körper, shape: ItemShape.Rund, color: 'Altrosa', price: 275.00, usageCount: 14, isSold: false },
  { id: '19', name: 'Frische Minze', photo: getPlaceholder('Henkel', COLOR_MAP['Mintgrün'], 'Frische Minze'), type: ItemType.Henkel, shape: ItemShape.Rund, color: 'Mintgrün', price: 85.00, usageCount: 13, isSold: false },
  { id: '20', name: 'Lavendel-Feld', photo: getPlaceholder('Klappe', COLOR_MAP['Lavendel'], 'Lavendel-Feld'), type: ItemType.Klappe, shape: ItemShape.Rund, color: 'Lavendel', price: 140.00, usageCount: 16, isSold: false },
  { id: '21', name: 'Goldkette', photo: getPlaceholder('Accessoire', COLOR_MAP['Gelb'], 'Goldkette'), type: ItemType.Accessoire, shape: ItemShape.Square, color: 'Gelb', price: 95.00, usageCount: 10, isSold: false },
  { id: '22', name: 'Taschen-Anhänger', photo: getPlaceholder('Accessoire', COLOR_MAP['Pink'], 'Anhänger'), type: ItemType.Accessoire, shape: ItemShape.Rund, color: 'Pink', price: 45.00, usageCount: 22, isSold: false },
];