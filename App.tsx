import React, { useState, useCallback, useEffect } from 'react';
import { Palette } from './types';
import { generateColorPalette } from './services/geminiService';
import PromptForm from './components/PromptForm';
import ColorPaletteDisplay from './components/ColorPaletteDisplay';
import Loader from './components/Loader';
import { SparklesIcon } from './components/Icons';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const data = result.split(',')[1];
      resolve({ data, mimeType: file.type });
    };
    reader.onerror = error => reject(error);
  });
};

function App() {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<{ base64: { data: string; mimeType: string; }; previewUrl: string; } | null>(null);

  const handleRemoveImage = useCallback(() => {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }
    setImage(null);
  }, [image]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous image if any
      handleRemoveImage();
      // Set loading state for image processing
      setIsLoading(true);
      setError(null);
      try {
        const base64 = await fileToBase64(file);
        const previewUrl = URL.createObjectURL(file);
        setImage({ base64, previewUrl });
      } catch (e) {
        setError("Could not process image file. Please try another one.");
      } finally {
        setIsLoading(false);
      }
    }
    // Reset file input value to allow re-uploading the same file
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt && !image) return;
    setIsLoading(true);
    setError(null);
    setPalette(null);
    try {
      const newPalette = await generateColorPalette(prompt, image?.base64 || null);
      setPalette(newPalette);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, image]);

  // Clean up object URL on component unmount
  useEffect(() => {
    return () => {
        if (image?.previewUrl) {
            URL.revokeObjectURL(image.previewUrl);
        }
    }
  }, [image?.previewUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-8">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
              AI Color Palette Generator
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl">
            Describe a theme, upload an image, or both to generate a unique color palette.
          </p>
        </header>

        <PromptForm
          onGenerate={handleGenerate}
          isLoading={isLoading}
          prompt={prompt}
          setPrompt={setPrompt}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          imagePreviewUrl={image?.previewUrl || null}
        />

        <div className="w-full mt-10">
          {isLoading && !palette && <Loader />}
          {error && (
            <div className="text-center p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="font-semibold">An error occurred</p>
              <p className="text-red-300">{error}</p>
            </div>
          )}
          {palette && <ColorPaletteDisplay palette={palette} />}
          {!isLoading && !error && !palette && (
             <div className="text-center text-gray-500 pt-16">
                <p>Your generated palette will appear here.</p>
                <p className="text-sm">Try "Misty forest at dawn" or upload an image.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
