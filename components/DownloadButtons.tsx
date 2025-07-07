
import React from 'react';
import { Download } from 'lucide-react';
import { SummaryResult, DownloadFormat } from '../types';

interface DownloadButtonsProps {
  result: SummaryResult;
  videoUrl: string;
}

const generateFileContent = (result: SummaryResult, format: DownloadFormat, videoUrl: string): string => {
  const title = `Summary for: ${result.title}`;
  const summarySection = `Summary:\n${result.summary}`;
  const keyIdeasSection = `Key Ideas:\n${result.keyIdeas.map(idea => `- ${idea}`).join('\n')}`;
  const sourcesSection = result.sources && result.sources.length > 0 
    ? `Sources:\n${result.sources.map(s => `- ${s.title || s.uri} (${s.uri})`).join('\n')}`
    : '';
  const videoSourceLine = `Source Video: ${videoUrl}`;

  switch (format) {
    case DownloadFormat.MD:
      const sourcesMd = result.sources && result.sources.length > 0
        ? `## Sources\n\n${result.sources.map(s => `* [${s.title || s.uri}](${s.uri})`).join('\n')}`
        : '';
      return `# ${title}\n\n**${videoSourceLine}**\n\n## Summary\n\n${result.summary}\n\n## Key Ideas\n\n${result.keyIdeas.map(idea => `* ${idea}`).join('\n')}\n\n${sourcesMd.trim()}`;
    
    case DownloadFormat.HTML:
      const sourcesHtml = result.sources && result.sources.length > 0
        ? `<h2>Sources</h2><ul>${result.sources.map(s => `<li><a href="${s.uri}" target="_blank" rel="noopener noreferrer">${s.title || s.uri}</a></li>`).join('')}</ul>`
        : '';
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: auto; color: #333; }
            h1, h2 { color: #111; }
            h1 { font-size: 1.8em; }
            h2 { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 1.5em;}
            ul { list-style-type: disc; padding-left: 20px; }
            li { margin-bottom: 10px; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
            p { margin-bottom: 1em; }
            strong { color: #555; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p><strong>Source Video:</strong> <a href="${videoUrl}" target="_blank" rel="noopener noreferrer">${videoUrl}</a></p>
          <h2>Summary</h2>
          <p>${result.summary}</p>
          <h2>Key Ideas</h2>
          <ul>
            ${result.keyIdeas.map(idea => `<li>${idea}</li>`).join('')}
          </ul>
          ${sourcesHtml}
        </body>
        </html>
      `;
    
    case DownloadFormat.TXT:
    default:
      return `${title}\n${videoSourceLine}\n\n${summarySection}\n\n${keyIdeasSection}\n\n${sourcesSection.trim()}`.trim();
  }
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


export const DownloadButtons: React.FC<DownloadButtonsProps> = ({ result, videoUrl }) => {
  
  const handleDownload = (format: DownloadFormat) => {
    const mimeTypes = {
        txt: 'text/plain;charset=utf-8',
        md: 'text/markdown;charset=utf-8',
        html: 'text/html;charset=utf-8'
    };
    const content = generateFileContent(result, format, videoUrl);
    const filename = `summary-${result.title.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    downloadFile(content, filename, mimeTypes[format]);
  };

  return (
    <div className="bg-base-200 shadow-lg rounded-2xl p-4 border border-base-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-brand-light"/>
                <p className="font-semibold text-base-content">Download Summary</p>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => handleDownload(DownloadFormat.TXT)} className="px-4 py-2 text-sm font-medium text-base-content bg-base-300 hover:bg-base-100 rounded-md transition-colors">TXT</button>
                <button onClick={() => handleDownload(DownloadFormat.MD)} className="px-4 py-2 text-sm font-medium text-base-content bg-base-300 hover:bg-base-100 rounded-md transition-colors">Markdown</button>
                <button onClick={() => handleDownload(DownloadFormat.HTML)} className="px-4 py-2 text-sm font-medium text-base-content bg-base-300 hover:bg-base-100 rounded-md transition-colors">HTML</button>
            </div>
        </div>
    </div>
  );
};
