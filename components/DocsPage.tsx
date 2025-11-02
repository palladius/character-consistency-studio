import React, { useState, useEffect } from 'react';
import showdown from 'showdown';
import { ICONS } from '../constants';

interface DocsPageProps {
  onBack: () => void;
}

const converter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
    tables: true,
});

const DocsPage: React.FC<DocsPageProps> = ({ onBack }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/docs/USER_MANUAL.md')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(markdown => {
        const html = converter.makeHtml(markdown);
        setHtmlContent(html);
      })
      .catch(err => {
        console.error('Error loading markdown:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="flex-grow bg-slate-900 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold">
                <div className="w-5 h-5">{ICONS.back}</div>
                <span>Back to Studio</span>
            </button>

            <div id="content" className="markdown-body">
                {!htmlContent && !error && (
                    <div className="text-center p-16">
                        <p className="text-lg text-slate-400">Loading documentation...</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                        <strong className="font-bold">Error:</strong>
                        <p>Could not load the user manual.</p>
                        <pre className="mt-2 text-sm">{error}</pre>
                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </div>
        <style>{`
          .markdown-body h1, .markdown-body h2, .markdown-body h3 {
            font-weight: bold;
            color: #f1f5f9; /* slate-100 */
            border-bottom: 1px solid #334155; /* slate-700 */
            padding-bottom: 0.3em;
            margin-top: 1.5em;
            margin-bottom: 1em;
          }
          .markdown-body h1 { font-size: 2.25rem; }
          .markdown-body h2 { font-size: 1.75rem; }
          .markdown-body h3 { font-size: 1.25rem; }
          .markdown-body p {
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          .markdown-body a {
            color: #facc15; /* yellow-400 */
            text-decoration: underline;
          }
          .markdown-body a:hover {
            color: #eab308; /* yellow-500 */
          }
          .markdown-body code {
            background-color: #334155; /* slate-700 */
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            border-radius: 6px;
            color: #fde047; /* yellow-300 */
          }
          .markdown-body pre {
            background-color: #1e293b; /* slate-800 */
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
          }
           .markdown-body pre code {
            padding: 0;
            background-color: transparent;
            color: inherit;
          }
          .markdown-body ul, .markdown-body ol {
            padding-left: 2em;
            margin-bottom: 1rem;
            list-style: disc;
          }
           .markdown-body li {
            margin-bottom: 0.5rem;
          }
          .markdown-body strong {
            color: #f8fafc; /* slate-50 */
          }
        `}</style>
    </div>
  );
};

export default DocsPage;
