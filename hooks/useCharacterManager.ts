
import { useState, useCallback } from 'react';
import { Character, Image, GeneratedImage } from '../types';
import { fileToDataUrl } from '../utils/fileUtils';

const initialCharacters: Character[] = [
    // You can add default characters here for testing
];

export const useCharacterManager = () => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    initialCharacters.length > 0 ? initialCharacters[0].id : null
  );

  const addCharacter = useCallback((name: string) => {
    if (!name.trim()) return;
    const newCharacter: Character = {
      id: `char_${Date.now()}`,
      name,
      referenceImages: [],
      generatedImages: [],
    };
    setCharacters(prev => [...prev, newCharacter]);
    setSelectedCharacterId(newCharacter.id);
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
    if (selectedCharacterId === id) {
      setSelectedCharacterId(characters.length > 1 ? characters.filter(c => c.id !== id)[0].id : null);
    }
  }, [characters, selectedCharacterId]);

  const addReferenceImages = useCallback(async (characterId: string, files: FileList) => {
    const imagePromises = Array.from(files).map(file => fileToDataUrl(file));
    const dataUrls = await Promise.all(imagePromises);

    const newImages: Image[] = dataUrls.map(url => ({
      id: `ref_${Date.now()}_${Math.random()}`,
      dataUrl: url,
    }));

    setCharacters(prev => prev.map(c => 
      c.id === characterId ? { ...c, referenceImages: [...c.referenceImages, ...newImages] } : c
    ));
  }, []);
  
  const deleteReferenceImage = useCallback((characterId: string, imageId: string) => {
    setCharacters(prev => prev.map(c => 
      c.id === characterId ? { ...c, referenceImages: c.referenceImages.filter(img => img.id !== imageId) } : c
    ));
  }, []);

  const addGeneratedImage = useCallback((characterId: string, prompt: string, dataUrl: string, parentId?: string) => {
    const newImage: GeneratedImage = {
      id: `gen_${Date.now()}`,
      dataUrl,
      prompt,
      characterId,
      parentId,
    };
    setCharacters(prev => prev.map(c => 
      c.id === characterId ? { ...c, generatedImages: [newImage, ...c.generatedImages] } : c
    ));
  }, []);
  
  const deleteGeneratedImage = useCallback((characterId: string, imageId: string) => {
    setCharacters(prev => prev.map(c => 
      c.id === characterId ? { ...c, generatedImages: c.generatedImages.filter(img => img.id !== imageId) } : c
    ));
  }, []);

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId) || null;

  return {
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
  };
};