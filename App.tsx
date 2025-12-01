import React, { useState, useEffect } from 'react';
import { AdStyle, AspectRatio, AdConfiguration, ModelType } from './types';
import { generateAdImages } from './services/geminiService';
import StyleSelector from './components/StyleSelector';
import ImageUploader from './components/ImageUploader';
import { Sparkles, Download, Loader2, AlertCircle, Maximize2, X, KeyRound, Crown, Zap, ImagePlus } from 'lucide-react';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  const [config, setConfig] = useState<AdConfiguration>({
    style: AdStyle.SOCIAL_MEDIA,
    aspectRatio: AspectRatio.SQUARE,
    model: ModelType.GEMINI_2_5_FLASH // Default to the faster/free option
  });

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio && await (window as any).aistudio.hasSelectedApiKey()) {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    // Strict check for Pro model
    if (config.model === ModelType.GEMINI_3_PRO && !hasKey) {
       const confirm = window.confirm("Gemini 3 Pro requires a selected paid API Key. Would you like to select one now?");
       if (confirm) {
         await handleSelectKey();
         // Don't proceed immediately, let user re-click after selecting
         return; 
       } else {
         return;
       }
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const fullConfig = { ...config, referenceImageUrl: referenceImage };
      const images = await generateAdImages(selectedImage, fullConfig);
      if (images.length === 0) {
        throw new Error("Failed to generate any images. The model might be busy or the request was blocked.");
      }
      setGeneratedImages(images);
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred.";
      if (errorMessage.includes("Requested entity was not found") || errorMessage.includes("API Key is missing")) {
        setHasKey(false);
        // If it failed due to missing key, prompt user
        if (config.model === ModelType.GEMINI_3_PRO) {
             setError("Access denied. Gemini 3 Pro requires a valid API key.");
        } else {
             // For Flash, if it fails, it might be due to missing env key entirely
             setError("API Key missing. Please select a key.");
             await handleSelectKey();
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ad-genius-generated-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col md:flex-row">
      
      {/* Left Sidebar - Controls */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex-shrink-0 bg-slate-900 border-r border-slate-800 h-screen overflow-y-auto custom-scrollbar p-6 flex flex-col">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="text-indigo-400" />
              AdGenius AI
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Turn product photos into ads.
            </p>
          </div>
          <button 
            onClick={handleSelectKey}
            className={`p-2 rounded-full transition-colors ${hasKey ? 'text-green-400 bg-green-400/10' : 'text-slate-500 hover:text-indigo-400 hover:bg-slate-800'}`}
            title={hasKey ? "API Key Selected" : "Select API Key"}
          >
            <KeyRound size={20} />
          </button>
        </div>

        <div className="space-y-8 flex-1">
          <section>
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">1. Upload Product</h2>
            <ImageUploader
              label="Upload Product Image"
              description="This is the main subject"
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              onClear={() => {
                setSelectedImage(null);
                setGeneratedImages([]);
              }}
              disabled={isGenerating}
            />
          </section>

          <section>
             <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">2. Configure Ad</h2>
             <StyleSelector 
               config={config} 
               onChange={setConfig} 
               disabled={isGenerating}
             />
          </section>

          <section className="pb-4">
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">3. Reference Image (Optional)</h2>
             <ImageUploader
              label="Upload Reference Style"
              description="Mimic the look/vibe of this image"
              icon={<ImagePlus className="w-8 h-8 text-purple-400" />}
              selectedImage={referenceImage}
              onImageSelect={setReferenceImage}
              onClear={() => setReferenceImage(null)}
              disabled={isGenerating}
            />
          </section>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-800 sticky bottom-0 bg-slate-900 pb-2 z-10">
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
              !selectedImage || isGenerating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:scale-[1.02]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Generating Variations...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate 3 Variations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Area - Gallery / Preview */}
      <div className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto">
        
        {!selectedImage && !isGenerating && generatedImages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center">
              <Sparkles size={40} className="text-slate-700" />
            </div>
            <p className="text-lg font-medium">Ready to create magic?</p>
            <p className="max-w-md text-center text-sm">
              Upload a product image on the left, choose your style, and watch AI generate professional marketing assets in seconds.
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
                ))}
             </div>
             <p className="text-indigo-300 font-medium">Generating high-fidelity ads...</p>
          </div>
        )}

        {error && (
           <div className="w-full max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-start gap-3">
             <AlertCircle className="flex-shrink-0 mt-1" />
             <div>
               <h3 className="font-bold">Generation Failed</h3>
               <p className="text-sm mt-1">{error}</p>
               {!hasKey && (
                 <button onClick={handleSelectKey} className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-md transition-colors">
                   Select API Key
                 </button>
               )}
             </div>
           </div>
        )}

        {generatedImages.length > 0 && !isGenerating && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white">Generated Results</h2>
                {referenceImage && (
                  <span className="text-xs text-purple-300 flex items-center gap-1 mt-1">
                    <ImagePlus size={12} /> Inspired by Reference Image
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
                 {config.model === ModelType.GEMINI_3_PRO ? <Crown size={12} className="text-purple-400" /> : <Zap size={12} className="text-indigo-400" />}
                 {config.style}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {generatedImages.map((imgUrl, idx) => (
                <div key={idx} className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 transition-transform hover:-translate-y-1">
                  <div 
                    className="relative w-full cursor-pointer bg-slate-900" 
                    style={{ paddingTop: config.aspectRatio === AspectRatio.PORTRAIT ? '177%' : config.aspectRatio === AspectRatio.LANDSCAPE ? '56.25%' : '100%' }}
                    onClick={() => setPreviewImage(imgUrl)}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Generated ad ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button 
                         onClick={(e) => { e.stopPropagation(); setPreviewImage(imgUrl); }}
                         className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-transform hover:scale-110"
                         title="View Fullscreen"
                       >
                         <Maximize2 size={20} />
                       </button>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between bg-slate-800 border-t border-slate-700">
                    <span className="text-xs font-mono text-slate-400">VAR_{idx + 1}</span>
                    <button 
                      onClick={() => handleDownload(imgUrl, idx)}
                      className="flex items-center space-x-2 text-xs font-bold text-indigo-300 hover:text-white transition-colors"
                    >
                      <Download size={14} />
                      <span>SAVE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-slate-700"
            />
             <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;