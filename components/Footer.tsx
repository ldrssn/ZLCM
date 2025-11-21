
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-zinc-800 mt-8 py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-zinc-700">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
          <p>&copy; 2025 by ldrssn</p>
          <p className="hidden sm:block">|</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">v.02 Alpha</p>
          <p className="hidden sm:block">|</p>
          <a
            href="mailto:hey@ldrssn.de"
            className="text-brand-pink hover:text-brand-pink-dark hover:underline"
          >
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;