
import React, { useState } from 'react';
import { Character, GeneratedImage } from '../types';
import { MIN_IMAGES, SUGGESTION_PROMPTS, ICONS } from '../constants';
import { generateWithCharacter } from '../services/geminiService';
import Loader from './Loader';
import ImageGrid from './ImageGrid';

interface WorkspaceProps {
  character: Character | null;
  onAddReferenceImages: (characterId: string, files: FileList) => void;
  onDeleteReferenceImage: (characterId: string, imageId: string) => void;
  onAddGeneratedImage: (characterId: string, prompt: string, dataUrl: string) => void;
  onDeleteGeneratedImage: (characterId: string, imageId: string) => void;
  onImageClick: (image: GeneratedImage) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ 
  character, 
  onAddReferenceImages, 
  onDeleteReferenceImage, 
  onAddGeneratedImage, 
  onDeleteGeneratedImage,
  onImageClick 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!character) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 text-center bg-slate-900">
        <div>
          <h2 className="text-3xl font-bold text-slate-300">Welcome to Character Studio</h2>
          <p className="mt-2 text-slate-400">Select a character or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  const isReadyToGenerate = character.referenceImages.length >= MIN_IMAGES;

  const handleGenerate = async (currentPrompt: string) => {
    if (!currentPrompt.trim() || !isReadyToGenerate) return;

    setIsLoading(true);
    setError(null);
    try {
      const generatedImageUrl = await generateWithCharacter(currentPrompt, character.referenceImages);
      onAddGeneratedImage(character.id, currentPrompt, generatedImageUrl);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderGenerationUI = () => (
    <div className="bg-slate-800/50 p-6 rounded-lg mb-8 sticky top-6 z-10 backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4">Generate Image of {character.name}</h3>
      <div className="flex flex-col md:flex-row gap-2">
        <input 
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerate(prompt)}
          placeholder="Describe a scene, style, or action..."
          className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        />
        <button
          onClick={() => handleGenerate(prompt)}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? 'Generating...' : <>{ICONS.sparkles} Generate</>}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {SUGGESTION_PROMPTS.map(p => (
          <button 
            key={p} 
            onClick={() => handleGenerate(`${character.name} ${p}`)}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-3 rounded-full transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );

  return (
    <main className="flex-grow p-6 bg-slate-900 overflow-y-auto h-screen">
      <h2 className="text-3xl font-bold text-white mb-6">Editing: {character.name}</h2>
      
      {!isReadyToGenerate && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Action Required: </strong>
          <span className="block sm:inline">Upload at least {MIN_IMAGES} reference images to start generating. You currently have {character.referenceImages.length}.</span>
        </div>
      )}
      
      {isReadyToGenerate && renderGenerationUI()}

      {isLoading && !character.generatedImages.length && <div className="mt-8"><Loader text="Generating your first image..." /></div>}

      <ImageGrid
        title="Generated Images"
        images={character.generatedImages}
        onDeleteImage={(id) => onDeleteGeneratedImage(character.id, id)}
        onImageClick={onImageClick}
      />
      
      <ImageGrid
        title="Reference Images"
        images={character.referenceImages}
        onAddImages={(files) => onAddReferenceImages(character.id, files)}
        onDeleteImage={(id) => onDeleteReferenceImage(character.id, id)}
        characterImageCount={character.referenceImages.length}
      />
    </main>
  );
};

export default Workspace;
