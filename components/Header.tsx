
import React from 'react';
import { Youtube } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm border-b border-base-300 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <Youtube className="h-8 w-8 text-brand-primary" />
          <h1 className="text-xl font-bold text-base-content">
            YouTube Summarizer
          </h1>
        </div>
      </div>
    </header>
  );
};
