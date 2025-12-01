import React from 'react';
import { AdStyle, AspectRatio, AdConfiguration, ModelType } from '../types';
import { 
  ShoppingBag, 
  Smartphone, 
  User, 
  Star, 
  Zap, 
  Coffee, 
  Camera, 
  Palette, 
  Users, 
  Aperture,
  Grid,
  Crown
} from 'lucide-react';

interface StyleSelectorProps {
  config: AdConfiguration;
  onChange: (newConfig: AdConfiguration) => void;
  disabled: boolean;
}

const StyleIcons: Record<AdStyle, React.ReactNode> = {
  [AdStyle.ECOMMERCE]: <ShoppingBag className="w-4 h-4" />,
  [AdStyle.SOCIAL_MEDIA]: <Smartphone className="w-4 h-4" />,
  [AdStyle.UGC]: <User className="w-4 h-4" />,
  [AdStyle.TESTIMONIAL]: <Star className="w-4 h-4" />,
  [AdStyle.BENEFIT]: <Zap className="w-4 h-4" />,
  [AdStyle.LIFESTYLE]: <Coffee className="w-4 h-4" />,
  [AdStyle.STUDIO]: <Camera className="w-4 h-4" />,
  [AdStyle.PINTEREST]: <Grid className="w-4 h-4" />,
  [AdStyle.CELEBRITY]: <Users className="w-4 h-4" />,
  [AdStyle.IPHONE]: <Aperture className="w-4 h-4" />,
  [AdStyle.BEFORE_AFTER]: <div className="text-xs font-bold">B/A</div>,
  [AdStyle.MINIMALIST]: <div className="w-4 h-4 border border-current rounded-full" />,
  [AdStyle.NEON_CYBERPUNK]: <Zap className="w-4 h-4 text-cyan-400" />,
};

const StyleSelector: React.FC<StyleSelectorProps> = ({ config, onChange, disabled }) => {
  
  const handleChange = (key: keyof AdConfiguration, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">

      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          AI Model
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            disabled={disabled}
            onClick={() => handleChange('model', ModelType.GEMINI_2_5_FLASH)}
            className={`flex items-center justify-center space-x-2 py-2 rounded-md text-sm font-medium transition-all ${
              config.model === ModelType.GEMINI_2_5_FLASH
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Zap size={14} />
            <span>Gemini 2.5 (Fast)</span>
          </button>
          <button
            disabled={disabled}
            onClick={() => handleChange('model', ModelType.GEMINI_3_PRO)}
            className={`flex items-center justify-center space-x-2 py-2 rounded-md text-sm font-medium transition-all ${
              config.model === ModelType.GEMINI_3_PRO
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Crown size={14} />
            <span>Gemini 3 Pro</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 px-1">
          {config.model === ModelType.GEMINI_3_PRO 
            ? "High Quality. Requires Paid API Key." 
            : "Faster generation. Good for quick iterations."}
        </p>
      </div>
      
      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Format / Aspect Ratio</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(AspectRatio).map((ratio) => (
            <button
              key={ratio}
              disabled={disabled}
              onClick={() => handleChange('aspectRatio', ratio)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                config.aspectRatio === ratio
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-slate-500'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Style Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Ad Style</label>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {Object.values(AdStyle).map((style) => (
            <button
              key={style}
              disabled={disabled}
              onClick={() => handleChange('style', style)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg border text-left transition-all ${
                config.style === style
                  ? 'bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-500/20'
                  : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-750 hover:border-slate-600'
              }`}
            >
              <div className={`p-2 rounded-md ${config.style === style ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                {StyleIcons[style]}
              </div>
              <span className="text-sm font-medium">{style}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Fields */}
      <div className="space-y-4 pt-4 border-t border-slate-700">
        
        {config.style === AdStyle.ECOMMERCE && (
          <>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Price (Optional)</label>
              <input
                type="text"
                disabled={disabled}
                placeholder="$29.99"
                value={config.price || ''}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Offer Details</label>
              <input
                type="text"
                disabled={disabled}
                placeholder="Free Shipping / 50% Off"
                value={config.offerDetails || ''}
                onChange={(e) => handleChange('offerDetails', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </>
        )}

        {config.style === AdStyle.BENEFIT && (
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Main Benefit</label>
            <textarea
              disabled={disabled}
              placeholder="e.g. Removes wrinkles in 5 minutes..."
              value={config.benefitText || ''}
              onChange={(e) => handleChange('benefitText', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none h-20"
            />
          </div>
        )}

        {config.style === AdStyle.CELEBRITY && (
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Celebrity Name (Style Reference)</label>
            <input
              type="text"
              disabled={disabled}
              placeholder="e.g. Dwayne Johnson"
              value={config.celebrityName || ''}
              onChange={(e) => handleChange('celebrityName', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs text-gray-400">Additional Context (Optional)</label>
          <textarea
             disabled={disabled}
            placeholder="Any other details? e.g. Make it dark and moody, or use pink flowers..."
            value={config.customContext || ''}
            onChange={(e) => handleChange('customContext', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none h-20"
          />
        </div>

      </div>
    </div>
  );
};

export default StyleSelector;