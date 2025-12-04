# Supershoot Runware PhotoMaker Integration Example

## Quick Implementation for Supershoot

This is a concrete implementation example specifically tailored for integrating Runware PhotoMaker into your existing Supershoot codebase.

## 1. Update Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_existing_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_key
STRIPE_SECRET_KEY=your_existing_key
STRIPE_WEBHOOK_SECRET=your_existing_secret
OPENAI_API_KEY=your_existing_key
GEMINI_API_KEY=your_existing_key

# Add Runware
RUNWARE_API_KEY=your_runware_api_key
IMAGE_GENERATION_PROVIDER=photomaker  # Change default provider
```

## 2. Install Dependencies

```bash
npm install @runware/sdk-js uuid
```

## 3. Create Runware Service

Create `app/api/calls/photomaker-gen.ts`:

```typescript
import { Runware } from "@runware/sdk-js";
import { v4 as uuidv4 } from "uuid";

// PhotoMaker specific styles that work well for professional headshots
export const PROFESSIONAL_STYLES = {
  standard: "Photographic (Default)",
  corporate: "Cinematic", 
  creative: "Digital Art",
  minimal: "No style"
} as const;

// Singleton Runware client
let runwareInstance: Runware | null = null;

async function getRunwareClient(): Promise<Runware> {
  if (!runwareInstance) {
    runwareInstance = new Runware({
      apiKey: process.env.RUNWARE_API_KEY!,
      globalMaxRetries: 3,
      globalTimeout: 60000 // 1 minute timeout
    });
    await runwareInstance.connect();
  }
  return runwareInstance;
}

export interface PhotoMakerGenerationParams {
  referenceImages: string[]; // Base64 encoded images
  gender: "man" | "woman";
  setting?: string;
  outfit?: string;
  instructions?: string;
  style?: keyof typeof PROFESSIONAL_STYLES;
  quality?: "standard" | "high";
}

export async function generatePhotoMakerImage(params: PhotoMakerGenerationParams) {
  const {
    referenceImages,
    gender,
    setting = "",
    outfit = "",
    instructions = "",
    style = "standard",
    quality = "standard"
  } = params;

  // Validate reference images
  if (!referenceImages || referenceImages.length === 0) {
    throw new Error("At least one reference image is required for PhotoMaker");
  }

  if (referenceImages.length > 4) {
    throw new Error("Maximum 4 reference images allowed");
  }

  // Build optimized prompt for PhotoMaker
  // PhotoMaker requires specific format: "rwre, [class] img [description]"
  const classWord = gender === "woman" ? "woman" : "man";
  
  // Combine all prompt elements
  const promptElements = [
    setting,
    outfit,
    instructions,
    quality === "high" ? "ultra detailed, best quality, sharp focus" : ""
  ].filter(Boolean).join(", ");

  const fullPrompt = `rwre, professional ${classWord} img ${promptElements}`.trim();

  // Negative prompt optimized for professional headshots
  const negativePrompt = [
    "asymmetry",
    "worst quality", 
    "low quality",
    "illustration",
    "3d render",
    "cartoon",
    "anime",
    "sketch",
    "grayscale",
    "monochrome",
    "blurry",
    "out of focus",
    "deformed",
    "ugly",
    "bad anatomy",
    "disfigured",
    "poorly drawn face",
    "mutation",
    "mutated",
    "extra limbs",
    "bad hands",
    "poorly drawn hands",
    "missing fingers",
    "extra fingers",
    "text",
    "watermark",
    "signature"
  ].join(", ");

  try {
    const client = await getRunwareClient();
    
    const results = await client.photoMaker({
      positivePrompt: fullPrompt,
      negativePrompt,
      inputImages: referenceImages,
      style: PROFESSIONAL_STYLES[style],
      strength: 30, // Low strength for maximum identity preservation
      width: quality === "high" ? 1024 : 512,
      height: quality === "high" ? 1024 : 512,
      steps: quality === "high" ? 35 : 25,
      numberResults: 1,
      outputFormat: "PNG",
      CFGScale: 7.5,
      includeCost: true,
      customTaskUUID: uuidv4(),
      outputType: "base64Data" // Return as base64 for consistency
    });

    if (!results || results.length === 0) {
      throw new Error("No image generated");
    }

    const image = results[0];
    
    return {
      imageData: image.imageBase64Data || image.imageURL,
      cost: image.cost || 0.006,
      seed: image.seed,
      taskId: image.taskUUID
    };
    
  } catch (error) {
    console.error("PhotoMaker generation error:", error);
    throw new Error(`PhotoMaker generation failed: ${error.message}`);
  }
}

// Cleanup function to disconnect when server shuts down
export async function disconnectRunware() {
  if (runwareInstance) {
    await runwareInstance.disconnect();
    runwareInstance = null;
  }
}

// Handle graceful shutdown
if (typeof process !== "undefined") {
  process.on("SIGTERM", disconnectRunware);
  process.on("SIGINT", disconnectRunware);
}
```

## 4. Update Main Generation Route

Modify `app/api/generate-image/route1.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateOpenAIImage } from "@/app/api/calls/image-gen";
import { generateGeminiImage } from "@/app/api/calls/image-gen";
import { generatePhotoMakerImage } from "@/app/api/calls/photomaker-gen";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user profile and credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits, username")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    if (profile.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits", credits: 0 },
        { status: 402 }
      );
    }

    // Parse request
    const body = await request.json();
    const {
      prompt,
      setting,
      outfit,
      instructions,
      referenceImages,
      provider: requestedProvider,
      size = "1024",
      quality = "standard"
    } = body;

    // Determine provider based on reference images and configuration
    let provider = requestedProvider;
    
    if (!provider) {
      if (referenceImages && referenceImages.length > 0) {
        // PhotoMaker is best for reference images
        provider = "photomaker";
      } else {
        // Use environment default or OpenAI
        provider = process.env.IMAGE_GENERATION_PROVIDER || "openai";
      }
    }

    // Validate provider choice
    if (provider === "openai" && referenceImages?.length > 0) {
      return NextResponse.json(
        { error: "OpenAI does not support reference images. Use PhotoMaker or Gemini instead." },
        { status: 400 }
      );
    }

    // Generate image based on provider
    let generationResult;
    let generationCost = 0.05; // Default cost

    try {
      switch (provider) {
        case "photomaker":
          // Detect gender from outfit selection
          const gender = outfit?.toLowerCase().includes("women") ? "woman" : "man";
          
          generationResult = await generatePhotoMakerImage({
            referenceImages,
            gender,
            setting,
            outfit,
            instructions: `${prompt || ""} ${instructions || ""}`.trim(),
            style: "standard",
            quality
          });
          generationCost = generationResult.cost || 0.006;
          break;

        case "gemini":
          generationResult = await generateGeminiImage({
            prompt: `${prompt || ""} ${setting || ""} ${outfit || ""} ${instructions || ""}`.trim(),
            referenceImages,
            size,
            quality
          });
          generationCost = 0.002;
          break;

        case "openai":
        default:
          generationResult = await generateOpenAIImage({
            prompt: `${prompt || ""} ${setting || ""} ${outfit || ""} ${instructions || ""}`.trim(),
            size: size as "256" | "512" | "1024",
            quality: quality as "standard" | "hd"
          });
          generationCost = quality === "hd" ? 0.08 : 0.04;
          break;
      }
    } catch (generationError) {
      console.error(`${provider} generation failed:`, generationError);
      return handleApiError(generationError);
    }

    // Deduct credits
    const { data: creditsData, error: deductError } = await supabase
      .rpc("deduct_credits", {
        user_id: user.id,
        amount: 1
      });

    if (deductError) {
      console.error("Failed to deduct credits:", deductError);
      // Don't fail the request, but log it
    }

    // Store generation record (optional)
    await supabase.from("generated_images").insert({
      user_id: user.id,
      provider,
      prompt: `${prompt || ""} ${setting || ""} ${outfit || ""} ${instructions || ""}`.trim(),
      cost: generationCost,
      has_reference_images: referenceImages?.length > 0,
      metadata: {
        size,
        quality,
        seed: generationResult.seed,
        taskId: generationResult.taskId
      }
    });

    // Return result
    return NextResponse.json({
      success: true,
      image_data: generationResult.imageData,
      credits_data: creditsData || { credits: profile.credits - 1 },
      provider,
      cost: generationCost,
      seed: generationResult.seed
    });

  } catch (error) {
    console.error("Image generation route error:", error);
    return handleApiError(error);
  }
}
```

## 5. Update Image Generation Component

Update `components/main/image-gen/image-gen.tsx` to show provider selection:

```tsx
// Add provider indicator and selector
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Inside your ImageGen component
const ImageGen = () => {
  // ... existing state ...
  
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  
  // Auto-select provider based on reference images
  useEffect(() => {
    if (referenceImages.length > 0 && !selectedProvider) {
      setSelectedProvider("photomaker");
    } else if (referenceImages.length === 0 && selectedProvider === "photomaker") {
      setSelectedProvider(null); // Reset to auto
    }
  }, [referenceImages]);

  // Provider info component
  const ProviderInfo = () => {
    const getProviderBadge = () => {
      const provider = selectedProvider || 
        (referenceImages.length > 0 ? "photomaker" : "openai");
      
      const providerInfo = {
        photomaker: { label: "PhotoMaker", color: "bg-purple-500" },
        openai: { label: "OpenAI", color: "bg-green-500" },
        gemini: { label: "Gemini", color: "bg-blue-500" }
      };
      
      const info = providerInfo[provider] || providerInfo.openai;
      
      return (
        <Badge className={`${info.color} text-white`}>
          {info.label}
        </Badge>
      );
    };
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Provider:</span>
        {getProviderBadge()}
        {referenceImages.length > 0 && (
          <span className="text-xs text-gray-500">
            (Best for identity preservation)
          </span>
        )}
      </div>
    );
  };

  // Update generate function
  const handleGenerate = async () => {
    if (!user || credits === 0) {
      setShowInsufficientCreditsDialog(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: freeformInput,
          setting: selectedSetting?.prompt,
          outfit: selectedOutfit?.prompt,
          instructions: customInstructions,
          referenceImages: referenceImages.map(img => img.data),
          provider: selectedProvider,
          size: "1024",
          quality: "standard"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      // Update UI with generated image
      setGeneratedImage({
        id: Date.now().toString(),
        data: data.image_data,
        timestamp: new Date().toISOString()
      });

      // Update credits in global state
      updateProfile({
        ...profile,
        credits: data.credits_data.credits
      });

      // Show success toast
      toast.success(`Image generated successfully with ${data.provider}!`);

    } catch (error) {
      console.error("Generation error:", error);
      setError(error.message);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Reference Images Section */}
      <div className="border-2 border-dashed rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Reference Images (Optional)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload 1-4 reference images for better identity preservation
          {referenceImages.length > 0 && " • PhotoMaker will be used automatically"}
        </p>
        
        {/* Existing reference image upload UI */}
        {/* ... */}
      </div>

      {/* Provider Info */}
      <ProviderInfo />

      {/* Advanced Options (Optional) */}
      {referenceImages.length > 0 && (
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer font-medium">
            Advanced Options
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Provider Override
              </label>
              <Select
                value={selectedProvider || "auto"}
                onValueChange={(value) => 
                  setSelectedProvider(value === "auto" ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-select</SelectItem>
                  <SelectItem value="photomaker">
                    PhotoMaker (Best for faces)
                  </SelectItem>
                  <SelectItem value="gemini">
                    Gemini (Fast & cheap)
                  </SelectItem>
                  <SelectItem value="openai" disabled={referenceImages.length > 0}>
                    OpenAI (Text only)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </details>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || credits === 0}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Portrait ({credits} credits)
          </>
        )}
      </button>
    </div>
  );
};
```

## 6. Add Migration for Tracking

Create `utils/supabase/migrations/add_photomaker_tracking.sql`:

```sql
-- Add provider tracking to generated_images table
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'openai',
ADD COLUMN IF NOT EXISTS has_reference_images BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create index for provider analytics
CREATE INDEX IF NOT EXISTS idx_generated_images_provider 
ON generated_images(provider);

-- Add provider stats view
CREATE OR REPLACE VIEW provider_stats AS
SELECT 
  provider,
  COUNT(*) as total_generations,
  AVG(cost) as avg_cost,
  COUNT(DISTINCT user_id) as unique_users,
  DATE(created_at) as generation_date
FROM generated_images
GROUP BY provider, DATE(created_at);
```

## 7. Add Analytics Dashboard Component

Create `components/dashboard/ProviderStats.tsx`:

```tsx
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface ProviderStat {
  provider: string;
  total_generations: number;
  avg_cost: number;
  unique_users: number;
}

export function ProviderStats() {
  const [stats, setStats] = useState<ProviderStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("provider_stats")
        .select("*")
        .gte("generation_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("total_generations", { ascending: false });

      if (!error && data) {
        // Aggregate by provider
        const aggregated = data.reduce((acc, curr) => {
          if (!acc[curr.provider]) {
            acc[curr.provider] = {
              provider: curr.provider,
              total_generations: 0,
              avg_cost: 0,
              unique_users: new Set()
            };
          }
          
          acc[curr.provider].total_generations += curr.total_generations;
          acc[curr.provider].avg_cost = 
            (acc[curr.provider].avg_cost + curr.avg_cost) / 2;
          
          return acc;
        }, {} as Record<string, any>);

        setStats(Object.values(aggregated));
      }
      
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) return <div>Loading provider stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.provider} className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg capitalize">{stat.provider}</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p>Generations: {stat.total_generations.toLocaleString()}</p>
            <p>Avg Cost: ${stat.avg_cost.toFixed(4)}</p>
            <p>
              Total Revenue: $
              {(stat.total_generations * 1.9).toFixed(2)}
            </p>
            <p>
              Profit Margin: 
              {((1 - stat.avg_cost / 1.9) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 8. Testing Script

Create `scripts/test-photomaker.js`:

```javascript
// Test script to verify PhotoMaker integration
const fs = require('fs');
const path = require('path');

async function testPhotoMaker() {
  const RUNWARE_API_KEY = process.env.RUNWARE_API_KEY;
  const testImagePath = path.join(__dirname, '../public/test-portrait.jpg');
  
  if (!RUNWARE_API_KEY) {
    console.error('❌ RUNWARE_API_KEY not set');
    return;
  }

  // Read test image
  const imageBuffer = fs.readFileSync(testImagePath);
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  // Test API endpoint
  const response = await fetch('http://localhost:3000/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header if needed
    },
    body: JSON.stringify({
      referenceImages: [base64Image],
      prompt: "professional business headshot",
      setting: "modern office",
      outfit: "business suit",
      provider: "photomaker"
    })
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ PhotoMaker test successful!');
    console.log('Provider:', result.provider);
    console.log('Cost:', result.cost);
    console.log('Image generated:', result.image_data ? 'Yes' : 'No');
  } else {
    console.error('❌ PhotoMaker test failed:', result.error);
  }
}

testPhotoMaker().catch(console.error);
```

## Deployment Steps

1. **Get Runware API Key**
   ```bash
   # Sign up at https://runware.ai
   # Add to Vercel environment variables
   ```

2. **Test Locally**
   ```bash
   npm install @runware/sdk-js uuid
   npm run dev
   # Test with reference images
   ```

3. **Deploy to Vercel**
   ```bash
   # Add RUNWARE_API_KEY to Vercel environment
   vercel env add RUNWARE_API_KEY
   
   # Deploy
   git add .
   git commit -m "Add Runware PhotoMaker integration"
   git push
   vercel --prod
   ```

4. **Monitor Performance**
   - Check Supabase dashboard for provider_stats
   - Monitor Runware dashboard for usage
   - Track user feedback on quality

## Cost-Benefit Analysis

### Current State (OpenAI/Gemini)
- OpenAI: $0.04-0.08 per image
- Gemini: $0.002 per image
- No identity preservation with OpenAI
- Limited identity with Gemini

### With PhotoMaker
- Cost: $0.006 per image
- Superior identity preservation
- Faster generation (<1s vs 5-10s)
- Better user satisfaction

### Monthly Projection (10,000 generations)
- Before: $400 (OpenAI) or $20 (Gemini)
- After: $60 (PhotoMaker)
- User charge: $19,000 (at $1.90/credit)
- Profit increase: $340/month switching from OpenAI

## Success Metrics

Track these KPIs after implementation:

1. **Technical Metrics**
   - Generation success rate > 99%
   - Average generation time < 1 second
   - API availability > 99.9%

2. **Business Metrics**
   - Cost per generation < $0.01
   - User satisfaction score > 4.5/5
   - Repeat usage rate > 60%

3. **Quality Metrics**
   - Identity preservation score (user feedback)
   - Style accuracy rating
   - Professional appearance rating

## Troubleshooting

### Common Issues

1. **"Connection failed" errors**
   - Check RUNWARE_API_KEY is set
   - Verify API key is valid
   - Check network connectivity

2. **"Invalid reference image" errors**
   - Ensure images are < 5MB
   - Verify base64 encoding
   - Check image format (JPEG/PNG)

3. **Poor identity preservation**
   - Use lower strength values (20-30)
   - Provide multiple reference images
   - Use "No style" for maximum fidelity

4. **Slow generation**
   - Check WebSocket connection
   - Monitor Runware status page
   - Consider connection pooling

## Next Steps

1. **A/B Testing**: Compare PhotoMaker vs existing providers
2. **Style Optimization**: Test different styles for industries
3. **Batch Processing**: Implement bulk generation
4. **Caching Layer**: Add Redis for duplicate requests
5. **Advanced Features**: Explore LoRA models for specific styles

This implementation provides a solid foundation for integrating Runware PhotoMaker into Supershoot with minimal disruption to the existing codebase.
