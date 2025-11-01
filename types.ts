export interface Image {
  id: string;
  dataUrl: string;
}

export interface GeneratedImage extends Image {
  prompt: string;
  characterId: string;
  parentId?: string;
}

export interface Character {
  id:string;
  name: string;
  referenceImages: Image[];
  generatedImages: GeneratedImage[];
}