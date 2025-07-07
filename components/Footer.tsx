
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-base-content-secondary">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} AI Video Tools. All Rights Reserved.
        </p>
        <p className="text-xs mt-2 max-w-2xl mx-auto">
          Disclaimer: Summaries are AI-generated using Google Search for information and may not be fully accurate. Always refer to the original video for critical information.
        </p>
      </div>
    </footer>
  );
};
