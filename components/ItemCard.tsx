import React, { useState, useMemo } from 'react';
import { Item, ItemType } from '../types';
import { COLOR_MAP } from '../constants';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onUpdate: (item: Item) => void;
  activeColorFilter: string;
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

// Helper function to determine if a color is too light for a shadow
const getColorBrightness = (color: { r: number; g: number; b: number }): number => {
  return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
};


const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onUpdate, activeColorFilter }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    // Prevent flipping if a button or its child element was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleIncrementUsage = () => {
    onUpdate({ ...item, usageCount: item.usageCount + 1 });
  };
  
  const shadowStyle = useMemo(() => {
    const itemColorHex = COLOR_MAP[item.color[0]] || '#cccccc';
    const rgb = hexToRgb(itemColorHex);

    if (rgb && getColorBrightness(rgb) < 230) { // Don't apply color shadow for very light colors
      const glowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
      return { boxShadow: `0 10px 15px -3px ${glowColor}, 0 4px 6px -2px ${glowColor}` };
    }
    return {}; // Fallback to default shadow from className
  }, [item.color]);

  const glowStyle = useMemo(() => {
    if (activeColorFilter !== 'all' && item.color.includes(activeColorFilter)) {
      const itemColorHex = COLOR_MAP[activeColorFilter] || '#cccccc';
      const rgb = hexToRgb(itemColorHex);
      if (rgb) {
        const glowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
        return { boxShadow: `0 0 20px 5px ${glowColor}` };
      }
    }
    return {};
  }, [activeColorFilter, item.color]);

  const costBasis = item.purchasePrice ?? item.price;
  const costPerWear = item.usageCount > 0 ? (costBasis / item.usageCount).toFixed(2) : costBasis.toFixed(2);


  return (
    <div className="w-full max-w-[280px] h-[420px] [perspective:1000px] group mx-auto">
      <div
        className={`relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        style={glowStyle}
      >
        {/* FRONT FACE */}
        <div 
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-lg cursor-pointer"
          style={shadowStyle}
          onClick={handleFlip}
        >
          <div className="relative h-full">
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
             {item.isSold && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">VERKAUFT</div>
            )}
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{item.usageCount}</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-white text-xl font-bold">{item.name}</h3>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div 
            className="absolute inset-0 h-full w-full rounded-xl bg-zinc-800 text-white [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col p-4"
            onClick={handleFlip}
        >
            <div className="flex-grow overflow-y-auto pr-2 space-y-2 text-sm">
                <h3 className="text-xl font-bold text-brand-pink mb-2 text-center">{item.name}</h3>
                <div className="flex justify-between border-b border-zinc-600 pb-1"><span>Typ:</span> <span>{item.type}</span></div>
                {![ItemType.Henkel, ItemType.Accessoire].includes(item.type) && <div className="flex justify-between border-b border-zinc-600 pb-1"><span>Form:</span> <span>{item.shape}</span></div>}
                <div className="flex justify-between items-start border-b border-zinc-600 pb-1">
                    <span>Farbe:</span>
                    <div className="flex flex-col items-end gap-1 max-w-[60%] text-right">
                        {item.color.map(c => (
                            <div key={c} className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full border border-zinc-500 flex-shrink-0" style={{ backgroundColor: COLOR_MAP[c] }}></span>
                                <span>{c}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {item.type !== ItemType.Kombination && (
                    <>
                        <div className="flex justify-between border-b border-zinc-600 pb-1"><span>Originalpreis:</span> <span>€{item.price.toFixed(2)}</span></div>
                        {item.purchasePrice && <div className="flex justify-between border-b border-zinc-600 pb-1"><span>Kaufpreis:</span> <span>€{item.purchasePrice.toFixed(2)}</span></div>}
                        {item.isSold && item.sellingPrice && (
                            <div className="flex justify-between border-b border-green-400 text-green-400 pb-1 font-semibold"><span>Verkaufspreis:</span> <span>€{item.sellingPrice.toFixed(2)}</span></div>
                        )}
                        <div className="flex justify-between border-b border-zinc-600 pb-1"><span>Kosten/Tragen:</span> <span>€{costPerWear}</span></div>
                    </>
                )}
                <div className="flex justify-between border-b border-zinc-600 pb-1"><span>Getragen:</span> <span>{item.usageCount} Mal</span></div>

                {item.notes && (
                    <div className="pt-2">
                        <p className="font-semibold text-brand-pink">Notizen:</p>
                        <p className="text-zinc-300 bg-zinc-700 p-2 rounded-md text-xs"><em>{item.notes}</em></p>
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 pt-3 mt-auto border-t border-zinc-600 flex items-center justify-between gap-2">
                <button onClick={() => onEdit(item)} className="flex-grow px-3 py-2 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-zinc-500 transition-colors">Bearbeiten</button>
                <button onClick={handleIncrementUsage} className="flex-shrink-0 p-2 bg-brand-pink text-brand-text rounded-md hover:bg-brand-pink-dark transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;