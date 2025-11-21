import { Item, ItemType, ItemShape } from './types';

export const COLORS = [
  'Schwarz', 'Weiß', 'Grau', 'Silber', 'Gold',
  'Taupe', 'Creme', 'Nude', 'Braun', 'Cognac',
  'Gelb', 'Orange',
  'Fuchsia', 'Violett', 'Flieder', 'Rosa', 'Rot', 'Bordeaux',
  'Hellblau', 'Blau', 'Marineblau',
  'Hellgrün', 'Grün', 'Waldgrün',
  'Mint', 'Türkis', 'Petrol'
];

export const COLOR_MAP: { [key: string]: string } = {
  'Schwarz': '#000000',
  'Weiß': '#ffffff',
  'Grau': '#5b5b5b',
  'Silber': '#C0C0C0',
  'Gold': '#fed889',
  'Taupe': '#887e76',
  'Creme': '#ece1cd',
  'Nude': '#debba5',
  'Braun': '#783f04',
  'Cognac': '#c17f4a',
  'Gelb': '#ffd966',
  'Orange': '#e69138',
  'Fuchsia': '#c90076',
  'Violett': '#6a329f',
  'Flieder': '#b4a7d6',
  'Rosa': '#ead1dc',
  'Rot': '#A52A2A',
  'Bordeaux': '#660000',
  'Hellblau': '#cfe2f3',
  'Blau': '#2986cc',
  'Marineblau': '#073763',
  'Hellgrün': '#8fce00',
  'Grün': '#38761d',
  'Waldgrün': '#1f3f0f',
  'Mint': '#97ead1',
  'Türkis': '#8af0fb',
  'Petrol': '#134f5c',
};

// Generates a placeholder image URL
export const getPlaceholder = (type: string, color: string, text: string) => `https://placehold.co/280x256/${color.substring(1)}/333333?text=${encodeURIComponent(type)}\\n${text}`;

export const SAMPLE_ITEMS: Item[] = [
  { id: '1', name: 'Rote Verführung', photo: getPlaceholder('Klappe', COLOR_MAP['Rot'], 'Rote Verführung'), type: ItemType.Klappe, shape: ItemShape.Square, color: ['Rot'], price: 125.00, purchasePrice: 125.00, usageCount: 5, isSold: false, notes: 'Passt gut zu schwarzen Taschen.' },
  { id: '2', name: 'Grüne Oase', photo: getPlaceholder('Henkel', COLOR_MAP['Grün'], 'Grüne Oase'), type: ItemType.Henkel, shape: ItemShape.Rund, color: ['Grün'], price: 75.50, purchasePrice: 70.00, usageCount: 12, isSold: false },
  { id: '3', name: 'Blauer Ozean', photo: getPlaceholder('Körper', COLOR_MAP['Blau'], 'Blauer Ozean'), type: ItemType.Körper, shape: ItemShape.Square, color: ['Blau'], price: 280.00, usageCount: 2, isSold: true, sellingPrice: 250.00, notes: 'Verkauft an eine Freundin.' },
  { id: '4', name: 'Sonnengelb', photo: getPlaceholder('Klappe', COLOR_MAP['Gelb'], 'Sonnengelb'), type: ItemType.Klappe, shape: ItemShape.Rund, color: ['Gelb'], price: 110.00, usageCount: 20, isSold: false },
  { id: '5', name: 'Orangen-Akzent', photo: getPlaceholder('Henkel', COLOR_MAP['Orange'], 'Orangen-Akzent'), type: ItemType.Henkel, shape: ItemShape.Square, color: ['Orange'], price: 65.00, purchasePrice: 50.00, usageCount: 8, isSold: false },
  { id: '6', name: 'Lila Traum', photo: getPlaceholder('Körper', COLOR_MAP['Violett'], 'Lila Traum'), type: ItemType.Körper, shape: ItemShape.Rund, color: ['Violett'], price: 300.00, usageCount: 1, isSold: false },
  { id: '7', name: 'Pretty in Pink', photo: getPlaceholder('Klappe', COLOR_MAP['Rosa'], 'Pretty in Pink'), type: ItemType.Klappe, shape: ItemShape.Square, color: ['Rosa'], price: 130.00, usageCount: 15, isSold: false },
  { id: '8', name: 'Erdige Töne', photo: getPlaceholder('Körper', COLOR_MAP['Braun'], 'Erdige Töne'), type: ItemType.Körper, shape: ItemShape.Square, color: ['Braun'], price: 260.00, usageCount: 18, isSold: true, sellingPrice: 260.00 },
  { id: '9', name: 'Schwarze Eleganz', photo: getPlaceholder('Klappe', COLOR_MAP['Schwarz'], 'Schwarze Eleganz'), type: ItemType.Klappe, shape: ItemShape.Rund, color: ['Schwarz'], price: 150.00, usageCount: 30, isSold: false },
  { id: '10', name: 'Schneeweiß', photo: getPlaceholder('Henkel', COLOR_MAP['Weiß'], 'Schneeweiß'), type: ItemType.Henkel, shape: ItemShape.Rund, color: ['Weiß'], price: 80.00, usageCount: 4, isSold: false },
  { id: '11', name: 'Graue Maus', photo: getPlaceholder('Körper', COLOR_MAP['Grau'], 'Graue Maus'), type: ItemType.Körper, shape: ItemShape.Square, color: ['Grau'], price: 240.00, usageCount: 7, isSold: false },
  { id: '12', name: 'Türkis-Tupfer', photo: getPlaceholder('Klappe', COLOR_MAP['Türkis'], 'Türkis-Tupfer'), type: ItemType.Klappe, shape: ItemShape.Square, color: ['Türkis'], price: 115.00, usageCount: 9, isSold: false },
  { id: '13', name: 'Marine-Look', photo: getPlaceholder('Henkel', COLOR_MAP['Marineblau'], 'Marine-Look'), type: ItemType.Henkel, shape: ItemShape.Rund, color: ['Marineblau'], price: 90.00, usageCount: 6, isSold: false },
  { id: '14', name: 'Lindgrüner Frosch', photo: getPlaceholder('Klappe', COLOR_MAP['Hellgrün'], 'Lindgrüner Frosch'), type: ItemType.Klappe, shape: ItemShape.Rund, color: ['Hellgrün'], price: 105.00, purchasePrice: 105.00, usageCount: 3, isSold: false },
  { id: '15', name: 'Bordeaux-Rot', photo: getPlaceholder('Körper', COLOR_MAP['Bordeaux'], 'Bordeaux-Rot'), type: ItemType.Körper, shape: ItemShape.Square, color: ['Bordeaux'], price: 320.00, usageCount: 1, isSold: false },
  { id: '16', name: 'Creme Classic', photo: getPlaceholder('Henkel', COLOR_MAP['Creme'], 'Creme Classic'), type: ItemType.Henkel, shape: ItemShape.Square, color: ['Creme'], price: 70.00, usageCount: 25, isSold: false },
  { id: '17', name: 'Senfgelber Herbst', photo: getPlaceholder('Klappe', COLOR_MAP['Gelb'], 'Senfgelber Herbst'), type: ItemType.Klappe, shape: ItemShape.Square, color: ['Gelb'], price: 120.00, usageCount: 11, isSold: true, sellingPrice: 100.00, notes: 'Geringe Gebrauchsspuren.' },
  { id: '18', name: 'Zartes Altrosa', photo: getPlaceholder('Körper', COLOR_MAP['Rosa'], 'Zartes Altrosa'), type: ItemType.Körper, shape: ItemShape.Rund, color: ['Rosa'], price: 275.00, usageCount: 14, isSold: false },
  { id: '19', name: 'Frische Minze', photo: getPlaceholder('Henkel', COLOR_MAP['Mint'], 'Frische Minze'), type: ItemType.Henkel, shape: ItemShape.Rund, color: ['Mint'], price: 85.00, usageCount: 13, isSold: false },
  { id: '20', name: 'Lavendel-Feld', photo: getPlaceholder('Klappe', COLOR_MAP['Flieder'], 'Lavendel-Feld'), type: ItemType.Klappe, shape: ItemShape.Rund, color: ['Flieder'], price: 140.00, usageCount: 16, isSold: false },
  { id: '21', name: 'Goldkette', photo: getPlaceholder('Accessoire', COLOR_MAP['Gold'], 'Goldkette'), type: ItemType.Accessoire, shape: ItemShape.Square, color: ['Gold'], price: 95.00, usageCount: 10, isSold: false },
  { id: '22', name: 'Taschen-Anhänger', photo: getPlaceholder('Accessoire', COLOR_MAP['Fuchsia'], 'Anhänger'), type: ItemType.Accessoire, shape: ItemShape.Rund, color: ['Fuchsia'], price: 45.00, usageCount: 22, isSold: false },
  { id: '23', name: 'Klassik S&W', photo: getPlaceholder('Kombi', COLOR_MAP['Schwarz'], 'Klassik S&W'), type: ItemType.Kombination, shape: ItemShape.Square, color: ['Schwarz', 'Weiß'], price: 0, usageCount: 8, isSold: false, notes: 'Meine Go-To Kombination für schicke Anlässe.' },
  { id: '24', name: 'Herbst-Look', photo: getPlaceholder('Kombi', COLOR_MAP['Braun'], 'Herbst-Look'), type: ItemType.Kombination, shape: ItemShape.Square, color: ['Braun', 'Cognac', 'Orange'], price: 0, usageCount: 3, isSold: false, notes: 'Eine schöne Kombination für den Herbst.' },
];