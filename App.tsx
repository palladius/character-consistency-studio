import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import ImageModal from './components/ImageModal';
import { useCharacterManager, QUICK_GEN_CHARACTER_ID } from './hooks/useCharacterManager';
import { GeneratedImage } from './types';
import { generateImage } from './services/geminiService';
import { ICONS, QUICK_GENERATE_PROMPTS } from './constants';
import Loader from './components/Loader';
import Footer from './components/Footer';

const aspectRatios = [
    { value: '1:1', icon: ICONS.aspect1to1, label: 'Square (1:1)' },
    { value: '4:3', icon: ICONS.aspect4to3, label: 'Landscape (4:3)' },
    { value: '3:4', icon: ICONS.aspect3to4, label: 'Portrait (3:4)' },
];

const generationCounts = [1, 2, 4];

interface StandaloneGeneratorProps {
    onClose: () => void;
    onImagesGenerated: (prompt: string, dataUrls: string[]) => void;
}

const StandaloneGenerator: React.FC<StandaloneGeneratorProps> = ({onClose, onImagesGenerated}) => {
    const getRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * QUICK_GENERATE_PROMPTS.length);
        return QUICK_GENERATE_PROMPTS[randomIndex];
    };

    const [prompt, setPrompt] = useState(getRandomPrompt());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageCount, setImageCount] = useState(1);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);
        try {
            const imageUrls = await generateImage(prompt, aspectRatio, imageCount);
            setGeneratedImages(imageUrls);
            onImagesGenerated(prompt, imageUrls);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate image');
        } finally {
            setIsLoading(false);
        }
    };
    
    const gridCols = imageCount === 4 ? 'grid-cols-2' : 'grid-cols-1';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">{ICONS.image} Quick Generate</h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">{ICONS.close}</button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                        placeholder="A photorealistic image of a cat astronaut..."
                        className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-slate-900 font-bold py-3 px-6 rounded-md transition-colors">
                        {isLoading ? '...' : 'Generate'}
                    </button>
                </div>
                 <div className="flex items-center justify-center flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg">
                        <span className="text-xs text-slate-400 font-semibold px-2">Aspect Ratio</span>
                        {aspectRatios.map(({ value, icon, label }) => (
                            <button
                                key={value}
                                title={label}
                                onClick={() => setAspectRatio(value)}
                                className={`p-1.5 rounded-md transition-colors ${
                                aspectRatio === value
                                    ? 'bg-yellow-500 text-slate-900'
                                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                            >
                                <div className="w-5 h-5">{icon}</div>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg">
                        <span className="text-xs text-slate-400 font-semibold px-2">Images</span>
                         {generationCounts.map((count) => (
                            <button
                                key={count}
                                title={`Generate ${count} image${count > 1 ? 's' : ''}`}
                                onClick={() => setImageCount(count)}
                                className={`px-2.5 py-1 text-sm font-bold rounded-md transition-colors ${
                                imageCount === count
                                    ? 'bg-yellow-500 text-slate-900'
                                    : 'text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                <div className="w-full aspect-square bg-slate-900 rounded-md flex items-center justify-center overflow-hidden">
                    {isLoading && <Loader text="Generating with Imagen..." />}
                    {!isLoading && generatedImages.length > 0 && (
                        <div className={`grid ${gridCols} gap-2 w-full h-full p-2`}>
                            {generatedImages.map((src, index) => (
                                <img key={index} src={src} alt={`${prompt} - ${index + 1}`} className="w-full h-full object-contain rounded-md" />
                            ))}
                        </div>
                    )}
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

  const handleQuickGenerate = (prompt: string, dataUrls: string[]) => {
    dataUrls.forEach(url => {
        addGeneratedImage(QUICK_GEN_CHARACTER_ID, prompt, url);
    });
    setSelectedCharacterId(QUICK_GEN_CHARACTER_ID);
  };

  return (
    <div className="flex flex-col h-screen w-screen font-sans bg-slate-900">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          characters={characters}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={setSelectedCharacterId}
          onAddCharacter={addCharacter}
          onDeleteCharacter={deleteCharacter}
        />
        <div className="flex flex-col flex-grow relative">
            <div className="absolute bottom-4 right-6 z-20">
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
      </div>
      
      <Footer />
      
      {modalImage && (
        <ImageModal 
          image={modalImage}
          characterName={characterForModal?.name}
          onClose={() => setModalImage(null)}
          onImageUpdate={handleImageUpdate}
          allGeneratedImages={allGeneratedImagesForChar}
          onSelectImage={setModalImage}
          characterReferenceImages={characterForModal?.referenceImages}
        />
      )}

      {showStandaloneGenerator && (
        <StandaloneGenerator 
            onClose={() => setShowStandaloneGenerator(false)} 
            onImagesGenerated={handleQuickGenerate}
        />
      )}
    </div>
  );
}

export default App;