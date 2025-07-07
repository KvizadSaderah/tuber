
import React from 'react';
import { Lightbulb, BookText, Globe } from 'lucide-react';
import { SummaryResult } from '../types';

interface SummaryDisplayProps {
  result: SummaryResult;
  videoUrl: string;
}

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ result, videoUrl }) => {
  const videoId = getYouTubeId(videoUrl);

  return (
    <>
      {videoId && (
        <div className="mb-6 aspect-video w-full">
          <iframe
            className="w-full h-full rounded-xl shadow-lg border border-base-300"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="bg-base-200 shadow-lg rounded-2xl border border-base-300 overflow-hidden animate-fade-in">
        <div className="p-6 md:p-8 space-y-6">
          {/* Title Section */}
          <h2 className="text-2xl font-bold text-base-content leading-tight">
            {result.title}
          </h2>

          {/* Summary Section */}
          <div>
            <div className="flex items-center gap-3 mb-3 pt-4 border-t border-base-300">
              <BookText className="h-6 w-6 text-brand-light" />
              <h3 className="text-xl font-bold text-base-content">Summary</h3>
            </div>
            <p className="text-base-content-secondary leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Key Ideas Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 pt-4 border-t border-base-300">
              <Lightbulb className="h-6 w-6 text-brand-light" />
              <h3 className="text-xl font-bold text-base-content">Key Ideas</h3>
            </div>
            <ul className="space-y-3">
              {result.keyIdeas.map((idea, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-brand-primary/20 text-brand-light rounded-full text-sm font-bold mt-1">
                    {index + 1}
                  </span>
                  <p className="text-base-content-secondary leading-relaxed">
                    {idea}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources Section */}
          {result.sources && result.sources.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3 pt-4 border-t border-base-300">
                <Globe className="h-6 w-6 text-brand-light" />
                <h3 className="text-xl font-bold text-base-content">Sources</h3>
              </div>
              <ul className="space-y-2">
                {result.sources.map((source, index) => (
                   <li key={index} className="text-sm">
                     <a 
                       href={source.uri} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-brand-light hover:underline break-all"
                     >
                       {source.title || source.uri}
                     </a>
                   </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
