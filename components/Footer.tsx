import React, { useState, useEffect } from 'react';

interface FooterProps {
    totalImages: number;
    totalTokens: number;
    estimatedCost: number;
}

const Footer: React.FC<FooterProps> = ({ totalImages, totalTokens, estimatedCost }) => {
    const [appVersion, setAppVersion] = useState('');

    useEffect(() => {
        fetch('./metadata.json')
        .then(response => response.json())
        .then(data => setAppVersion(data.version))
        .catch(error => console.error('Error fetching app metadata:', error));
    }, []);

    return (
        <footer className="w-full bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 p-2 text-xs text-slate-500 flex-shrink-0 flex justify-center items-center gap-4">
            {appVersion && (
                <span>
                    Version <strong className="font-bold text-slate-400">{appVersion}</strong>
                </span>
            )}
            
            <div className="flex gap-4 items-center">
                 <span className="text-slate-700">|</span>
                 <span>
                    Images: <strong className="font-bold text-slate-400">{totalImages}</strong>
                </span>
                 <span>
                    Tokens: <strong className="font-bold text-slate-400">{totalTokens.toLocaleString()}</strong>
                </span>
                 <span>
                    Est. Cost: <strong className="font-bold text-slate-400">${estimatedCost.toFixed(2)}</strong>
                </span>
                 <span className="text-slate-700">|</span>
            </div>

            <a 
                href="https://github.com/palladius/character-consistency-studio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors"
            >
                GitHub Repository
            </a>
        </footer>
    );
};

export default Footer;