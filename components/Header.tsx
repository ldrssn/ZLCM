
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
  return (
    <header className="bg-white dark:bg-zinc-800 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start space-x-4">
            <img src="https://zoelu.com/cdn/shop/files/webseite-zoe-lu-logo-schwarz_220x.png?v=1723470522" alt="Zoué Lu Logo" className="h-10 w-auto dark:invert"/>
            <h1 className="text-3xl font-bold tracking-tight text-brand-text dark:text-gray-100">
                My Collection
            </h1>
          </div>
          <ThemeToggle theme={theme} toggleTheme={onThemeToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;