import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Item, Filters, SortBy, ItemType, ItemShape } from './types.ts';
import { getItems, saveItems } from './services/itemService.ts';
import { SAMPLE_ITEMS } from './constants.ts';
import Header from './components/Header.tsx';
import FilterControls from './components/FilterControls.tsx';
import ItemCard from './components/ItemCard.tsx';
import ItemListItem from './components/ItemListItem.tsx';
import Modal from './components/Modal.tsx';
import AddItemForm from './components/AddItemForm.tsx';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    shape: 'all',
    color: 'all',
    showSoldOnly: false,
  });
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setItems(getItems());
  }, []);

  useEffect(() => {
    // Only save if items is not the initial empty array from the first load,
    // to avoid creating an empty storage item unnecessarily.
    if (items.length > 0 || localStorage.getItem('ZoeLuCollection') !== null) {
      saveItems(items);
    }
  }, [items]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddItem = (item: Item) => {
    setItems(prevItems => [...prevItems, item]);
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(prevItems => prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item)));
  };
  
  const handleLoadSampleData = () => {
    setItems(SAMPLE_ITEMS);
  };
  
  const handleExport = () => {
    if (items.length === 0) {
      alert("Ihre Sammlung ist leer. Es gibt nichts zu exportieren.");
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(items, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `ZoeLuCollection_${date}.json`;
    link.click();
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Möchten Sie wirklich eine neue Sammlung importieren? Alle aktuellen Daten werden überschrieben.")) {
      if (event.target) {
          event.target.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedItems = JSON.parse(text);
          if (Array.isArray(importedItems)) {
            setItems(importedItems);
            alert("Sammlung erfolgreich importiert!");
          } else {
            throw new Error("Die Datei hat nicht das erwartete Format (ein Array von Artikeln).");
          }
        }
      } catch (error) {
        console.error("Fehler beim Importieren der Datei:", error);
        alert("Fehler beim Importieren der Datei. Bitte stellen Sie sicher, dass es sich um eine gültige Sammlungsdatei handelt.");
      }
    };
    reader.readAsText(file);
    if (event.target) {
      event.target.value = '';
    }
  };


  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  const stats = useMemo(() => {
    const soldItems = items.filter(i => i.isSold);
    const soldRevenue = soldItems.reduce((sum, i) => sum + (i.sellingPrice ?? 0), 0);
    
    const totalValue = items.reduce((sum, i) => sum + i.price, 0) - soldRevenue;
    const totalCost = items.reduce((sum, i) => sum + (i.purchasePrice ?? i.price), 0) - soldRevenue;
    
    const klappen = items.filter(i => i.type === ItemType.Klappe);
    const körper = items.filter(i => i.type === ItemType.Körper);
    const henkel = items.filter(i => i.type === ItemType.Henkel).length;
    const accessoires = items.filter(i => i.type === ItemType.Accessoire).length;
    
    return {
      totalValue,
      totalCost,
      klappenSquare: klappen.filter(i => i.shape === ItemShape.Square).length,
      klappenRund: klappen.filter(i => i.shape === ItemShape.Rund).length,
      körperSquare: körper.filter(i => i.shape === ItemShape.Square).length,
      körperRund: körper.filter(i => i.shape === ItemShape.Rund).length,
      henkel,
      accessoires,
      currentCollectionCount: items.length - soldItems.length,
      totalPurchased: items.length,
      totalSold: soldItems.length,
      salesRevenue: soldRevenue,
    };
  }, [items]);


  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filtering
    result = result.filter(item => {
      if (filters.showSoldOnly) {
        if (!item.isSold) return false;
      }
      if (filters.type !== 'all' && item.type !== filters.type) return false;
      if (filters.shape !== 'all' && ![ItemType.Henkel, ItemType.Accessoire].includes(item.type) && item.shape !== filters.shape) return false;
      if (filters.color !== 'all' && item.color !== filters.color) return false;
      return true;
    });

    // Sorting
    switch (sortBy) {
      case SortBy.Name:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortBy.PriceAsc:
        result.sort((a, b) => a.price - b.price);
        break;
      case SortBy.PriceDesc:
        result.sort((a, b) => b.price - a.price);
        break;
      case SortBy.Usage:
        result.sort((a, b) => b.usageCount - a.usageCount);
        break;
      default:
        break;
    }

    return result;
  }, [items, filters, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {items.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">Willkommen beim Collection Manager!</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Ihre Sammlung ist noch leer. Fügen Sie Ihr erstes Teil hinzu oder laden Sie Beispieldaten, um die Funktionen zu entdecken.
                </p>
                <div className="mt-6 flex justify-center items-center gap-4">
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Erstes Teil hinzufügen
                    </button>
                    <button
                        onClick={handleLoadSampleData}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                    >
                        Beispieldaten laden
                    </button>
                </div>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">My Collection</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Desktop Buttons */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => setIsStatsModalOpen(true)}
                                className="p-2 rounded-full text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                                aria-label="Statistik anzeigen"
                                title="Statistik anzeigen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleImportClick}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                                title="Sammlung importieren"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="hidden lg:inline">Import</span>
                            </button>
                            <button
                                onClick={handleExport}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                                title="Sammlung exportieren"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="hidden lg:inline">Export</span>
                            </button>
                            <div className="h-6 border-l border-gray-300 mx-2"></div>
                        </div>

                        {/* Always visible File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".json"
                        />

                        {/* Always visible Add Button */}
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Neues Teil
                        </button>

                        {/* Mobile Kebab Menu */}
                        <div className="md:hidden relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" aria-label="Menü öffnen">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsStatsModalOpen(true); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Statistik</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleImportClick(); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Import</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleExport(); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <FilterControls
                filters={filters}
                setFilters={setFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                />

                <div className="text-right text-sm text-gray-500 mb-4 pr-1">
                    Zeige {filteredAndSortedItems.length} von {items.length} Teilen
                </div>

                {filteredAndSortedItems.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedItems.map(item => (
                        <ItemCard 
                        key={item.id} 
                        item={item} 
                        onEdit={openEditModal} 
                        onUpdate={handleUpdateItem} 
                        activeColorFilter={filters.color}
                        />
                    ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                    {filteredAndSortedItems.map(item => (
                        <ItemListItem
                            key={item.id}
                            item={item}
                            onEdit={openEditModal}
                            onUpdate={handleUpdateItem}
                        />
                    ))}
                    </div>
                )
                ) : (
                <div className="text-center py-10 px-4">
                    <h3 className="text-lg font-medium text-gray-900">Keine Artikel gefunden</h3>
                    <p className="mt-1 text-sm text-gray-500">
                    Passen Sie Ihre Filter an oder fügen Sie neue Artikel hinzu.
                    </p>
                </div>
                )}
            </>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? 'Teil bearbeiten' : 'Neues Teil hinzufügen'}>
            <AddItemForm
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onClose={closeModal}
                initialData={editingItem}
            />
        </Modal>

        <Modal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} title="Statistik">
        <div className="space-y-4 text-sm text-gray-700">
            {/* Bestandsübersicht */}
            <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-base mb-2 text-gray-800">Bestandsübersicht</h4>
                <div className="space-y-1">
                    <div className="flex justify-between"><span className="font-semibold">Klappen (Square):</span><span>{stats.klappenSquare}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Klappen (Rund):</span><span>{stats.klappenRund}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Körper (Square):</span><span>{stats.körperSquare}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Körper (Rund):</span><span>{stats.körperRund}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Anzahl Henkel:</span><span>{stats.henkel}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Anzahl Accessoires:</span><span>{stats.accessoires}</span></div>
                </div>
            </div>

            {/* Zusammenfassung */}
            <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-base mb-2 text-gray-800">Zusammenfassung</h4>
                <div className="space-y-1">
                    <div className="flex justify-between"><span className="font-semibold">Teile in der Kollektion:</span><span>{stats.currentCollectionCount}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Gekaufte Teile (gesamt):</span><span>{stats.totalPurchased}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Verkaufte Teile:</span><span>{stats.totalSold}</span></div>
                </div>
            </div>

            {/* Finanzübersicht */}
            <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-base mb-2 text-gray-800">Finanzübersicht</h4>
                <div className="space-y-1">
                     <div className="flex justify-between"><span className="font-semibold text-green-600">Verkaufserlöse:</span><span className="font-bold text-green-600">€{stats.salesRevenue.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Gesamtwert (aktuell):</span><span className="font-bold">€{stats.totalValue.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-red-600">Gesamtkosten (aktuell):</span><span className="font-bold text-red-600">€{stats.totalCost.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
        </Modal>
      </main>
    </div>
  );
};

export default App;