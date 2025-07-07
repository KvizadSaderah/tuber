
import React, { useState, useCallback } from 'react';
import { Youtube, Languages, FileDown, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LanguageSelector } from './components/LanguageSelector';
import { SummaryDisplay } from './components/SummaryDisplay';
import { DownloadButtons } from './components/DownloadButtons';
import { Loader } from './components/Loader';
import { Footer } from './components/Footer';
import { summarizeYouTubeVideo } from './services/geminiService';
import { SummaryResult } from './types';
import { SUPPORTED_LANGUAGES } from './constants';

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].name);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!videoUrl) {
      setError('Please enter a YouTube video URL.');
      return;
    }
    // Basic regex to check for a YouTube URL pattern
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(videoUrl)) {
      setError('Please enter a valid YouTube video URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummaryResult(null);

    try {
      const result = await summarizeYouTubeVideo(videoUrl, language);
      setSummaryResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please check the URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl, language]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-base-200 shadow-lg rounded-2xl p-6 md:p-8 space-y-6 border border-base-300">
            <h2 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
              Summarize any YouTube Video with AI
            </h2>

            <div className="space-y-4">
              <UrlInput
                url={videoUrl}
                setUrl={setVideoUrl}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
              <LanguageSelector
                selectedLanguage={language}
                setLanguage={setLanguage}
                isLoading={isLoading}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader /> : 'Generate Summary'}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {summaryResult && (
            <div className="mt-8">
              <SummaryDisplay result={summaryResult} videoUrl={videoUrl} />
              <div className="mt-6">
                 <DownloadButtons result={summaryResult} videoUrl={videoUrl} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
