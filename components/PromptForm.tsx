import React, { useRef } from 'react';
import { SparklesIcon, ArrowRightIcon, ImageIcon, XCircleIcon } from './Icons';

interface PromptFormProps {
  onGenerate: () => void;
  isLoading: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  imagePreviewUrl: string | null;
}

const PromptForm: React.FC<PromptFormProps> = ({
  onGenerate,
  isLoading,
  prompt,
  setPrompt,
  onImageChange,
  onRemoveImage,
  imagePreviewUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() || imagePreviewUrl) {
      onGenerate();
    }
  };
  
  const placeholderText = imagePreviewUrl 
    ? "e.g., Make it feel more cinematic..."
    : "e.g., Cozy autumn cabin...";

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-4">
      {imagePreviewUrl && (
        <div className="relative w-full max-w-sm">
          <img src={imagePreviewUrl} alt="Image preview" className="rounded-lg w-full h-auto object-contain max-h-64" />
          <button
            onClick={onRemoveImage}
            className="absolute top-2 right-2 bg-gray-900/50 hover:bg-gray-900/80 rounded-full text-white transition-colors"
            aria-label="Remove image"
            disabled={isLoading}
          >
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex items-center gap-2 bg-gray-800 border-2 border-gray-700 rounded-lg focus-within:border-indigo-500 transition-colors duration-300">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"
            aria-label="Upload an image"
            disabled={isLoading}
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            disabled={isLoading}
          />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholderText}
            className="w-full bg-transparent p-3 pr-12 focus:outline-none text-white resize-none h-14"
            rows={1}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <SparklesIcon className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
        <button
          type="submit"
          disabled={isLoading || (!prompt.trim() && !imagePreviewUrl)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 h-14 shrink-0"
        >
          {isLoading ? (
             <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
          ) : (
            <>
              <span>Generate</span>
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
