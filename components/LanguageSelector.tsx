
import React from 'react';
import { Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  selectedLanguage: string;
  setLanguage: (language: string) => void;
  isLoading: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, setLanguage, isLoading }) => {
  return (
    <div className="relative">
      <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <select
        value={selectedLanguage}
        onChange={(e) => setLanguage(e.target.value)}
        disabled={isLoading}
        className="w-full bg-base-100 border border-base-300 rounded-lg py-3 pl-10 pr-4 appearance-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 text-base-content disabled:opacity-50"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.name}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
