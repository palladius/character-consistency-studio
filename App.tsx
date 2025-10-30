
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import ImageModal from './components/ImageModal';
import { useCharacterManager } from './hooks/useCharacterManager';
import { GeneratedImage } from './types';
import { generateImage } from './services/geminiService';
import { ICONS } from './constants';
import Loader from './components/Loader';


const StandaloneGenerator: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const imageUrl = await generateImage(prompt);
            setGeneratedImage(imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate image');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">{ICONS.image} Quick Generate</h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">{ICONS.close}</button>
                </div>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                        placeholder="A photorealistic image of a cat astronaut..."
                        className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-md transition-colors">
                        {isLoading ? '...' : 'Generate'}
                    </button>
                </div>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <div className="w-full aspect-square bg-slate-900 rounded-md flex items-center justify-center">
                    {isLoading && <Loader text="Generating with Imagen..." />}
                    {generatedImage && <img src={generatedImage} alt={prompt} className="max-w-full max-h-full object-contain rounded-md" />}
                </div>
            </div>
        </div>
    );
};

function App() {
  const {
    characters,
    selectedCharacter,
    selectedCharacterId,
    addCharacter,
    deleteCharacter,
    setSelectedCharacterId,
    addReferenceImages,
    deleteReferenceImage,
    addGeneratedImage,
    deleteGeneratedImage,
  } = useCharacterManager();

  const [modalImage, setModalImage] = useState<GeneratedImage | null>(null);
  const [showStandaloneGenerator, setShowStandaloneGenerator] = useState(false);
  
  const characterForModal = modalImage ? characters.find(c => c.id === modalImage.characterId) : null;
  const allGeneratedImagesForChar = characterForModal ? characterForModal.generatedImages : [];

  const handleImageUpdate = (characterId: string, prompt: string, dataUrl: string, parentId?: string) => {
    addGeneratedImage(characterId, prompt, dataUrl, parentId);
  };

  return (
    <div className="flex h-screen w-screen font-sans">
      <Sidebar 
        characters={characters}
        selectedCharacterId={selectedCharacterId}
        onSelectCharacter={setSelectedCharacterId}
        onAddCharacter={addCharacter}
        onDeleteCharacter={deleteCharacter}
      />
      <div className="flex flex-col flex-grow">
          <div className="absolute top-4 right-6 z-20">
              <button 
                  onClick={() => setShowStandaloneGenerator(true)}
                  className="bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm text-slate-200 font-semibold py-2 px-4 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
              >
                  {ICONS.image} Quick Generate
              </button>
          </div>
          <Workspace
            character={selectedCharacter}
            onAddReferenceImages={addReferenceImages}
            onDeleteReferenceImage={deleteReferenceImage}
            onAddGeneratedImage={addGeneratedImage}
            onDeleteGeneratedImage={deleteGeneratedImage}
            onImageClick={(image) => setModalImage(image)}
          />
      </div>
      
      {modalImage && (
        <ImageModal 
          image={modalImage}
          characterName={characterForModal?.name}
          onClose={() => setModalImage(null)}
          onImageUpdate={handleImageUpdate}
          allGeneratedImages={allGeneratedImagesForChar}
          onSelectImage={setModalImage}
        />
      )}

      {showStandaloneGenerator && (
        <StandaloneGenerator onClose={() => setShowStandaloneGenerator(false)} />
      )}
    </div>
  );
}

export default App;