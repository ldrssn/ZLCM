import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Item, Filters, SortBy, ItemType, ItemShape } from './types';
import { getItems, saveItems } from './services/itemService';
import { SAMPLE_ITEMS } from './constants';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import ItemCard from './components/ItemCard';
import ItemListItem from './components/ItemListItem';
import Modal from './components/Modal';
import AddItemForm from './components/AddItemForm';
import KombiBuilder from './components/KombiBuilder';
import Footer from './components/Footer';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    shape: 'all',
    color: 'all',
    soldStatus: 'all',
  });
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Name);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isKombiBuilderOpen, setIsKombiBuilderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isSampleData = useMemo(() => {
    if (items.length !== SAMPLE_ITEMS.length) {
      return false;
    }
    const sortedItems = [...items].sort((a, b) => a.id.localeCompare(b.id));
    const sortedSampleItems = [...SAMPLE_ITEMS].sort((a, b) => a.id.localeCompare(b.id));
    return JSON.stringify(sortedItems) === JSON.stringify(sortedSampleItems);
  }, [items]);


  useEffect(() => {
    setItems(getItems());
  }, []);

  useEffect(() => {
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
    const itemsToSet = isSampleData ? [item] : [...items, item];
    setItems(itemsToSet);
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(prevItems => prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
    closeModal();
    setItemToDelete(null);
  };

  const openDeleteConfirm = (item: Item) => {
    setItemToDelete(item);
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
    
    // Search filtering
    if (searchTerm.trim() !== '') {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(lowercasedTerm) ||
        item.color.join(' ').toLowerCase().includes(lowercasedTerm) ||
        (item.notes && item.notes.toLowerCase().includes(lowercasedTerm))
      );
    }

    // Category filtering
    result = result.filter(item => {
      if (filters.soldStatus === 'sold' && !item.isSold) return false;
      if (filters.soldStatus === 'in_collection' && item.isSold) return false;
      if (filters.type !== 'all' && item.type !== filters.type) return false;
      if (filters.shape !== 'all' && ![ItemType.Henkel, ItemType.Accessoire].includes(item.type) && item.shape !== filters.shape) return false;
      if (filters.color !== 'all' && !item.color.includes(filters.color)) return false;
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
  }, [items, filters, sortBy, searchTerm]);

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen flex flex-col">
      <Header theme={theme} onThemeToggle={toggleTheme} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full flex-grow">
        {items.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Willkommen beim Collection Manager!</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                    >
                        Beispieldaten laden
                    </button>
                </div>
            </div>
        ) : (
            <>
                {/* --- TOOLBAR CONTROLS --- */}
                {/* Desktop Toolbar */}
                <div className="hidden md:flex justify-end items-center mb-4 px-4 sm:px-0">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-brand-pink text-brand-text' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600'}`} aria-label="Grid-Ansicht">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V3zM3 11a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" /></svg>
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-brand-pink text-brand-text' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600'}`} aria-label="Listen-Ansicht">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <div className="h-6 border-l border-gray-300 dark:border-zinc-600 mx-2"></div>
                        <button onClick={() => setIsStatsModalOpen(true)} className="p-2 rounded-full text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" aria-label="Statistik anzeigen" title="Statistik anzeigen">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                        </button>
                        <button onClick={handleImportClick} className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" title="Sammlung importieren">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            <span className="hidden lg:inline">Import</span>
                        </button>
                        <button onClick={handleExport} className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" title="Sammlung exportieren">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            <span className="hidden lg:inline">Export</span>
                        </button>
                        <div className="h-6 border-l border-gray-300 dark:border-zinc-600 mx-2"></div>
                        <button onClick={() => setIsKombiBuilderOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" title="Eine neue Kombination aus bestehenden Teilen erstellen">
                           <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            Kombi erstellen
                        </button>
                        <button onClick={openAddModal} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" title={isSampleData ? 'Beispieldaten entfernen und eine neue Sammlung anlegen' : 'Ein neues Teil zu deiner Sammlung hinzufügen'}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            {isSampleData ? 'Eigene Sammlung starten' : 'Neues Teil'}
                        </button>
                    </div>
                </div>

                {/* Mobile Toolbar */}
                <div className="md:hidden flex flex-col gap-4 mb-4 px-4 sm:px-0">
                    {/* Row 1: View, Filter, Menu */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-brand-pink text-brand-text' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600'}`} aria-label="Grid-Ansicht">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V3zM3 11a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" /></svg>
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-brand-pink text-brand-text' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600'}`} aria-label="Listen-Ansicht">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsFiltersOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" aria-label="Filter anzeigen/verstecken">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-3-2A1 1 0 017 15v-2.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                            </button>
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" aria-label="Menü öffnen">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-700 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                                        <a href="#" onClick={(e) => { e.preventDefault(); setIsStatsModalOpen(true); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-600">Statistik</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleImportClick(); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-600">Import</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleExport(); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-600">Export</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Row 2: CTAs */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsKombiBuilderOpen(true)} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" title="Eine neue Kombination aus bestehenden Teilen erstellen">
                             <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            Kombi erstellen
                        </button>
                        <button onClick={openAddModal} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark" title={isSampleData ? 'Beispieldaten entfernen und eine neue Sammlung anlegen' : 'Ein neues Teil zu deiner Sammlung hinzufügen'}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            {isSampleData ? 'Start' : 'Neu'}
                        </button>
                    </div>
                </div>

                {/* Always visible File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".json"
                />

                <div className={`${isFiltersOpen ? 'block' : 'hidden'} md:block mb-8`}>
                    <FilterControls
                        filters={filters}
                        setFilters={setFilters}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-4 px-4 sm:px-0 gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Zeige {filteredAndSortedItems.length} von {items.length} Teilen
                    </div>
                    <div className="relative w-full md:w-auto md:max-w-xs">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-pink focus:border-brand-pink dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white bg-white"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                aria-label="Suche zurücksetzen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Keine Artikel gefunden</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Passen Sie Ihre Filter an oder fügen Sie neue Artikel hinzu.
                    </p>
                </div>
                )}
            </>
        )}
      </main>
      <Footer />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? 'Teil bearbeiten' : 'Neues Teil hinzufügen'}>
          <AddItemForm
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={openDeleteConfirm}
              onClose={closeModal}
              initialData={editingItem}
          />
      </Modal>

      <Modal isOpen={isKombiBuilderOpen} onClose={() => setIsKombiBuilderOpen(false)} title="Neue Kombination erstellen">
        <KombiBuilder
            items={items}
            onAddKombination={handleAddItem}
            onClose={() => setIsKombiBuilderOpen(false)}
        />
      </Modal>

       <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Löschen bestätigen">
        <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300">
                Möchten Sie das Teil <strong className="font-semibold">{itemToDelete?.name}</strong> wirklich endgültig löschen?
            </p>
            <div className="mt-6 flex justify-center gap-4">
                <button
                    type="button"
                    onClick={() => setItemToDelete(null)}
                    className="bg-white dark:bg-zinc-600 py-2 px-4 border border-gray-300 dark:border-zinc-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                >
                    Abbrechen
                </button>
                <button
                    type="button"
                    onClick={handleDeleteItem}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Löschen
                </button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} title="Statistik">
      <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          {/* Bestandsübersicht */}
          <div className="p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
              <h4 className="font-semibold text-base mb-2 text-gray-800 dark:text-gray-100">Bestandsübersicht</h4>
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
          <div className="p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
              <h4 className="font-semibold text-base mb-2 text-gray-800 dark:text-gray-100">Zusammenfassung</h4>
              <div className="space-y-1">
                  <div className="flex justify-between"><span className="font-semibold">Teile in der Kollektion:</span><span>{stats.currentCollectionCount}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Gekaufte Teile (gesamt):</span><span>{stats.totalPurchased}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Verkaufte Teile:</span><span>{stats.totalSold}</span></div>
              </div>
          </div>

          {/* Finanzübersicht */}
          <div className="p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
              <h4 className="font-semibold text-base mb-2 text-gray-800 dark:text-gray-100">Finanzübersicht</h4>
              <div className="space-y-1">
                    <div className="flex justify-between"><span className="font-semibold text-green-600 dark:text-green-400">Verkaufserlöse:</span><span className="font-bold text-green-600 dark:text-green-400">€{stats.salesRevenue.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Gesamtwert (aktuell):</span><span className="font-bold">€{stats.totalValue.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-red-600 dark:text-red-400">Gesamtkosten (aktuell):</span><span className="font-bold text-red-600 dark:text-red-400">€{stats.totalCost.toFixed(2)}</span></div>
              </div>
          </div>
      </div>
      </Modal>
    </div>
  );
};

export default App;