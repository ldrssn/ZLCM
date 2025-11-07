import React, { useState, useEffect } from 'react';
import { Item, ItemType, ItemShape } from '../types';
import { COLORS } from '../constants';
import { generateUUID } from '../services/utils';

interface ItemFormProps {
  onAddItem: (item: Item) => void;
  onUpdateItem: (item: Item) => void;
  onClose: () => void;
  initialData?: Item | null;
}

const AddItemForm: React.FC<ItemFormProps> = ({ onAddItem, onUpdateItem, onClose, initialData }) => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [type, setType] = useState<ItemType>(ItemType.Klappe);
  const [shape, setShape] = useState<ItemShape>(ItemShape.Square);
  const [color, setColor] = useState(COLORS[0]);
  const [price, setPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [usageCount, setUsageCount] = useState('');
  const [isSold, setIsSold] = useState(false);
  const [sellingPrice, setSellingPrice] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhoto(initialData.photo);
      setType(initialData.type);
      setShape(initialData.shape);
      setColor(initialData.color);
      setPrice(String(initialData.price));
      setPurchasePrice(initialData.purchasePrice ? String(initialData.purchasePrice) : '');
      setUsageCount(String(initialData.usageCount));
      setIsSold(initialData.isSold);
      setSellingPrice(initialData.sellingPrice ? String(initialData.sellingPrice) : '');
      setNotes(initialData.notes || '');
    } else {
      // Reset form for "add new" mode
      setName('');
      setPhoto(null);
      setType(ItemType.Klappe);
      setShape(ItemShape.Square);
      setColor(COLORS[0]);
      setPrice('');
      setPurchasePrice('');
      setUsageCount('');
      setIsSold(false);
      setSellingPrice('');
      setNotes('');
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !photo) {
      alert('Bitte geben Sie einen Namen an und laden Sie ein Bild hoch.');
      return;
    }
    
    if (isSold && (!sellingPrice || parseFloat(sellingPrice) <= 0)) {
        alert('Bitte geben Sie einen gültigen Verkaufspreis an.');
        return;
    }

    const itemData = {
        name,
        photo,
        type,
        shape,
        color,
        price: parseFloat(price) || 0,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        usageCount: parseInt(usageCount, 10) || 0,
        isSold,
        sellingPrice: isSold ? parseFloat(sellingPrice) : undefined,
        notes,
    };

    if (initialData) {
      const updatedItem: Item = {
        ...initialData,
        ...itemData,
      };
      onUpdateItem(updatedItem);
    } else {
        const newItem: Item = {
        id: generateUUID(),
        ...itemData,
      };
      onAddItem(newItem);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm" required />
      </div>
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
        <input type="file" id="photo" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-brand-pink hover:file:bg-rose-100" />
        {photo && <img src={photo} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />}
      </div>
      <div className={`grid grid-cols-1 ${![ItemType.Henkel, ItemType.Accessoire].includes(type) ? 'md:grid-cols-2' : ''} gap-4`}>
        <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as ItemType)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm">
                {Object.values(ItemType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
        {![ItemType.Henkel, ItemType.Accessoire].includes(type) && (
            <div>
                <label htmlFor="shape" className="block text-sm font-medium text-gray-700">Shape</label>
                <select id="shape" value={shape} onChange={(e) => setShape(e.target.value as ItemShape)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm">
                    {Object.values(ItemShape).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        )}
      </div>
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
        <select id="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm">
          {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Originalpreis (€)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm" />
        </div>
        <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Kaufpreis (€)</label>
            <input type="number" id="purchasePrice" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="usageCount" className="block text-sm font-medium text-gray-700">Times Worn</label>
        <input type="number" id="usageCount" value={usageCount} onChange={(e) => setUsageCount(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm" />
      </div>
      <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notizen</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm"></textarea>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center">
            <input
                id="isSold"
                type="checkbox"
                checked={isSold}
                onChange={(e) => setIsSold(e.target.checked)}
                className="h-4 w-4 text-brand-pink border-gray-300 rounded focus:ring-brand-pink"
            />
            <label htmlFor="isSold" className="ml-2 block text-sm font-medium text-gray-900">
                Als verkauft markieren
            </label>
        </div>
        {isSold && (
             <div className="mt-4">
                <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">Verkaufspreis (€)</label>
                <input type="number" id="sellingPrice" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm" required />
            </div>
        )}
      </div>
      <div className="flex justify-end pt-4">
        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark mr-3">Cancel</button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark">
          {initialData ? 'Änderungen speichern' : 'Teil hinzufügen'}
        </button>
      </div>
    </form>
  );
};

export default AddItemForm;