export enum AdStyle {
  ECOMMERCE = 'Ecommerce Product Shot',
  SOCIAL_MEDIA = 'Social Media Placement',
  UGC = 'User Generated Content (UGC)',
  TESTIMONIAL = 'Testimonial / Reviews',
  BENEFIT = 'Benefit Oriented',
  LIFESTYLE = 'Lifestyle',
  STUDIO = 'Professional Studio',
  PINTEREST = 'Pinterest Aesthetic',
  CELEBRITY = 'Celebrity Endorsement',
  IPHONE = 'iPhone Realistic',
  BEFORE_AFTER = 'Before & After',
  MINIMALIST = 'Minimalist Luxury',
  NEON_CYBERPUNK = 'Neon / Cyberpunk'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  CLASSIC = '4:3',
  WIDE = '3:4'
}

export enum ModelType {
  GEMINI_3_PRO = 'gemini-3-pro-image-preview',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash-image'
}

export interface AdConfiguration {
  style: AdStyle;
  aspectRatio: AspectRatio;
  model: ModelType;
  referenceImageUrl?: string | null; // New field for style reference
  price?: string;
  offerDetails?: string;
  benefitText?: string;
  celebrityName?: string;
  customContext?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}