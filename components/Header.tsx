import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <img src="https://zoelu.com/cdn/shop/files/webseite-zoe-lu-logo-schwarz_220x.png?v=1723470522" alt="Zoué Lu Logo" className="h-10 w-auto"/>
          <h1 className="text-3xl font-bold tracking-tight text-brand-text">
            Collection Manager
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
