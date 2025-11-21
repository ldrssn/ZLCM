import React, { useState, useMemo } from 'react';
import { Item, ItemType, ItemShape } from '../types';
import { generateUUID } from '../services/utils';
import { getPlaceholder, COLOR_MAP } from '../constants';

interface KombiBuilderProps {
  items: Item[];
  onAddKombination: (item: Item) => void;
  onClose: () => void;
}

const SelectionCard: React.FC<{ item: Item; isSelected: boolean; onClick: () => void }> = ({ item, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 transform ${isSelected ? 'border-brand-pink scale-105 shadow-lg' : 'border-transparent hover:shadow-md hover:-translate-y-1'}`}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
    >
        <img src={item.photo} alt={item.name} className="w-full aspect-square object-cover" />
        <p className="text-center p-1 text-xs sm:p-2 sm:text-sm font-semibold truncate bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200">{item.name}</p>
    </div>
);

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number; }> = ({ currentStep, totalSteps }) => (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            return (
                <div key={step} className="flex items-center">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-base transition-colors ${
                        isActive ? 'bg-brand-pink text-brand-text' : 
                        isCompleted ? 'bg-green-500 text-white' : 
                        'bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400'
                    }`}>
                        {isCompleted ? '✓' : step}
                    </div>
                    {step < totalSteps && <div className="w-4 sm:w-8 h-px bg-gray-200 dark:bg-zinc-600 mx-1 sm:mx-2"></div>}
                </div>
            );
        })}
    </div>
);

const KombiBuilder: React.FC<KombiBuilderProps> = ({ items, onAddKombination, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedBody, setSelectedBody] = useState<Item | null>(null);
    const [selectedFlap, setSelectedFlap] = useState<Item | null>(null);
    const [selectedHandle, setSelectedHandle] = useState<Item | null>(null);
    const [kombinationName, setKombinationName] = useState('');
    const [kombinationPhoto, setKombinationPhoto] = useState<string | null>(null);

    const availableBodies = useMemo(() => items.filter(i => i.type === ItemType.Körper && !i.isSold), [items]);
    const availableFlaps = useMemo(() => {
        if (!selectedBody) return [];
        return items.filter(i => i.type === ItemType.Klappe && !i.isSold && i.shape === selectedBody.shape);
    }, [items, selectedBody]);
    const availableHandles = useMemo(() => items.filter(i => i.type === ItemType.Henkel && !i.isSold), [items]);

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);
    
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setKombinationPhoto(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kombinationName.trim()) {
            alert("Bitte geben Sie der Kombination einen Namen.");
            return;
        }
        if (!selectedBody || !selectedFlap || !selectedHandle) return;

        const notes = `Kombination aus:\n- ${selectedBody.name} (Körper)\n- ${selectedFlap.name} (Klappe)\n- ${selectedHandle.name} (Henkel)`;
        const combinedColors = [...new Set([...selectedBody.color, ...selectedFlap.color, ...selectedHandle.color])];
        const finalPhoto = kombinationPhoto || getPlaceholder('Kombi', COLOR_MAP['Grau'], kombinationName.trim());

        const newKombination: Item = {
            id: generateUUID(),
            name: kombinationName.trim(),
            photo: finalPhoto,
            type: ItemType.Kombination,
            shape: selectedBody.shape,
            color: combinedColors,
            price: 0,
            purchasePrice: 0,
            usageCount: 0,
            isSold: false,
            notes,
        };

        onAddKombination(newKombination);
        onClose();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 1: Wähle einen Körper</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2">
                            {availableBodies.map(item => <SelectionCard key={item.id} item={item} isSelected={selectedBody?.id === item.id} onClick={() => setSelectedBody(item)} />)}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 2: Wähle eine passende Klappe ({selectedBody?.shape})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2">
                            {availableFlaps.map(item => <SelectionCard key={item.id} item={item} isSelected={selectedFlap?.id === item.id} onClick={() => setSelectedFlap(item)} />)}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 3: Wähle einen Henkel</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2">
                            {availableHandles.map(item => <SelectionCard key={item.id} item={item} isSelected={selectedHandle?.id === item.id} onClick={() => setSelectedHandle(item)} />)}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 4: Kombination benennen & speichern</h3>
                        <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                            {[selectedBody, selectedFlap, selectedHandle].map(item => item && (
                                <div key={item.id}>
                                    <img src={item.photo} alt={item.name} className="rounded-lg aspect-square object-cover" />
                                    <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 truncate">{item.name}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label htmlFor="kombi-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name der Kombination</label>
                                <input type="text" id="kombi-name" value={kombinationName} onChange={(e) => setKombinationName(e.target.value)} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="kombi-photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto (optional)</label>
                                <input type="file" id="kombi-photo" onChange={handlePhotoChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 dark:file:bg-zinc-600 file:text-brand-pink dark:file:text-brand-pink-dark hover:file:bg-rose-100 dark:hover:file:bg-zinc-500" />
                                {kombinationPhoto && <img src={kombinationPhoto} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />}
                            </div>
                        </form>
                    </div>
                );
            default: return null;
        }
    };
    
    const isNextDisabled = () => {
        if (currentStep === 1 && !selectedBody) return true;
        if (currentStep === 2 && !selectedFlap) return true;
        if (currentStep === 3 && !selectedHandle) return true;
        return false;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 pt-4">
                 <StepIndicator currentStep={currentStep} totalSteps={4} />
            </div>
            <div className="flex-grow overflow-y-auto py-4">
                {renderStepContent()}
            </div>
            <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t dark:border-zinc-700">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="bg-white dark:bg-zinc-600 py-2 px-4 border border-gray-300 dark:border-zinc-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Zurück
                </button>
                {currentStep < 4 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Weiter
                    </button>
                ) : (
                    <button
                        type="submit"
                        onClick={handleSave}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Kombination speichern
                    </button>
                )}
            </div>
        </div>
    );
};

export default KombiBuilder;
