# Runware PhotoMaker SDK Integration Guide for Next.js

## Overview
Runware PhotoMaker is an advanced AI-powered portrait generation technology that enables instant subject personalization without additional training. It maintains impressive identity consistency using up to 4 reference images while applying various styles and transformations.

### Key Advantages for Supershoot
- **Superior Identity Preservation**: PhotoMaker excels at maintaining facial features and identity across generated images
- **Sub-second Generation**: Significantly faster than OpenAI/Gemini alternatives
- **Cost Efficiency**: ~5x cheaper than competitors
- **Style Flexibility**: 15+ built-in artistic styles with adjustable strength
- **No Training Required**: Works instantly with reference images
- **WebSocket Performance**: Persistent connections for better performance vs REST

## Installation

### 1. Install the Runware SDK

```bash
npm install @runware/sdk-js
# or
yarn add @runware/sdk-js
```

### 2. Environment Variables

Add to your `.env.local`:

```env
RUNWARE_API_KEY=your_runware_api_key_here
```

Get your API key from [Runware.ai](https://runware.ai) (includes free trial credits).

## Basic Implementation

### 1. Create Runware Client Wrapper

Create `lib/runware-client.ts`:

```typescript
import { Runware } from "@runware/sdk-js";

// Available PhotoMaker styles
export enum PhotoMakerStyle {
  NO_STYLE = "No style",
  CINEMATIC = "Cinematic",
  DISNEY = "Disney Character",  
  DIGITAL_ART = "Digital Art",
  PHOTOGRAPHIC = "Photographic (Default)",
  FANTASY_ART = "Fantasy art",
  NEONPUNK = "Neonpunk",
  ENHANCE = "Enhance",
  COMIC_BOOK = "Comic book",
  LOWPOLY = "Lowpoly",
  LINE_ART = "Line art"
}

export interface PhotoMakerParams {
  positivePrompt: string;
  negativePrompt?: string;
  inputImages: string[]; // Base64 or URLs (up to 4 images)
  style?: PhotoMakerStyle;
  strength?: number; // 0-100, lower = more identity fidelity
  width?: number;
  height?: number;
  steps?: number;
  numberResults?: number;
  outputFormat?: "PNG" | "JPG" | "WEBP";
  seed?: number;
  CFGScale?: number;
}

class RunwareClient {
  private client: Runware | null = null;
  
  async initialize() {
    if (!this.client) {
      this.client = new Runware({
        apiKey: process.env.RUNWARE_API_KEY!,
        globalMaxRetries: 3,
        globalTimeout: 120000 // 2 minutes
      });
      
      // Connect to WebSocket
      await this.client.connect();
    }
    return this.client;
  }
  
  async generatePortrait(params: PhotoMakerParams) {
    const client = await this.initialize();
    
    try {
      // Add "rwre" trigger word if not present
      let prompt = params.positivePrompt;
      if (!prompt.includes("rwre")) {
        prompt = `rwre, ${prompt}`;
      }
      
      const results = await client.photoMaker({
        positivePrompt: prompt,
        negativePrompt: params.negativePrompt || "(asymmetry, worst quality, low quality, illustration, 3d, 2d, painting, cartoons, sketch), open mouth, grayscale",
        inputImages: params.inputImages,
        style: params.style || PhotoMakerStyle.PHOTOGRAPHIC,
        strength: params.strength ?? 50, // Default 50 for balanced results
        width: params.width || 512,
        height: params.height || 512,
        steps: params.steps || 30, // 30 is often sufficient
        numberResults: params.numberResults || 1,
        outputFormat: params.outputFormat || "PNG",
        seed: params.seed,
        CFGScale: params.CFGScale || 7,
        includeCost: true,
        customTaskUUID: crypto.randomUUID(),
        onPartialImages: (images, error) => {
          if (error) {
            console.error("Partial generation error:", error);
          } else {
            console.log(`Received ${images.length} partial images`);
          }
        }
      });
      
      return results;
    } catch (error) {
      console.error("PhotoMaker generation failed:", error);
      throw error;
    }
  }
  
  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }
}

// Export singleton instance
export const runwareClient = new RunwareClient();
```

### 2. Next.js API Route Implementation

Create `app/api/generate-photomaker/route1.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { runwareClient, PhotoMakerStyle } from "@/lib/runware-client";

export const runtime = "nodejs"; // Required for WebSocket support

export async function POST(request: NextRequest) {
  try {
    // Validate auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const {
      referenceImages, // Array of base64 images
      prompt,
      setting,
      outfit,
      instructions,
      style = PhotoMakerStyle.PHOTOGRAPHIC,
      strength = 50
    } = body;
    
    // Validate reference images (1-4 required)
    if (!referenceImages || referenceImages.length === 0) {
      return NextResponse.json(
        { error: "At least one reference image is required" },
        { status: 400 }
      );
    }
    
    if (referenceImages.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 reference images allowed" },
        { status: 400 }
      );
    }
    
    // Check user credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();
    
    if (!profile || profile.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }
    
    // Build the complete prompt
    // Note: PhotoMaker works best with "class word + img" format
    const gender = outfit.includes("women") ? "woman" : "man";
    const classWord = `professional ${gender} img`;
    
    const fullPrompt = `${classWord} ${prompt || ""} ${setting || ""} ${outfit || ""} ${instructions || ""}`.trim();
    
    // Generate with PhotoMaker
    const results = await runwareClient.generatePortrait({
      positivePrompt: fullPrompt,
      negativePrompt: "(asymmetry, worst quality, low quality, illustration, 3d, 2d, painting, cartoons, sketch), open mouth, grayscale, deformed, ugly",
      inputImages: referenceImages,
      style,
      strength,
      width: 1024,
      height: 1024,
      steps: 30,
      numberResults: 1,
      outputFormat: "PNG",
      CFGScale: 7
    });
    
    if (!results || results.length === 0) {
      throw new Error("No images generated");
    }
    
    const generatedImage = results[0];
    
    // Deduct credits
    const { error: deductError } = await supabase.rpc("deduct_credits", {
      user_id: user.id,
      amount: 1
    });
    
    if (deductError) {
      console.error("Failed to deduct credits:", deductError);
      // Continue anyway - don't fail the generation
    }
    
    // Return the generated image
    return NextResponse.json({
      success: true,
      image: generatedImage.imageURL || generatedImage.imageBase64Data,
      cost: generatedImage.cost,
      seed: generatedImage.seed,
      remainingCredits: profile.credits - 1
    });
    
  } catch (error) {
    console.error("PhotoMaker generation error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Generation failed",
        details: error
      },
      { status: 500 }
    );
  }
}
```

### 3. Update Image Generation Component

Update `components/main/image-gen/image-gen.tsx` to support PhotoMaker:

```typescript
// Add PhotoMaker provider option
type Provider = "openai" | "gemini" | "photomaker";

// Add to the component
const [provider, setProvider] = useState<Provider>(
  referenceImages.length > 0 ? "photomaker" : "openai"
);

// Update provider selection logic
useEffect(() => {
  if (referenceImages.length > 0) {
    setProvider("photomaker"); // PhotoMaker excels with reference images
  } else {
    setProvider("openai"); // Use OpenAI for text-only generation
  }
}, [referenceImages]);

// Update generation function
const handleGenerate = async () => {
  // ... existing validation code ...
  
  let endpoint = "/api/generate-image";
  let payload: any = {
    prompt: freeformInput,
    setting: selectedSetting?.prompt,
    outfit: selectedOutfit?.prompt,
    instructions: customInstructions
  };
  
  if (provider === "photomaker") {
    endpoint = "/api/generate-photomaker";
    payload = {
      ...payload,
      referenceImages: referenceImages.map(img => img.data),
      style: selectedStyle || "Photographic (Default)",
      strength: styleStrength || 50
    };
  }
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  
  // ... rest of the generation logic ...
};
```

## Advanced Features

### 1. Style Selection UI

Add style selection to your UI:

```tsx
import { PhotoMakerStyle } from "@/lib/runware-client";

const StyleSelector = ({ 
  value, 
  onChange 
}: { 
  value: PhotoMakerStyle;
  onChange: (style: PhotoMakerStyle) => void;
}) => {
  const styles = [
    { value: PhotoMakerStyle.NO_STYLE, label: "No Style (Maximum Fidelity)" },
    { value: PhotoMakerStyle.PHOTOGRAPHIC, label: "Photographic" },
    { value: PhotoMakerStyle.CINEMATIC, label: "Cinematic" },
    { value: PhotoMakerStyle.DIGITAL_ART, label: "Digital Art" },
    { value: PhotoMakerStyle.FANTASY_ART, label: "Fantasy Art" },
    { value: PhotoMakerStyle.COMIC_BOOK, label: "Comic Book" },
    { value: PhotoMakerStyle.DISNEY, label: "Disney Character" },
    { value: PhotoMakerStyle.NEONPUNK, label: "Neonpunk" },
    { value: PhotoMakerStyle.LOWPOLY, label: "Low Poly" },
    { value: PhotoMakerStyle.LINE_ART, label: "Line Art" }
  ];
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Style</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PhotoMakerStyle)}
        className="w-full px-3 py-2 border rounded-md"
      >
        {styles.map(style => (
          <option key={style.value} value={style.value}>
            {style.label}
          </option>
        ))}
      </select>
    </div>
  );
};
```

### 2. Strength Control

Add a slider for strength control (identity vs creativity balance):

```tsx
const StrengthSlider = ({ 
  value, 
  onChange 
}: { 
  value: number;
  onChange: (strength: number) => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Identity Fidelity</span>
        <span>Creative Freedom</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-center text-sm text-gray-600">
        Strength: {value}
      </div>
    </div>
  );
};
```

## Migration Strategy from OpenAI/Gemini

### 1. Parallel Implementation
Keep existing providers while adding PhotoMaker:

```typescript
// Provider selection logic
const selectProvider = (referenceImages: string[]): Provider => {
  if (referenceImages.length > 0) {
    // PhotoMaker excels with reference images
    return "photomaker";
  }
  
  // Use existing logic for text-only
  if (process.env.IMAGE_GENERATION_PROVIDER === "gemini") {
    return "gemini";
  }
  
  return "openai";
};
```

### 2. A/B Testing
Implement feature flags for gradual rollout:

```typescript
const usePhotoMaker = async (userId: string): boolean => {
  // Check feature flag or user segment
  const supabase = await createClient();
  const { data } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("user_id", userId)
    .eq("feature", "photomaker")
    .single();
  
  return data?.enabled || false;
};
```

### 3. Cost Comparison
Track costs per provider:

```typescript
// Log generation costs
const logGeneration = async (
  userId: string,
  provider: string,
  cost: number
) => {
  await supabase.from("generation_logs").insert({
    user_id: userId,
    provider,
    cost,
    timestamp: new Date().toISOString()
  });
};
```

## Performance Optimizations

### 1. Connection Pooling
Maintain persistent WebSocket connection:

```typescript
// In lib/runware-client.ts
class RunwareClient {
  private static instance: RunwareClient;
  private connectionPromise: Promise<Runware> | null = null;
  
  static getInstance(): RunwareClient {
    if (!RunwareClient.instance) {
      RunwareClient.instance = new RunwareClient();
    }
    return RunwareClient.instance;
  }
  
  async getConnection(): Promise<Runware> {
    if (!this.connectionPromise) {
      this.connectionPromise = this.connect();
    }
    return this.connectionPromise;
  }
  
  private async connect(): Promise<Runware> {
    const client = new Runware({
      apiKey: process.env.RUNWARE_API_KEY!,
      globalMaxRetries: 3
    });
    await client.connect();
    return client;
  }
}
```

### 2. Image Preprocessing
Optimize reference images before sending:

```typescript
import sharp from "sharp";

export async function preprocessReferenceImage(
  base64Image: string
): Promise<string> {
  // Remove data URL prefix
  const imageData = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(imageData, "base64");
  
  // Resize and optimize
  const optimized = await sharp(buffer)
    .resize(512, 512, {
      fit: "cover",
      position: "center"
    })
    .jpeg({ quality: 85 })
    .toBuffer();
  
  return optimized.toString("base64");
}
```

### 3. Caching Strategy
Cache generated images for repeated requests:

```typescript
import { createHash } from "crypto";

function generateCacheKey(params: PhotoMakerParams): string {
  const key = JSON.stringify({
    prompt: params.positivePrompt,
    style: params.style,
    strength: params.strength,
    // Hash reference images to avoid huge keys
    images: params.inputImages.map(img => 
      createHash("md5").update(img).digest("hex")
    )
  });
  
  return createHash("sha256").update(key).digest("hex");
}

// Check cache before generation
const cacheKey = generateCacheKey(params);
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}
```

## Error Handling

### 1. Comprehensive Error Messages

```typescript
export class RunwareError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = "RunwareError";
  }
}

// Error mapping
const errorMessages: Record<string, string> = {
  "INVALID_API_KEY": "Invalid Runware API key. Please check your configuration.",
  "RATE_LIMIT": "Rate limit exceeded. Please try again later.",
  "INSUFFICIENT_CREDITS": "Insufficient Runware credits.",
  "INVALID_IMAGE": "Invalid reference image format or size.",
  "PROMPT_TOO_LONG": "Prompt exceeds 300 character limit.",
  "CONNECTION_FAILED": "Failed to connect to Runware servers.",
  "GENERATION_TIMEOUT": "Generation timed out after 2 minutes."
};
```

### 2. Retry Logic

```typescript
async function generateWithRetry(
  params: PhotoMakerParams,
  maxRetries = 3
): Promise<any> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await runwareClient.generatePortrait(params);
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error.message.includes("INVALID_API_KEY") ||
          error.message.includes("INSUFFICIENT_CREDITS")) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  
  throw lastError;
}
```

## Testing

### 1. Unit Tests

```typescript
// __tests__/runware-client.test.ts
import { runwareClient, PhotoMakerStyle } from "@/lib/runware-client";

describe("RunwareClient", () => {
  it("should add trigger word to prompt", async () => {
    const params = {
      positivePrompt: "professional headshot",
      inputImages: ["base64..."],
      style: PhotoMakerStyle.PHOTOGRAPHIC
    };
    
    const result = await runwareClient.generatePortrait(params);
    expect(result[0].prompt).toContain("rwre");
  });
  
  it("should handle multiple reference images", async () => {
    const params = {
      positivePrompt: "business portrait",
      inputImages: [
        "base64_image1",
        "base64_image2",
        "base64_image3"
      ]
    };
    
    const result = await runwareClient.generatePortrait(params);
    expect(result).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
// __tests__/api/generate-photomaker.test.ts
describe("PhotoMaker API", () => {
  it("should generate portrait with reference images", async () => {
    const response = await fetch("/api/generate-photomaker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${testToken}`
      },
      body: JSON.stringify({
        referenceImages: [testImage],
        prompt: "professional headshot",
        style: "Photographic (Default)"
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.image).toBeDefined();
  });
});
```

## Monitoring & Analytics

### 1. Track Performance Metrics

```typescript
// Track generation metrics
interface GenerationMetrics {
  provider: string;
  generationTime: number;
  cost: number;
  style: string;
  referenceImageCount: number;
  success: boolean;
  errorType?: string;
}

async function trackGeneration(metrics: GenerationMetrics) {
  await supabase.from("generation_metrics").insert(metrics);
  
  // Send to analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "image_generation", {
      provider: metrics.provider,
      generation_time: metrics.generationTime,
      cost: metrics.cost,
      success: metrics.success
    });
  }
}
```

### 2. User Satisfaction Tracking

```typescript
// Track user feedback on generated images
async function trackSatisfaction(
  imageId: string,
  rating: number,
  feedback?: string
) {
  await supabase.from("generation_feedback").insert({
    image_id: imageId,
    rating,
    feedback,
    provider: "photomaker",
    timestamp: new Date().toISOString()
  });
}
```

## Best Practices

### 1. Prompt Engineering for PhotoMaker

```typescript
// Optimal prompt structure
const buildPhotoMakerPrompt = (
  gender: "man" | "woman",
  description: string,
  isAsian?: boolean
): string => {
  // PhotoMaker specific format
  const classWord = isAsian ? `asian ${gender}` : gender;
  
  // "rwre" trigger word + class word + "img" + description
  return `rwre, ${classWord} img ${description}`;
};

// Examples:
// "rwre, man img wearing suit in office, professional headshot"
// "rwre, asian woman img in doctor's coat, medical portrait"
```

### 2. Reference Image Guidelines

```typescript
const validateReferenceImages = (images: string[]): ValidationResult => {
  const errors: string[] = [];
  
  if (images.length === 0) {
    errors.push("At least one reference image required");
  }
  
  if (images.length > 4) {
    errors.push("Maximum 4 reference images allowed");
  }
  
  // Check image quality
  images.forEach((img, index) => {
    // Validate base64 format
    if (!img.startsWith("data:image")) {
      errors.push(`Image ${index + 1}: Invalid format`);
    }
    
    // Check approximate size (rough estimate)
    const sizeKB = (img.length * 3) / 4 / 1024;
    if (sizeKB > 5000) {
      errors.push(`Image ${index + 1}: Too large (max 5MB)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

### 3. Style vs Strength Balance

```typescript
// Recommended configurations
const styleConfigs = {
  "professional": {
    style: PhotoMakerStyle.PHOTOGRAPHIC,
    strength: 20 // High fidelity
  },
  "artistic": {
    style: PhotoMakerStyle.DIGITAL_ART,
    strength: 60 // More creative freedom
  },
  "linkedin": {
    style: PhotoMakerStyle.NO_STYLE,
    strength: 10 // Maximum identity preservation
  },
  "creative": {
    style: PhotoMakerStyle.FANTASY_ART,
    strength: 70 // High stylization
  }
};
```

## Cost Analysis

### Runware vs Current Providers

| Provider | Cost per Image | Speed | Identity Fidelity | Reference Images |
|----------|---------------|-------|-------------------|------------------|
| OpenAI (DALL-E 3) | $0.04-$0.08 | 5-10s | Low | ❌ Not supported |
| Gemini 2.0 Flash | $0.002 | 2-5s | Medium | ✅ Supported |
| **Runware PhotoMaker** | **$0.006** | **<1s** | **High** | **✅ 1-4 images** |

### ROI Calculation

```typescript
// Cost savings calculator
const calculateSavings = (
  monthlyGenerations: number,
  currentProvider: "openai" | "gemini"
): number => {
  const costs = {
    openai: 0.06,
    gemini: 0.002,
    runware: 0.006
  };
  
  const currentCost = monthlyGenerations * costs[currentProvider];
  const runwareCost = monthlyGenerations * costs.runware;
  
  return currentCost - runwareCost;
};

// Example: 10,000 monthly generations
// OpenAI: $600/month
// Runware: $60/month
// Savings: $540/month (90% reduction)
```

## Deployment Checklist

- [ ] Obtain Runware API key and add to environment variables
- [ ] Install @runware/sdk-js package
- [ ] Implement RunwareClient wrapper
- [ ] Create PhotoMaker API route
- [ ] Update image generation component
- [ ] Add style and strength controls to UI
- [ ] Implement error handling and retry logic
- [ ] Set up monitoring and analytics
- [ ] Test with various reference images
- [ ] Configure caching strategy
- [ ] Document prompt best practices for team
- [ ] Set up A/B testing framework
- [ ] Monitor costs and performance metrics
- [ ] Gather user feedback on quality

## Support & Resources

- [Runware Documentation](https://runware.ai/docs)
- [API Reference](https://runware.ai/docs/en/image-inference/photomaker)
- [JavaScript SDK GitHub](https://github.com/Runware/sdk-js)
- [API Playground](https://runware.ai/playground)
- [Status Page](https://status.runware.ai)
- Support Email: support@runware.ai

## Conclusion

Runware PhotoMaker offers superior identity preservation and cost efficiency for Supershoot's professional headshot generation. The WebSocket-based architecture provides sub-second generation times, while the flexible styling system allows for diverse output options. With proper implementation, you can achieve:

- **90% cost reduction** compared to OpenAI
- **10x faster generation** with WebSocket connections
- **Superior identity fidelity** using reference images
- **Flexible styling** with 10+ artistic options
- **Scalable architecture** with connection pooling

The migration can be done incrementally, starting with users who upload reference images and gradually expanding based on performance metrics and user feedback.
