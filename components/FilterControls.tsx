
import React, { useState, useRef, useEffect } from 'react';
import { Filters, ItemType, ItemShape, SortBy } from '../types';
import { COLORS, COLOR_MAP } from '../constants';

interface FilterControlsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, sortBy, setSortBy }) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = <K extends keyof Filters,>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setIsColorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const FilterButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void; }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${active ? 'bg-brand-pink text-brand-text' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Type Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Art</h4>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Alle" active={filters.type === 'all'} onClick={() => handleFilterChange('type', 'all')} />
            {Object.values(ItemType).map(t => <FilterButton key={t} label={t} active={filters.type === t} onClick={() => handleFilterChange('type', t)} />)}
          </div>
        </div>
        {/* Shape Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Form</h4>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Alle" active={filters.shape === 'all'} onClick={() => handleFilterChange('shape', 'all')} />
            {Object.values(ItemShape).map(s => <FilterButton key={s} label={s} active={filters.shape === s} onClick={() => handleFilterChange('shape', s)} />)}
          </div>
        </div>
        {/* Color Filter */}
        <div className="relative" ref={colorDropdownRef}>
          <label htmlFor="color-filter" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Farbe</label>
          <button
            type="button"
            onClick={() => setIsColorOpen(!isColorOpen)}
            className="relative w-full cursor-default rounded-md border border-gray-300 bg-white dark:bg-zinc-700 dark:border-zinc-600 py-2 pl-3 pr-10 text-left shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink sm:text-sm"
          >
            <span className="flex items-center">
              {filters.color !== 'all' && (
                <span style={{ backgroundColor: COLOR_MAP[filters.color] }} className="inline-block h-4 w-4 flex-shrink-0 rounded-full border border-gray-300"></span>
              )}
              <span className="ml-3 block truncate text-gray-900 dark:text-gray-100">{filters.color === 'all' ? 'Alle Farben' : filters.color}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zM6.53 11.72a.75.75 0 011.06 0L10 15.19l2.47-2.47a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
            </span>
          </button>

          {isColorOpen && (
            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-zinc-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <li onClick={() => { handleFilterChange('color', 'all'); setIsColorOpen(false); }} className="text-gray-900 dark:text-gray-200 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-brand-pink hover:text-brand-text dark:hover:text-brand-text">Alle Farben</li>
              {COLORS.map(c => (
                <li key={c} onClick={() => { handleFilterChange('color', c); setIsColorOpen(false); }} className="text-gray-900 dark:text-gray-200 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-brand-pink hover:text-brand-text dark:hover:text-brand-text">
                    <div className="flex items-center">
                        <span style={{ backgroundColor: COLOR_MAP[c] }} className="inline-block h-4 w-4 flex-shrink-0 rounded-full border border-gray-300"></span>
                        <span className="font-normal ml-3 block truncate">{c}</span>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Sorting and Status */}
        <div className="space-y-6">
            <div>
                <label htmlFor="sort-by" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Sortieren nach</label>
                <div className="relative w-full">
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="w-full appearance-none cursor-default rounded-md border border-gray-300 bg-white dark:bg-zinc-700 dark:border-zinc-600 py-2 pl-3 pr-10 text-left shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink sm:text-sm text-gray-900 dark:text-gray-100"
                    >
                        <option value={SortBy.Name}>Name</option>
                        <option value={SortBy.PriceAsc}>Preis: aufsteigend</option>
                        <option value={SortBy.PriceDesc}>Preis: absteigend</option>
                        <option value={SortBy.Usage}>Nutzung</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zM6.53 11.72a.75.75 0 011.06 0L10 15.19l2.47-2.47a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Status</h4>
                <div className="flex flex-wrap gap-2">
                    <FilterButton label="Alle" active={filters.soldStatus === 'all'} onClick={() => handleFilterChange('soldStatus', 'all')} />
                    <FilterButton label="Verkauft" active={filters.soldStatus === 'sold'} onClick={() => handleFilterChange('soldStatus', 'sold')} />
                    <FilterButton label="In Sammlung" active={filters.soldStatus === 'in_collection'} onClick={() => handleFilterChange('soldStatus', 'in_collection')} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;