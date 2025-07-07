
import React from 'react';
import { Link, X } from 'lucide-react';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter YouTube video URL..."
        disabled={isLoading}
        className="w-full bg-base-100 border border-base-300 rounded-lg py-3 pl-10 pr-10 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 text-base-content disabled:opacity-50"
      />
      {url && (
        <button
          onClick={() => setUrl('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-base-300 transition-colors"
          aria-label="Clear input"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};
