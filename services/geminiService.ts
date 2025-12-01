import { GoogleGenAI } from "@google/genai";
import { AdStyle, AdConfiguration, ModelType } from "../types";

// Helper to remove data URL prefix for API
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.split(',')[1];
};

/**
 * Returns technical camera specifications to force realism or specific art styles.
 * These serve as a baseline, but the detailed variations below provide the specific artistic direction.
 */
const getTechnicalSpecs = (style: AdStyle): string => {
  const specs = {
    [AdStyle.UGC]: "CAMERA: Shot on iPhone 15 Pro Max. LENS: 24mm. LIGHTING: Natural, slightly messy mixed lighting. TEXTURE: Digital noise, unpolished, authentic social media look.",
    [AdStyle.IPHONE]: "CAMERA: iPhone 15 Raw. LIGHTING: Direct hard flash (papazzi style) or low-light night mode. VIBE: Candid, snapshot, unedited aesthetic.",
    [AdStyle.NEON_CYBERPUNK]: "RENDER: Unreal Engine 5 / Octane. FEATURES: Ray-tracing, volumetric fog, neon emission shaders, chromatic aberration. RES: 8K.",
    [AdStyle.SOCIAL_MEDIA]: "CAMERA: Sony A7S III. LENS: 16-35mm Wide. COLOR: High saturation, 'Dopamine' color grading, high contrast, sharp clarity. VIBE: Viral, scroll-stopping.",
    [AdStyle.MINIMALIST]: "CAMERA: Hasselblad H6D-100c. LIGHTING: Soft global illumination, no harsh shadows. PALETTE: Monochromatic, matte textures.",
    [AdStyle.STUDIO]: "CAMERA: Phase One XF IQ4. LENS: Macro 120mm. LIGHTING: Broncolor Para 133, rim lighting, specular highlights. QUALITY: Ultra-high-end commercial advertising.",
    [AdStyle.ECOMMERCE]: "CAMERA: Canon R5. LIGHTING: Even, shadowless high-key lighting (lightbox). BG: Pure white #FFFFFF or #F5F5F5.",
    [AdStyle.LIFESTYLE]: "CAMERA: Fujifilm GFX 100. LENS: 80mm f/1.7. LIGHTING: Natural window light, golden hour sun flares. DEPTH: Shallow depth of field (Bokeh).",
    // Default high quality for others
    DEFAULT: "CAMERA: Professional DSLR (Canon/Sony). LIGHTING: Cinematic commercial lighting. RES: 4K, razor sharp focus on product."
  };

  if ([AdStyle.TESTIMONIAL, AdStyle.BENEFIT, AdStyle.PINTEREST, AdStyle.CELEBRITY, AdStyle.BEFORE_AFTER].includes(style)) {
    return specs.DEFAULT;
  }
  
  return specs[style] || specs.DEFAULT;
};

/**
 * Returns 3 distinct conceptual variations for a given style.
 * Index 0 = Variation 1
 * Index 1 = Variation 2
 * Index 2 = Variation 3
 */
const getStyleVariation = (style: AdStyle, index: number, config: AdConfiguration): string => {
  const { price, offerDetails, benefitText, celebrityName } = config;

  switch (style) {
    case AdStyle.ECOMMERCE:
      if (index === 0) return `
        CONCEPT: Clean Marketplace Hero.
        Transform this product into a professional e-commerce hero image with the following specifications: Place on a pure #f8f8f8 background with seamless gradient. Apply three-point studio lighting - key light at 45° left creating soft highlights, fill light right side at 50% intensity to eliminate harsh shadows, rim light from behind-right for edge definition. Add realistic contact shadow with 15% opacity, 20px blur radius. Ensure product is perfectly centered, occupies 65% of frame, shot from eye-level angle. Enhance micro-textures, material details, and surface qualities. Maintain accurate color representation and proportions.
        ${price ? `ADDITIONAL ELEMENT: Incorporate a minimalist, elegant price tag showing "$${price}" floating near the product.` : ''}
        ${offerDetails ? `ADDITIONAL ELEMENT: Include subtle text graphic indicating "${offerDetails}".` : ''}
      `;
      if (index === 1) return `
        CONCEPT: White Studio Premium Look.
        Create a luxury white studio product photograph simulating an 85mm f/2.8 lens at f/8 for maximum sharpness. Pure white seamless backdrop (#FFFFFF) with subtle 3% gray gradient towards bottom for depth. Position product on invisible acrylic surface creating natural mirror reflection at 25% opacity. Implement soft butterfly lighting setup - large softbox overhead-front creating wraparound illumination, edge lights at 30° angles for dimension. Ensure ultra-crisp focus on product, micro-contrast enhancement, subtle vignette (5% darkness at edges). Zero background noise, clinical precision, commercial photography perfection.
      `;
      return `
        CONCEPT: Marketplace Thumbnail Optimized.
        Optimize for marketplace conversion with these parameters: Bright neutral background (#FAFAFA to #FFFFFF gradient), product isolated with clean alpha edges using 2px feather. Boost overall brightness +15%, contrast +20%, saturation +10% for screen visibility. Apply subtle clarity enhancement to product edges without creating halos. Position product in upper-center occupying 70% of vertical space. Add barely-visible drop shadow (5% black, 8px offset, 15px blur) for lift. Color-correct to match real-world appearance under D65 illumination. Remove any distracting elements, watermarks, or text.
      `;

    case AdStyle.SOCIAL_MEDIA:
      if (index === 0) return `
        CONCEPT: High-Energy Dynamic Format.
        Take the uploaded product image and place it as a centrally-positioned floating hero element. The composition uses a dynamic radial starburst or lightning bolt pattern radiating from the center in a primary color matching the product and a complementary electric secondary color.
        
        VISUAL ELEMENTS:
        - Intense radiant energy lines or electrical bolts surrounding the product.
        - Dramatic lighting with bright highlights on product surfaces.
        - Depth of field with sharp product focus and soft blurred background.
        - Subtle particle effects, motion blur trails, or energy waves emanating from product.
        - Strong shadows and light rays creating sense of power and movement.
        - High contrast between product and background.
        - Product appears to be floating or elevated with dramatic shadow beneath.
        
        LIGHTING & ATMOSPHERE:
        Enhance the product with bright, studio-quality lighting with strategic rim lighting and front highlights. Color saturation should be intense and motivational. The overall feeling should convey power, speed, innovation, and immediate action.
        
        COMPOSITION:
        Center-aligned, floating product appearance with product occupying 35-45% of frame.
        
        PROCESSING:
        Enhance product clarity, adjust brightness/contrast for maximum visibility against energetic background.
      `;
      if (index === 1) return `
        CONCEPT: Premium Modern Product Showcase Format.
        Take the uploaded product and present it as the dominant visual hero, emphasizing modern design and quality craftsmanship. Position the product to highlight its best angles, details, and materials.
        
        PRODUCT POSITIONING:
        - Angle product at 45° perspective or front-facing view to showcase form and quality.
        - Create floating or elevated appearance with subtle shadow beneath.
        - Enhance clarity and visibility of product details, textures, and premium materials.
        - Adjust brightness to reveal fine details and material quality.
        
        BACKGROUND TREATMENT:
        - Apply sophisticated gradient background (Deep Purple, Navy, or Charcoal fading to lighter tone) suggesting premium quality.
        - Add subtle geometric elements, light particle effects, or bokeh in background.
        - Maintain clean, minimal aesthetic.
        - Strong visual separation from product.
        
        LIGHTING ENHANCEMENT:
        - Apply professional studio-grade lighting.
        - Add rim lighting on product edges for definition and luxury feel.
        - Enhance highlight reflections showing product quality and materials.
        - Create high contrast between product and background.
        - Suggest motion or energy through subtle light rays or particle effects.
      `;
      return `
        CONCEPT: Vibrant Marketplace Format.
        Take the uploaded product and present it in a vibrant, eye-catching composition with bold, saturated colors and dynamic energy.
        
        VISUAL TREATMENT:
        - Product positioned as dominant hero (35-40% of frame).
        - Bright, saturated color background (Pick a dominant vibrant color from the product's palette).
        - Dynamic diagonal lines, geometric shapes, or abstract elements suggesting movement.
        - Crisp, clean product presentation with maximum clarity.
        - Strong shadows and highlights creating dimension.
        - High visual energy and movement.
        
        LIGHTING:
        - Bright, cheerful studio lighting.
        - Clear product visibility against vibrant background.
        - Enhanced color saturation for maximum appeal.
        - Sharp focus and clarity.
        
        BACKGROUND ELEMENTS:
        - Bold, solid color or vibrant gradient.
        - Geometric patterns, abstract shapes, diagonal elements.
        - High contrast with product.
        - Clean, modern aesthetic.
        
        OPTIMIZATION:
        Sharpen details, enhance colors, increase vibrancy, ensure maximum pop against background. Mood: Energetic, fun, accessible, modern, youthful.
      `;

    case AdStyle.UGC:
      if (index === 0) return `
        CONCEPT: Handheld Realism.
        Simulate authentic mobile-captured UGC photo: Replicate smartphone camera characteristics - slightly wider angle of view (28mm equivalent), natural perspective distortion, HDR processing look with balanced highlights and shadows. Lighting from available sources - ceiling lights, window light, or mixed indoor ambient creating realistic but uncontrolled shadows. Add subtle motion blur edge (1-2px) suggesting handheld capture. Include minor imperfections: slight tilt (2-3° off-level), not perfectly centered composition, realistic digital noise in shadows (ISO 400-800 equivalent). Product shown in real-use context - on table, in hand, or actual usage scenario. Color profile matches smartphone processing: slightly boosted saturation, lifted shadows, controlled highlights. Maintain authentic feel over perfection - 85% sharp, natural light falloff, genuine atmosphere.
      `;
      if (index === 1) return `
        CONCEPT: Casual Home Scene.
        Create convincing customer testimonial photo aesthetic: Home environment setting with natural window light as primary source - soft, directional, creating organic shadows and highlights. Product placed on real surfaces: wooden table, kitchen counter, bedside table, desk with natural wear and texture visible. Background shows authentic home details: blurred furniture, wall, plants, books - lived-in feeling. Apply window light characteristics: gentle falloff, color temperature 5000-6500K depending on time of day, subtle ambient bounce from walls. Include realistic reflections on surfaces. Add organic camera shake blur (very subtle), natural color balance without heavy editing, slight chromatic aberration in corners for lens authenticity. Grain structure matching older smartphone or casual camera (ISO 200-400). Composition casual but product clearly featured.
      `;
      return `
        CONCEPT: Daily Life UGC Look.
        Generate daily-routine authentic content style: Workspace or home setting during actual use - morning desk, evening relaxation, daily ritual context. Mixed lighting creating realistic ambiance - combination of natural window light and artificial indoor lighting (LED warmth ~3000K), creating authentic color temperature mix. Background intentionally includes daily life: laptop, notebook, coffee mug, phone - creating relatable narrative. Apply gentle background blur (f/5.6 equivalent) keeping context readable but focus on product. Soft overall exposure, lifted shadows revealing details, highlights controlled naturally. Add subtle film grain (4%), minor lens distortion at edges, realistic color science without Instagram filters. Product interaction suggested - angle showing use case, natural placement in routine. Include authentic imperfections: not perfectly clean background, slight overexposure from window, natural shadow patterns.
      `;

    case AdStyle.TESTIMONIAL:
      if (index === 0) return `
        CONCEPT: Review Visual.
        Design customer review accompanying image: Clean but approachable setting - simple background with minimal distraction (solid wall, clean surface, neutral space) in warm neutral tones (#E8E4DF to #F5F3F0). Friendly lighting setup: soft overhead-front light creating open, inviting shadows, color temperature 4000K for warm welcoming feel. Product positioned to show key features clearly - slight 3/4 angle revealing dimension and detail. Apply trust-building color treatment: natural accurate colors, slight warmth in highlights (+5 temperature), shadows lifted +10 for openness and honesty feel. Include subtle environmental context suggesting real customer ownership - edge of table, partial background room element, lived-with quality. Sharpness on product with gentle background softness (f/8 equivalent). Add barely perceptible grain (2%) for organic authenticity. Composition balanced but not overly professional - genuine customer care visible.
      `;
      if (index === 1) return `
        CONCEPT: Social Proof Look.
        Create authentic post-purchase customer sharing photo: Cozy lifestyle environment - home living room, personal workspace, or bedroom setting with warm inviting atmosphere. Natural mixed lighting: window light combined with warm interior lighting creating homey ambiance (2800-4500K color temperature range). Product shown in actual use context or unboxing moment - on lap, on couch, fresh from package with subtle packaging elements visible. Background deliberately casual: blurred sofa, bookshelf, wall art, plants - personal space indicators. Apply realistic smartphone photo processing: moderate saturation, lifted blacks, HDR tone-mapping look, slight clarity boost. Include authentic composition imperfections: slightly off-center, captured moment feel, natural shadows from surroundings. Subtle vignette (8%) creating intimate focus. Soft overall sharpness (90% crisp) suggesting quick genuine capture. Fine noise in darker areas (ISO 320 equivalent).
      `;
      return `
        CONCEPT: Trust Anchor Visual.
        Generate trustworthiness-focused testimonial imagery: Neutral warm environment creating comfort and reliability - soft beige/cream backgrounds (#EDE7E1), clean uncluttered surfaces, gentle ambient atmosphere. Implement reassuring lighting: diffused even illumination from front-top preventing harsh shadows, color temperature 4200K for warm professional trust balance. Product clearly visible showing quality and detail - positioned at comfortable viewing angle (15° from straight-on), occupying 50-60% of frame. Apply subtle emotional color grading: warm shadows, neutral mid-tones, slightly cool highlights for premium feel, overall lifted exposure conveying openness. Background minimal but relatable - hint of home/office environment creating connection without distraction. Sharpness distribution: product critically sharp, background gentle softness (f/11 equivalent depth). Include subtle quality indicators: good lighting revealing texture, clean presentation, honest representation.
      `;

    case AdStyle.BENEFIT:
      const benefit = benefitText || "Improved Quality of Life";
      if (index === 0) return `
        CONCEPT: Outcome Visualization.
        Create benefit-demonstration visual narrative: Split or implied comparison showing problem-solution through environmental context. Product positioned as hero solution with supporting background elements illustrating the improved outcome - organized vs cluttered, efficient vs difficult, comfortable vs uncomfortable scenario suggested through setting and lighting. Implement dramatic but realistic lighting: spotlight effect on product (key light intensity 100%, fill 30%) with background receiving 50% illumination showing context clearly. Apply visual hierarchy through focus: product sharp critical focus, benefit-context in controlled sharpness (f/8-f/11 equivalent). Color psychology application: product lit with appealing warm highlights (3800K key light), solution-space in satisfied neutral tones, subtle visual arrows created through light direction pointing toward product. Background clean professional but contextual - office for productivity, home for comfort, gym for performance based on benefit type.
        VISUAL FOCUS: Visually demonstrate the specific benefit: "${benefit}".
      `;
      if (index === 1) return `
        CONCEPT: Functional Demonstration.
        Design usage-outcome emphasis advertisement: Show product in active use context or positioned to clearly suggest function - ergonomic placement for comfort products, speed-suggesting dynamic arrangement, quality demonstrated through premium setting. Lighting emphasizes functionality: directional light highlighting key functional features, creating shadows that demonstrate form-follows-function design. Apply clarity-enhancement specifically to areas showing benefit: texture emphasis for comfort, sleek highlights for speed/efficiency, material detail for quality. Background reinforces benefit category: clean minimal for simplicity benefits, dynamic angle for performance, warm cozy for comfort, bright airy for health/wellness. Implement benefit-appropriate color treatment: energizing vibrant for performance products, soothing muted for relaxation, precise neutral for professional tools. Product positioning demonstrates ease-of-use through natural comfortable placement. Depth of field isolates product benefit zone (f/4-f/5.6). Include environmental proof elements: clean workspace for organization products, relaxed setting for comfort.
        VISUAL FOCUS: Ensure the image clearly highlights how the product achieves "${benefit}".
      `;
      return `
        CONCEPT: Transformation Emphasis.
        Generate performance-focused transformation visual: Product dominating composition (75% frame presence) as the change-agent hero. Background staging creates before-implied/after-shown narrative through environmental quality - elevated setting suggesting improvement achieved. Dramatic lighting creating transformation metaphor: strong key light from side creating definition and change separation, gradient background light from dark to bright suggesting progression. Product positioned in power position - centered or golden ratio point, elevated slightly, commanding presence. Apply premium transformation color grading: deep rich shadows showing depth of change, luminous highlights on product suggesting elevation, saturated product colors against more muted environment creating pop and focus. Background elements subtly suggest result category: success context for achievement products, health environment for wellness, premium space for luxury. Include visual energy through light rays, glow effects (subtle 10-15% opacity), or contrast edges. Sharp detail on product with background at f/5.6 equivalent.
        VISUAL FOCUS: The transformation topic is "${benefit}".
      `;

    case AdStyle.LIFESTYLE:
      if (index === 0) return `
        CONCEPT: Natural Use Case.
        Create authentic day-in-life product integration: Place product within genuine daily activity scene - morning routine (bathroom counter, kitchen), work session (desk, coffee shop), evening wind-down (living room, bedroom). Natural available lighting simulation: soft window light as primary source (north-facing window quality, 6000K), ambient room lights as fill (3000K LED warmth), creating realistic mixed-temperature environment. Product positioned organically within scene as natural participant, not staged focal point - 35-45% of composition, allowing lifestyle context to tell story. Apply realistic depth of field: f/4-f/5.6 equivalent keeping product and immediate interaction zone sharp, background contextual environment in gentle focus. Color treatment natural lifestyle editorial: true-to-life colors, subtle warmth boost (+8), lifted shadows showing environment details, controlled highlights maintaining window detail. Include authentic scene elements: user belongings, daily items, lived-in textures. Capture moment feeling - as if photographed during actual use.
      `;
      if (index === 1) return `
        CONCEPT: Aspirational Look.
        Design upward-lifestyle aspiration imagery: Elevated environment suggesting desired lifestyle - modern apartment with design furniture, trendy café corner, boutique hotel room aesthetic, curated workspace. Implement golden hour or sophisticated lighting: warm directional natural light (4500-5000K) creating luxury glow, gentle shadows adding dimension and aspiration depth. Product integrated into aspirational scene maintaining relatability - achievable aspiration not fantasy. Apply aspirational color grading: lifted overall exposure suggesting brightness of ideal life, warm golden shadows, slight teal/orange complementary split toning (shadows warm +10, highlights cool -5), enhanced vibrancy in environment (+15). Composition following aesthetic principles: rule of thirds, leading lines from environment to product, balanced negative space suggesting breathing room and success. Background styling magazine-quality but authentic: designer objects, plants, quality materials, curated imperfection. Depth at f/2.8 equivalent: product sharp, environment recognizable but dreamy. Include subtle lifestyle indicators: quality coffee, design book, premium materials.
      `;
      return `
        CONCEPT: Routine Moment.
        Capture relatable ritual moment storytelling: Specific routine scenario - morning coffee desk setup, nighttime bedside wind-down, afternoon work break, weekend relaxation moment. Time-of-day appropriate lighting: morning (cool bright 6500K from window), afternoon (warm neutral 5000K), evening (warm ambient 3000K interior lights), night (cozy 2700K bedside lamp). Product positioned as ritual participant showing regular use integration - morning (with coffee, journal, laptop), evening (with book, tea, dim lighting), weekend (casual relaxed placement). Apply moment-specific mood through color: morning fresh bright lifted, afternoon balanced natural, evening warm intimate shadows. Environmental context building routine narrative: consistent backgrounds showing same space at different times, or activity-specific settings (coffee bar for morning, reading nook for evening, patio for weekend). Depth of field matches intimacy: morning f/5.6 showing context, evening f/2.8 for cozy isolation. Include routine props creating narrative: steam from coffee, open book, phone on charging, blanket texture. Authentic imperfect composition suggesting captured moment not posed scene.
      `;

    case AdStyle.STUDIO:
      if (index === 0) return `
        CONCEPT: High-End Lighting.
        Execute professional commercial studio photography setup: Dark gradient background (#1A1A1A to #000000) creating premium dramatic space. Implement classic three-point lighting: large octabox key light camera-left 45° creating soft wrap-around illumination with defined but gentle shadow edge, fill light camera-right at 1:4 ratio maintaining shadow detail, hair/rim light from behind-right at 70° creating edge separation and dimension. Add gradient light on background: spotlight creating circular glow (#2A2A2A center) behind product for depth and focus draw. Product elevated on seamless surface with subtle reflection (20% opacity) suggesting glass or acrylic platform. Apply premium commercial retouching: enhanced micro-contrast, subtle frequency separation smoothing, specular highlights controlled and shaped. Maintain product realism - no CGI feel, accurate materials, true color under studio D65 lighting standard. Sharpness at commercial level: f/11 equivalent, focus stacking simulation if needed.
      `;
      if (index === 1) return `
        CONCEPT: Dramatic Edges.
        Create cinematic studio commercial visual: Pure black background (#000000) for maximum drama and product isolation. Implement dramatic edge lighting technique: strong rim lights from both back corners (80% intensity) creating glowing outline on product edges - emphasizing form, dimension, and premium quality. Key light from front-left softbox (60% intensity) filling product face with controlled illumination, maintaining shadow depth. Add subtle kicker light from bottom-front creating under-glow on reflective surfaces and base. Product positioned on glossy black acrylic creating mirror reflection (40-50% opacity) extending drama vertically. Apply cinematic color grading: rich deep blacks (RGB 0,0,0), controlled highlights preventing blowout, subtle warm-cool split (shadows 3200K, highlights 5600K), enhanced local contrast on product edges. Include selective glow effects on specular highlights (10% bloom). Sharpness critical on all edges - f/16 equivalent, no softness tolerance. Material rendering: metals show controlled specular, fabrics show texture detail, plastics show surface quality.
      `;
      return `
        CONCEPT: Catalog Shoot.
        Generate classic catalog photography standard: Neutral mid-gray background (#808080 to #A0A0A0 gradient) providing color-neutral reference for accurate product representation. Implement even catalog lighting: large front softbank creating shadowless illumination, overhead fill maintaining consistent brightness across product height, side fills preventing any shadow pockets. Product positioned perfectly centered, straight-on or 3/4 standard catalog angle, occupying 70% frame height following retail catalog conventions. Apply catalog color accuracy: sRGB color space, color checker referenced white balance, accurate material representation without artistic interpretation, shadows lifted to show all product details, highlights controlled showing texture in light areas. Perfect geometric alignment: product vertical lines truly vertical, horizontal lines level, symmetrical products showing perfect symmetry. Surface clean and flawless - dust removal, reflection control, seamless background. Sharpness evenly distributed: f/11-f/16 equivalent, entire product in critical focus from front to back. Include subtle shadow base (8% opacity) providing ground reference without drama.
      `;

    case AdStyle.PINTEREST:
      if (index === 0) return `
        CONCEPT: Cozy Aesthetic.
        Create Pinterest-optimized cozy aesthetic imagery: Warm neutral background palette (beige #E8DCC8, cream #F5EFE7, soft terracotta #D4A574) creating comforting color story. Implement soft diffused window lighting: gentle directional light suggesting late afternoon (4200K color temperature), creating soft shadows with high fill ratio (1:2) for that wrapped-in-warmth feeling. Product positioned within carefully curated aesthetic scene: natural textures (linen fabric, wood surface, ceramic vessels), dried florals or pampas grass, neutral-toned books, organic shapes. Apply Pinterest cozy color grading: warm lifted overall (+12 temperature), crushed shadows with brown undertones, highlights with subtle peachy glow, reduced contrast for soft gentle feel (-10 contrast, +15 shadow detail). Composition follows flat-lay or styled surface approach: overhead 45° angle, organized casual arrangement, negative space for text/pin description. Include tactile elements: knit textures, smooth ceramics, natural fibers, matte surfaces. Depth subtle: f/8 equivalent keeping styling sharp while background gently soft. Add fine grain (3%) for film-like cozy quality.
      `;
      if (index === 1) return `
        CONCEPT: Flat Lay Look.
        Design Pinterest flat-lay composition perfection: Soft pastel or neutral background - blush pink (#FAE5E5), sage green (#D4E4D8), warm white (#FDFBF7), or soft gray (#E8E8E8). Overhead directly-down perspective (90° from surface) creating classic flat-lay geometry. Implement soft even lighting: large diffused light source from camera position creating minimal shadows, subtle directional hint from top-left creating gentle dimension without harsh shadows, color temperature 5500K for natural daylight clarity. Product arranged following flat-lay principles: geometric precision, breathing room between elements, rule of thirds positioning, diagonal flow creating visual movement. Styling elements coordinated: color palette max 3-4 colors, repeated shapes creating rhythm, size variation for interest, natural organic items (flowers, leaves, coffee, fabric). Apply Pinterest-friendly processing: slightly lifted exposure for brightness, enhanced clarity on product details (+10), subtle vibrance boost (+12), soft subtle vignette (5%) drawing eye center. Shadows transparent and detailed, highlights controlled and textured. Sharpness even across plane: f/11 equivalent, consistent focus entire surface. Include subtle styling shadows for depth while maintaining airiness.
      `;
      return `
        CONCEPT: Mood Board Look.
        Generate Pinterest mood-board aesthetic visual: Cohesive color story background - monochromatic scheme or complementary palette (sage + terracotta, cream + charcoal, blush + gold). Implement aesthetic editorial lighting: soft beauty light creating gentle gradients, diffused shadows suggesting time of day (morning fresh or evening golden), color temperature matching mood (cool 6000K for fresh minimal, warm 4000K for cozy rich). Product styled within curated aesthetic composition: complementary objects telling story (vintage books for nostalgia, modern ceramics for contemporary, natural elements for organic), layered depth through foreground and background elements, color and texture coordination across all elements. Apply mood-specific color grading: minimal aesthetic (desaturated -15, lifted shadows, cool tones), warm cozy (saturated earth tones +10, warm temperature +15, rich shadows), fresh modern (bright overall, slightly cooled highlights, vibrant accents). Composition creating Pinterest-save urge: aspirational but achievable, clear focal point, visual balance, implied lifestyle narrative. Include texture variety: matte and gloss, rough and smooth, natural and refined. Depth creates dimension: f/4-f/5.6 equivalent, layered focus zones. Add subtle film character: gentle grain (2-4%), slight fade in blacks for vintage touch.
      `;

    case AdStyle.CELEBRITY:
      const celeb = celebrityName || "A Hollywood Star";
      if (index === 0) return `
        CONCEPT: Luxury Campaign Feel.
        Create high-fashion celebrity campaign aesthetic: Dramatic premium environment - black backdrop with subtle texture, spotlight isolated area, or luxury interior (marble, velvet, gold accents). Implement editorial spotlight lighting: strong focused key light creating defined shadow edge and drama (like magazine cover lighting), subtle rim lighting creating glamorous outline, controlled fill maintaining mystery in shadows (1:8 key-to-fill ratio). Product positioned as luxury object of desire - elevated on premium surface, heroic angle slightly from below suggesting aspiration, occupying 40-50% of composition with space for implied celebrity presence or hand interaction. Apply luxury editorial color grading: rich saturated colors with depth, crushed blacks creating contrast drama, golden highlights suggesting wealth (warm 3400K in highlights), cool shadows for sophistication (6500K), enhanced local contrast creating dimension. Include luxury signifiers in environment: premium materials visible, soft bokeh suggesting upscale location, subtle gold or metallic accents. Depth dramatic: f/2.8 equivalent creating separation, product critically sharp against creamy background blur. Add subtle lens characteristics: gentle vignette (15%), slight chromatic aberration on specular highlights for high-end lens feel.
        CONTEXT: The style should imply endorsement by ${celeb}.
      `;
      if (index === 1) return `
        CONCEPT: Magazine Editorial.
        Design editorial magazine endorsement photography: High-contrast editorial setup - clean white cyc wall, dramatic gray gradient, or environmental location suggesting affluence (penthouse view, luxury hotel, designer space). Implement fashion photography lighting: beauty dish or large octabox creating wraparound flattering light with defined but soft edges, hair light creating separation, kicker lights adding dimension and polish. Product integrated into editorial scene - hand-model interaction suggested through positioning, lifestyle props indicating affluent taste (designer sunglasses, luxury watch, premium materials nearby), magazine-worthy styling. Apply editorial color treatment: enhanced contrast creating punch (+25), selective color emphasis (product pops while environment slightly desaturated), cool professional temperature (5800K base), highlights protected showing texture, shadows detailed but deep. Composition following magazine layout: vertical portrait orientation accounting for text placement zones, negative space for headlines/copy, subject positioned at golden ratio points. Include editorial production values: perfectly styled environment, no casual elements, intention visible in every detail, hair and edge control. Depth suitable for cover: f/4-f/5.6 keeping product and context sharp while creating separation from background. Add magazine finishing: subtle sharpening on product edges, micro-contrast for dimension, overall polish without over-processing.
        CONTEXT: Style similar to a photoshoot for ${celeb}.
      `;
      return `
        CONCEPT: Billboard Premium Feel.
        Generate billboard-scale endorsement visual impact: Bold simple composition - solid color background or minimal gradient (deep navy #1A2B4A, rich burgundy #6B1B2E, or pure black #000000), maximum product visibility at distance, strong geometric layout. Implement dramatic advertising lighting: hard light creating defined shadows and dimension (like automotive/luxury advertising), perfect specular highlights showing premium quality, rim lighting creating luminous edges visible from distance. Product positioned for billboard hierarchy - larger than life scale (60-70% frame), power position (centered or strong third), angle suggesting confidence and aspiration (slightly from below creating importance). Apply billboard color strategy: oversaturated product colors for visibility (+30 saturation on product, environment controlled), maximum contrast for readability at distance (blacks at 0, highlights controlled at 95%), color separation between product and background creating instant recognition. Include premium indicators scaled for distance: metal surfaces showing reflective quality, texture visible and enhanced, form clear and dimensional. Composition billboard-optimized: horizontal 3:1 aspect ratio consideration, focal point in optical center, no fine details lost at scale. Depth minimal distraction: f/11 equivalent keeping product sharp, background simplified. Add billboard finishing: edge contrast enhancement, slight glow on highlights (8%) for premium shimmer, overall clarity boost for outdoor visibility.
        CONTEXT: A billboard ad featuring the product endorsed by ${celeb}.
      `;

    case AdStyle.IPHONE:
      if (index === 0) return `
        CONCEPT: Apple Camera Realism.
        Simulate authentic iPhone 15 Pro computational photography: Replicate Apple's processing characteristics - Smart HDR 5 look with balanced highlights and lifted shadows, Deep Fusion texture rendering in mid-tones, slightly boosted vibrance without oversaturation. Lighting from available sources creating iPhone-typical exposure: window light, indoor ceiling lights, or outdoor natural light, with characteristic iPhone shadow recovery and highlight protection. Apply iPhone color science: slightly warm overall tone (Apple's preferred 5200K white balance), enhanced greens and blues (Apple's color bias), subtle contrast curve creating "pop" without harshness. Include iPhone lens characteristics: 26mm main camera field of view, subtle barrel distortion at edges (1-2%), edge sharpness falloff from center, slight vignette (5%). Add computational photography artifacts: minimal noise in shadows (Apple's aggressive noise reduction), slight halo around high-contrast edges (HDR processing), micro-sharpening creating clarity perception. Product captured in casual but intentional composition - rule of thirds placement, natural environmental context, handheld perspective with slight human imperfection (1-2° tilt acceptable). Depth simulation: Portrait mode bokeh if close (smooth gradient blur, edge detection quality of iPhone), or natural depth if environmental shot. Color rendering slightly saturated in pleasing way (+8 vibrance, +3 saturation).
      `;
      if (index === 1) return `
        CONCEPT: Social Camera Look.
        Create unfiltered iPhone social media capture aesthetic: Standard iPhone camera app look - auto-exposure sometimes slightly bright (Apple's exposure bias +0.3EV), auto white balance occasionally warm indoors or cool in shade (color casts acceptable and authentic). Lighting realistic social capture: harsh sun creating strong shadows if outdoor, mixed color temperatures if indoor (window + tungsten creating color variety), flash if needed showing iPhone LED characteristics (slightly cool, center-bright, natural falloff). Apply zero-filter iPhone processing: Smart HDR creating even tones, auto-enhance slight clarity boost, sharpening preset giving definition without over-processing, natural color saturation matching scene. Include authentic capture characteristics: slight motion blur if handheld in lower light, focus occasionally soft if auto-focus caught between subjects, composition casual rule-of-thirds with comfortable imperfection. Product shown in social posting context - coffee shop table, bedroom, car, outdoor activity - scenarios where people actually take iPhone photos. Depth natural: single lens characteristic (no Portrait mode), natural background relationship to subject distance, realistic bokeh from iPhone f/1.78 aperture when close. Add iPhone file characteristics: slight noise in lower light (ISO 320-800 visible grain), highlight clipping if bright window in frame (authentic iPhone challenge), shadow detail recovered showing Apple's processing.
      `;
      return `
        CONCEPT: Mobile Photography Vibe.
        Generate realistic smartphone camera capture feel: Mobile camera perspective - slightly higher or lower than professional tripod height (handheld natural angles), casual framing with product not perfectly centered, authentic human decision-making in composition. Implement smartphone lighting limitations and strengths: auto-exposure finding balance (sometimes blowing highlights or blocking shadows like mobile cameras do), auto white balance interpretation creating color character, dynamic range compressed like mobile sensor (not full-frame camera latitude). Apply smartphone digital processing: aggressive sharpening creating defined edges, noise reduction smoothing shadows sometimes too much, micro-contrast enhancement creating visual pop, slight color boosting for screen viewing. Include authentic mobile capture imperfections: slight motion blur from hand shake (no IS perfection), focus hunting result (sometimes nose-focused when eye intended), exposure hunting creating uneven brightness zones. Product in genuine mobile capture scenario - quick product snap, sharing with friends, documenting purchase, casual lifestyle integration. Color science smartphone-typical: slightly saturated pleasing colors, warm-cool split toning from auto processing, enhanced specific colors (skin tones, greens, blues) while others neutral. Depth smartphone-natural: smaller sensor creating deeper depth of field, background more in-focus than full-frame equivalent, bokeh less creamy more busy. Add smartphone file artifacts: compression artifacts in solid colors if social media upload simulation, edge enhancement halos, slight color banding in gradients.
      `;
    
    case AdStyle.BEFORE_AFTER:
      if (index === 0) return `
        CONCEPT: Visual Comparison Split (Refined & Enhanced Master Version).
        Create a side-by-side before and after visual comparison using the uploaded image.
        Structure: Split image vertically at exact 50/50 ratio. Left side = "BEFORE" state (problem condition). Right side = "AFTER" state (solution condition). Maintain identical framing, perspective, camera angle, cropping, and scale on both sides for true comparison accuracy.
        
        BEFORE SIDE (Problem State Rendering):
        Apply:
        - Lighting: dim warm ambient lighting at 3200K
        - Exposure: underexposed by –0.5 stops
        - Saturation: reduce by –20
        - Contrast: reduced to create flatness
        - Sharpness: mild softening (–10 clarity)
        - Mood: dull, tired, inconvenient, problematic
        - Environment: cluttered, chaotic, outdated, or uncomfortable
        - Product (if relevant): absent or replaced with inferior alternative
        - Emotional tone: frustration, inefficiency, dissatisfaction
        
        AFTER SIDE (Solution State Rendering):
        Apply:
        - Lighting: bright natural daylight at 5500K
        - Exposure: proper balanced exposure +10 brightness
        - Saturation: increase +15
        - Contrast: rich but clean
        - Sharpness & Texture: enhanced clarity
        - Mood: confident, fresh, positive, premium
        - Environment: organized, upgraded, calm, beneficial
        - Product (if relevant): properly placed, hero-positioned, visually central
        - Emotional tone: improvement, ease, relief, success
        
        Final Output Settings:
        Divider: clean vertical separator at center with subtle 2px white border or shadow.
        Lens look: equivalent to f/8 sharp detail both sides.
        Background: same room/environment, reorganized.
        Optimization: designed for Facebook, Google Display, Shopify, and landing pages. Make transformation obvious in < 1 second of viewing.
      `;
      if (index === 1) return `
        CONCEPT: Before / After Lifestyle Impact Story.
        Create a lifestyle-based before and after transformation using the uploaded image.
        Composition Rules: Split-screen comparison with perfect camera alignment and framing lock. Identical composition on both sides. Vertical or horizontal split allowed but divider must be clean and intentional.
        
        BEFORE SIDE (Emotional Problem Reality):
        Render the image as:
        - Lighting: low ambient, yellow-tinted 3000–3400K
        - Color tone: faded, dull, slightly grayish
        - Environment: chaotic or empty, shows struggle or inefficiency
        - Expression/mood (if people exist): stressed, tired, bored, frustrated
        - Visual storytelling: show difficulty, confusion, limitation
        - Texture: slightly grainy, lifeless
        - Composition feeling: cramped, uncomfortable, limiting
        
        AFTER SIDE (Lifestyle Upgrade & Outcome):
        Render as:
        - Lighting: bright neutral daylight 5200–5800K
        - Color tone: rich, alive, warm contrast
        - Environment: tidy, balanced, attractive
        - Subject emotion: relaxed, confident, happy, productive
        - Visual storytelling: show improvement because of the solution
        - Texture: crisp, clear, fresh
        - Composition feeling: open, luxurious, appealing
        
        Divider & Output: Use middle divider with light glow or soft shadow. Maintain precise framing and scale across both sides. Visual message must be instantly readable with no text. Make viewer say: "I want what’s on the right side."
      `;
      return `
        CONCEPT: Commercial Grade Product Comparison Ad.
        Design a high-impact marketing-grade before & after ad from the uploaded photo.
        Layout: Vertical split screen (50% before, 50% after). Global framing locked identically both sides. No zoom, no perspective distortion.
        
        BEFORE SIDE — Commercial Failure Look:
        Apply:
        - Lighting: flat overhead indoor 3000–3400K
        - Contrast: low
        - Colors: muted
        - Shadows: harsh or incorrect
        - Background: messy, low-quality, outdated
        - Visual feel: cheap, inconvenient, undesirable
        - Framing: feels accidental or amateur
        
        AFTER SIDE — Commercial Success Look:
        Apply:
        - Lighting: professional daylight simulation
        - Contrast: cinematic but natural
        - Colors: vibrant but realistic
        - Shadows: soft and directional
        - Background: intentional, premium-looking setup
        - Framing: centered hero effect
        - Visual feel: retail-grade, advertisement ready
        
        Production Instructions:
        Border: 2–4px clear divider.
        Add subtle environment cues: before = struggle, clutter, downgrade; after = success, upgrade, comfort. Keep realistic, not surreal. We want commercial believability, not fantasy.
      `;

    // Maintain existing logic for styles not explicitly updated in the user prompt
    case AdStyle.NEON_CYBERPUNK:
      if (index === 0) return `
        CONCEPT: Rainy Night City.
        SCENE: Wet asphalt street reflecting neon signs.
        ATMOSPHERE: Rain, steam, bokeh city lights.
        COLORS: Cyan and Magenta.
      `;
      if (index === 1) return `
        CONCEPT: The Matrix.
        SCENE: High-tech server room with green laser grids.
        SURFACE: Black glossy glass.
        VIBE: Hacker, futuristic, data.
      `;
      return `
        CONCEPT: Synthwave Sunset.
        BACKGROUND: A retro 80s wireframe grid sun setting in the distance.
        COLORS: Purple, Orange, Black.
        VIBE: Retro-futurism.
      `;

    case AdStyle.MINIMALIST:
       if (index === 0) return `CONCEPT: Monochromatic Calm. Single color palette, soft shadows, matte textures.`;
       if (index === 1) return `CONCEPT: Architectural Geometry. Hard shadows, concrete textures, strong lines.`;
       return `CONCEPT: Levitating Object. Floating product, no strings visible, soft gradient background.`;

    default:
       if (index === 0) return "CONCEPT: Hero Shot. Best possible lighting, centered composition.";
       if (index === 1) return "CONCEPT: Creative Angle. Low angle, dramatic lighting, interesting background.";
       return "CONCEPT: Detail/Context. Close up or environmental shot showing the product in use.";
  }
};


export const generateAdImages = async (
  imageDataUrl: string,
  config: AdConfiguration
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  if (!process.env.API_KEY) throw new Error("API Key is missing. Please select an API key.");

  const productBase64 = cleanBase64(imageDataUrl);
  
  // Prepare Reference Image Part if it exists
  let referencePart = null;
  if (config.referenceImageUrl) {
    referencePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanBase64(config.referenceImageUrl)
      }
    };
  }
  
  const modelName = config.model || ModelType.GEMINI_2_5_FLASH;
  const isPro = modelName === ModelType.GEMINI_3_PRO;
  
  const promises = [0, 1, 2].map(async (index) => {
    try {
      // 1. Get Technical Specs
      const technicalSpecs = getTechnicalSpecs(config.style);

      // 2. Get Composition/Concept
      let variationPrompt = "";
      
      // If reference image exists, we modify the logic slightly to ensure we respect the reference
      if (config.referenceImageUrl) {
         if (index === 0) variationPrompt = "TASK: STRICT STYLE TRANSFER. Replicate the exact lighting, composition, and mood of the Reference Image provided. Do not deviate from the reference style.";
         else if (index === 1) variationPrompt = "TASK: CREATIVE ADAPTATION. Use the Reference Image's color palette and lighting, but change the camera angle to a low, dramatic view to make the product look larger than life.";
         else variationPrompt = "TASK: DETAIL/CONTEXT SHOT. Use the Reference Image's aesthetic, but zoom in or place the product in a slightly different context within that same world.";
      } else {
         variationPrompt = getStyleVariation(config.style, index, config);
      }

      const finalPrompt = `
        ROLE: You are an award-winning Commercial Photographer and CGI Artist.
        
        [INPUTS]
        Image 1: The Product (HERO).
        ${config.referenceImageUrl ? "Image 2: The Style Reference." : ""}
        
        [TECHNICAL CAMERA SPECS (BASELINE)]
        ${technicalSpecs}

        [DETAILED VISUAL BRIEF - VARIATION ${index + 1}]
        ${variationPrompt}
        
        [ADDITIONAL USER CONTEXT]
        ${config.customContext ? `USER REQUEST: ${config.customContext}` : 'None.'}

        [CRITICAL RULES]
        1. REALISM: The product must look 100% photorealistic. Match shadows, reflections, and lighting to the scene.
        2. INTEGRITY: Do not warp the product logo or text. Keep the product form factor identical to the input.
        3. LIGHTING MATCH: Analyze the product's original lighting in the input image. If it's flat, add scene lights to match. If it's side-lit, match the scene shadows.
      `;
      
      const parts: any[] = [
        {
          inlineData: {
            mimeType: 'image/jpeg', 
            data: productBase64
          }
        }
      ];

      if (referencePart) {
        parts.push(referencePart);
      }

      parts.push({ text: finalPrompt });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: parts
        },
        config: {
          imageConfig: {
            aspectRatio: config.aspectRatio,
            imageSize: isPro ? '1K' : undefined
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/jpeg;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Error generating variation:", error);
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        throw error;
      }
      return null;
    }
  });

  const results = await Promise.all(promises);
  const validResults = results.filter((res): res is string => res !== null);
  
  return validResults;
};