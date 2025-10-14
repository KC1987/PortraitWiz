"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react"
import { useAtom } from "jotai"
import { authAtom } from "@/lib/atoms"

import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Download, ImageIcon, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils";
import SettingSelection from "@/components/main/image-gen/setting-selection";
import OutfitSelection from "@/components/main/image-gen/outfit-selection";
import FemaleOutfitSelection from "@/components/main/image-gen/female-outfit-selection";
import InsufficientCreditsDialog from "@/components/InsufficientCreditsDialog";

export default function ImageGen() {
  const [ auth, setAuth ] = useAtom(authAtom)


  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [errorSuggestion, setErrorSuggestion] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [insufficientCreditsDialogOpen, setInsufficientCreditsDialogOpen] = useState<boolean>(false)

  const [setting, setSetting] = useState("Create an ultra-photorealistic professional executive portrait with absolute realism and natural authenticity. LIGHTING: Professional three-point studio setup - key light at 45 degrees (soft, diffused, natural skin rendering), subtle fill light (gentle shadow softening, preserving dimensional form), edge/hair light (natural separation, authentic highlight). SUBJECT: Exact facial features, genuine skin texture with natural pores and subtle imperfections, real hair with individual strand detail, authentic eye reflections and catchlights. Expression: naturally confident with genuine micro-expressions, real eye contact, subtle professional smile with authentic muscle movement. Posture: naturally squared shoulders, organic spine alignment, subtly confident head position. PHOTOGRAPHIC REALISM: Real camera behavior - authentic lens characteristics (85mm equivalent), natural depth of field with realistic bokeh, genuine color science and skin tone accuracy, real-world lighting falloff and ambient occlusion. Authentic fabric texture and clothing wrinkles. Natural environmental interaction - realistic shadows, accurate light bounce, genuine atmospheric perspective. NO artificial smoothing, NO digital painting artifacts, NO uncanny valley effects, NO synthetic perfection. TECHNICAL: 1000x1000px, photographic color grading matching real studio conditions, authentic grain structure, natural contrast ratios, genuine photographic quality indistinguishable from professional camera capture.");

  const [outfit, setOutfit] = useState("Subject wearing impeccably tailored professional business attire - perfectly fitted charcoal or navy suit with crisp white dress shirt, silk tie with subtle pattern, polished leather dress shoes. Photorealistic fabric rendering with visible texture weave in suit material, natural wrinkles at joints, authentic drape and fit. Ensure proportionally accurate tailoring with proper shoulder fit, appropriate sleeve length showing quarter-inch of shirt cuff, and natural trouser break.");
  const [femaleOutfit, setFemaleOutfit] = useState("Professional headshot framed from shoulders up. Subject wearing impeccably tailored blazer in charcoal, navy, or black over crisp blouse with structured collar or elegant neckline. Natural fabric texture showing authentic weave in suit material, realistic lapel structure, genuine shoulder fit with proper tailoring, visible blouse detail at neckline. Frame includes upper chest to top of head with professional headroom.");
  const [outfitGender, setOutfitGender] = useState<"male" | "female">("male");
  const [instructions, setInstructions] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null)
  const outputSectionRef = useRef<HTMLDivElement>(null)
  const maxPromptLength = 500



  // File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove data:image/xxx;base64, prefix
        const base64 = result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Handle file upload (supports up to 4 images)
  const handleFileUpload = async (file: File) => {
    // Check if already at max capacity
    if (uploadedImages.length >= 4) {
      setError("Maximum 4 images allowed")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Max 5MB per image
    if (file.size > 5 * 1024 * 1024) {
      setError("Each image must be less than 5MB")
      return
    }

    try {
      const base64 = await fileToBase64(file)
      setUploadedImages(prev => [...prev, base64])
      setError(null)
    } catch {
      setError("Failed to process image")
    }
  }

  // Drag handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      // Process multiple files (up to remaining slots)
      const remainingSlots = 4 - uploadedImages.length
      const filesToProcess = Math.min(files.length, remainingSlots)

      for (let i = 0; i < filesToProcess; i++) {
        await handleFileUpload(files[i])
      }

      if (files.length > remainingSlots) {
        setError(`Only ${remainingSlots} more image(s) allowed`)
      }
    }
  }

  // File input change (support multiple files)
  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Process multiple files (up to remaining slots)
      const remainingSlots = 4 - uploadedImages.length
      const filesToProcess = Math.min(files.length, remainingSlots)

      for (let i = 0; i < filesToProcess; i++) {
        await handleFileUpload(files[i])
      }

      if (files.length > remainingSlots) {
        setError(`Only ${remainingSlots} more image(s) allowed`)
      }
    }
  }

  // Remove uploaded image by index
  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    if (fileInputRef.current && uploadedImages.length === 1) {
      fileInputRef.current.value = ""
    }
  }


// Generate image
  const handleGenerate = async () => {
    // Combine prompt
    // setPrompt(setting.concat(" Special instructions: ", instructions));

    if (!auth.user) {
      setError("Please sign in to generate images")
      return
    }

    // Check credits, and popup
    if (auth?.profile && auth.profile.credits < 1) {
      setInsufficientCreditsDialogOpen(true)
      return
    }

    setIsGenerating(true)
    setError(null)
    setErrorSuggestion(null)
    setGeneratedImage(null)

    // Scroll to output section
    setTimeout(() => {
      outputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    try {
      // Use the appropriate outfit based on gender selection
      const selectedOutfit = outfitGender === "male" ? outfit : femaleOutfit;

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // prompt: setting.concat(" ", instructions),
          prompt: `${selectedOutfit} ${setting} Special instructions (the following instruction (if any) overrides any previous instructions: ${instructions || 'no special instructions'}`,
          imageBase64Array: uploadedImages.length > 0 ? uploadedImages : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Failed to generate image")
        setErrorSuggestion(errorData.suggestion || null)
        return
      }

      // Response from Generate API
      const { image_data, credits_data } = await response.json();

      // Set generated image to received image
      setGeneratedImage(image_data.imageBase64);

      // Update auth provider with the new credits balance
      setAuth(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, credits: credits_data } : null
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image")
      setErrorSuggestion("Please try again in a moment.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Download generated image
  const downloadImage = () => {
    if (!generatedImage) return

    const link = document.createElement("a")
    link.href = `data:image/png;base64,${generatedImage}`
    link.download = `portraitwiz-${Date.now()}.png`
    link.click()
  }

  // Modify Image - add generated image to the reference images
  function handleModifyImage() {
      if (generatedImage) {
        setUploadedImages([generatedImage]);
        // setUploadedFileNames(prev => [...prev, `generated-${Date.now()}.png`]);
        setGeneratedImage(null);
      }
  }

  return (
    <section className="w-full overflow-x-hidden mx-auto max-w-6xl">
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Create Image</CardTitle>
            {/*<CardDescription>*/}
            {/*  Upload an image to edit or generate from text*/}
            {/*</CardDescription>*/}
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Drag & Drop Zone */}
            <div>
              {/*<label className="text-sm font-medium mb-2 block">*/}
              {/*  Upload Image (Optional)*/}
              {/*</label>*/}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-3 md:p-6 lg:p-8 text-center cursor-pointer transition-all touch-manipulation active:scale-[0.98] min-h-[120px] md:min-h-[160px]",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/50",
                  uploadedImages.length > 0 && "border-primary bg-primary/5"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {uploadedImages.length === 0 ? (
                  <div className="space-y-2 md:space-y-3 py-2">
                    <div className="mx-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/15 flex items-center justify-center">
                      <Upload className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-medium text-foreground">
                        <span className="hidden sm:inline">Drop your reference images here, or </span>
                        <span className="sm:hidden">Tap to upload reference images</span>
                        <span className="hidden sm:inline">click to browse</span>
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1.5">
                        Up to 4 images (PNG, JPG, WEBP up to 5MB each)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {uploadedImages.length}/4 reference images
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`data:image/png;base64,${image}`}
                            alt={`Reference ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-1 -right-1 md:-top-2 md:-right-2 rounded-full w-7 h-7 md:w-8 md:h-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-manipulation"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeUploadedImage(index)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {uploadedImages.length < 4 && (
                      <p className="text-xs text-muted-foreground text-center">
                        <span className="hidden sm:inline">Click or drop more images to add </span>
                        <span className="sm:hidden">Tap to add more </span>
                        ({4 - uploadedImages.length} remaining)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/*Setting selection*/}
            <SettingSelection setting={setting}  setSetting={setSetting} />

            {/* Outfit Gender Toggle */}
            <div>
              <label className="text-sm md:text-base font-medium mb-2 block">
                Outfit Style
              </label>
              <Tabs value={outfitGender} onValueChange={(value) => setOutfitGender(value as "male" | "female")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-10 md:h-11">
                  <TabsTrigger value="male" className="text-sm md:text-base">Male / General</TabsTrigger>
                  <TabsTrigger value="female" className="text-sm md:text-base">Female</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/*Outfit Selection - Conditional*/}
            {outfitGender === "male" ? (
              <OutfitSelection outfit={outfit} setOutfit={setOutfit} />
            ) : (
              <FemaleOutfitSelection outfit={femaleOutfit} setOutfit={setFemaleOutfit} />
            )}

            {/* Instructions Input */}
            <div>
              <label className="text-sm md:text-base font-medium mb-2 block">
                Special Instructions
              </label>
              <Textarea
                placeholder="Additional styling preferences..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value.slice(0, maxPromptLength))}
                rows={4}
                className="resize-none text-sm md:text-base min-h-[100px]"
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  {uploadedImages.length > 0
                    ? `Gemini will analyze your ${uploadedImages.length} reference image${uploadedImages.length > 1 ? 's' : ''} for better results`
                    : "Add reference images for more accurate portraits"}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {instructions.length}/{maxPromptLength}
                </p>
              </div>
            </div>

             Error Message
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-destructive">{error}</p>
                    {errorSuggestion && (
                      <p className="text-sm text-destructive/80">{errorSuggestion}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : generatedImage ? (
                <>
                  Try Again
                </>
                ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Generate Image (1 Credit)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card ref={outputSectionRef} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Generated Image</CardTitle>
            {/*<CardDescription>*/}
            {/*  Your AI-generated result will appear here*/}
            {/*</CardDescription>*/}
          </CardHeader>
          <CardContent>
            {!generatedImage && !isGenerating ? (
              <div className="aspect-[4/3] md:aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-muted flex items-center justify-center mb-2 md:mb-3">
                  <ImageIcon className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-muted-foreground" />
                </div>
                <p className="text-[11px] md:text-xs lg:text-sm text-muted-foreground px-4">
                  Configure settings and generate
                </p>
              </div>
            ) : isGenerating ? (
              <div className="aspect-[4/3] md:aspect-square rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center p-4 md:p-6">
                <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin mb-2 md:mb-3" />
                <p className="text-sm md:text-base font-medium text-primary">
                  Creating your portrait...
                </p>
                <p className="text-[11px] md:text-xs lg:text-sm text-muted-foreground mt-1 px-4">
                  This may take a moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group rounded-lg overflow-hidden border">
                  <img
                    src={`data:image/png;base64,${generatedImage}`}
                    alt="Generated result"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      onClick={downloadImage}
                      size="lg"
                      variant="secondary"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  className="w-full lg:hidden"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </Button>
              </div>
            )}
          </CardContent>
          { generatedImage &&
            <CardFooter className="flex flex-col sm:flex-row gap-2 p-4 md:p-6" >
              <Button
                className="w-full sm:w-1/2 h-11 md:h-12 touch-manipulation"
                onClick={handleModifyImage}
              >
                Modify Image
              </Button>
              <Button
                className="w-full sm:w-1/2 h-11 md:h-12 touch-manipulation"
                onClick={downloadImage}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          }
        </Card>
      </div>

      {/* Insufficient Credits Dialog */}
      <InsufficientCreditsDialog
        open={insufficientCreditsDialogOpen}
        onOpenChange={setInsufficientCreditsDialogOpen}
      />
    </section>
  )
}
