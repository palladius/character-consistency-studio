
import { GoogleGenAI, Modality } from "@google/genai";
import { Image } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};


const getMimeType = (dataUrl: string): string => {
    return dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
};

export const generateWithCharacter = async (prompt: string, referenceImages: Image[]): Promise<string> => {
    const gemini = getAI();
    
    const imageParts = referenceImages.map(img => ({
        inlineData: {
            data: img.dataUrl.split(",")[1],
            mimeType: getMimeType(img.dataUrl),
        },
    }));

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                ...imageParts,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData) {
        const base64ImageBytes: string = imagePart.inlineData.data;
        return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
    }

    if (response.promptFeedback?.blockReason) {
        throw new Error(`Image generation blocked: ${response.promptFeedback.blockReason}. ${response.promptFeedback.blockReasonMessage || ''}`);
    }

    throw new Error("No image generated. The model did not return an image.");
};

export const editImage = async (prompt: string, baseImage: Image): Promise<string> => {
    const gemini = getAI();

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: baseImage.dataUrl.split(",")[1],
                        mimeType: getMimeType(baseImage.dataUrl),
                    },
                },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData) {
        const base64ImageBytes: string = imagePart.inlineData.data;
        return `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
    }

    if (response.promptFeedback?.blockReason) {
        throw new Error(`Image editing blocked: ${response.promptFeedback.blockReason}. ${response.promptFeedback.blockReasonMessage || ''}`);
    }
    
    throw new Error("No image edited. The model did not return an image.");
};

export const upscaleImage = async (baseImage: Image): Promise<string> => {
    const upscalePrompt = "Upscale this image to a higher resolution. Enhance details, sharpness, and clarity without altering the subject or composition. Generate a photorealistic high-quality version.";
    return editImage(upscalePrompt, baseImage);
};


export const generateImage = async (prompt: string): Promise<string> => {
    const gemini = getAI();
    
    const response = await gemini.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }

    if (response.promptFeedback?.blockReason) {
        throw new Error(`Image generation blocked: ${response.promptFeedback.blockReason}. ${response.promptFeedback.blockReasonMessage || ''}`);
    }

    throw new Error("No image generated with imagen-4.0");
};