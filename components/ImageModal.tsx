import React, { useState, useEffect } from 'react';
import { GeneratedImage } from '../types';
import Loader from './Loader';
import { ICONS } from '../constants';
import { editImage } from '../services/geminiService';

interface ImageModalProps {
  image: GeneratedImage | null;
  characterName?: string;
  onClose: () => void;
  onImageEdited: (characterId: string, prompt: string, dataUrl: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, characterName, onClose, onImageEdited }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [dimensions, setDimensions] = useState<{width: number; height: number} | null>(null);

  useEffect(() => {
    if (image?.dataUrl) {
      const img = new window.Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        console.error("Failed to load image to get dimensions.");
        setDimensions(null);
      }
      img.src = image.dataUrl;
    }
    // Cleanup function to reset state when component unmounts or image changes
    return () => {
        setDimensions(null);
    }
  }, [image]);

  if (!image) return null;

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const editedImageUrl = await editImage(editPrompt, image);
      onImageEdited(image.characterId, `Edit: ${editPrompt} (from original: ${image.prompt})`, editedImageUrl);
      setEditPrompt('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    const safePrompt = image.prompt.substring(0, 40).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${characterName?.replace(/\s/g, '_') || 'character'}_${safePrompt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (copyStatus !== 'Copy' || !navigator.clipboard) return;
    try {
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      setCopyStatus('Error!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Image display with "sleek canvas" style */}
        <div className="w-full md:w-2/3 p-4 flex items-center justify-center bg-slate-900">
           <div className="bg-white p-2 rounded-sm shadow-lg w-full h-full flex items-center justify-center">
             <img src={image.dataUrl} alt={image.prompt} className="max-w-full max-h-full object-contain rounded-sm" />
           </div>
        </div>

        {/* Details and Edit panel */}
        <div className="w-full md:w-1/3 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
              <button onClick={onClose} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold">
                <div className="w-5 h-5">{ICONS.back}</div>
                <span>Back</span>
              </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">{ICONS.close}</button>
          </div>
          <div className="flex-grow overflow-y-auto pr-2 space-y-6">
            
            {/* Metadata section */}
            <div>
                <h2 className="text-xl font-bold text-slate-100 mb-4">Image Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {characterName && (
                      <div>
                          <p className="text-sm text-slate-400 mb-1 font-semibold">Character</p>
                          <p className="text-purple-300 bg-slate-700/50 p-2 rounded-md text-sm font-medium">{characterName}</p>
                      </div>
                  )}
                  {dimensions && (
                      <div>
                          <p className="text-sm text-slate-400 mb-1 font-semibold">Dimensions</p>
                          <p className="text-slate-300 bg-slate-700/50 p-2 rounded-md text-sm font-medium">
                              {dimensions.width} &times; {dimensions.height} px
                          </p>
                      </div>
                  )}
                </div>
                <div>
                    <p className="text-sm text-slate-400 mb-1 font-semibold">Prompt</p>
                    <p className="text-slate-200 bg-slate-700/50 p-3 rounded-md text-sm">{image.prompt}</p>
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex gap-3">
                <button onClick={handleDownload} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 text-sm">
                    <div className="w-4 h-4">{ICONS.download}</div> Download
                </button>
                 <button onClick={handleCopy} disabled={copyStatus !== 'Copy'} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                    <div className="w-4 h-4">{ICONS.copy}</div> {copyStatus}
                </button>
            </div>

            {/* Edit section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2 border-t border-slate-700 pt-6">{ICONS.edit} Edit Image</h3>
              <p className="text-sm text-slate-400 mb-3">Describe the changes you want to make.</p>
              
              {isLoading ? (
                <div className="py-8"><Loader text="Applying edits..." /></div>
              ) : (
                <>
                  <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g., add a retro filter, make the background a forest..."
                    className="w-full h-24 p-2 bg-slate-700 border border-slate-600 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                  <button
                    onClick={handleEdit}
                    disabled={isLoading}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    {ICONS.sparkles} Apply Changes
                  </button>
                  {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
