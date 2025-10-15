"use client"

import { useState, useRef, DragEvent, ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react"
import Image from "next/image"
import { useAtom } from "jotai"
import { Upload, X, Download, ImageIcon, Loader2, AlertCircle } from "lucide-react"

import { authAtom } from "@/lib/atoms"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SettingSelection from "@/components/main/image-gen/setting-selection"
import OutfitSelection from "@/components/main/image-gen/outfit-selection"
import FemaleOutfitSelection from "@/components/main/image-gen/female-outfit-selection"
import InsufficientCreditsDialog from "@/components/InsufficientCreditsDialog";

export default function ImageGen() {
  const [auth, setAuth] = useAtom(authAtom)


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
  const isNearPromptLimit = instructions.length >= maxPromptLength * 0.9



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

  const handleDropzoneKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      fileInputRef.current?.click()
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
    <section className="w-full max-w-6xl mx-auto overflow-x-hidden px-3 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
        {/* Input Section */}
        <Card className="overflow-hidden border border-border/70 bg-background/95 shadow-sm">
          <CardHeader className="space-y-1 border-b border-border/60 bg-muted/40 px-4 py-4 md:px-6">
            <CardTitle className="text-lg md:text-xl">Create Image</CardTitle>
            {/*<CardDescription>*/}
            {/*  Upload an image to edit or generate from text*/}
            {/*</CardDescription>*/}
          </CardHeader>
          <CardContent className="space-y-6 px-4 py-4 md:px-6">
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
                onKeyDown={handleDropzoneKeyDown}
                role="button"
                tabIndex={0}
                aria-label="Upload reference images"
                className={cn(
                  "relative flex w-full cursor-pointer rounded-xl border border-dashed border-border/70 bg-background/70 text-center transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  uploadedImages.length > 0
                    ? "flex-col items-stretch gap-3 p-4 text-left md:p-5"
                    : "flex-col items-center justify-center gap-3 p-5 md:p-6",
                  isDragging
                    ? "border-primary bg-primary/10 shadow-inner"
                    : "hover:border-primary/60 hover:bg-primary/5",
                  uploadedImages.length >= 4 && "border-primary/50"
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
                  <div className="flex flex-col items-center gap-3 py-1 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 md:h-14 md:w-14">
                      <Upload className="h-6 w-6 text-primary md:h-7 md:w-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground md:text-base">
                        Drop reference images or tap to upload
                      </p>
                      <p className="text-xs text-muted-foreground md:text-sm">
                        PNG, JPG, or WEBP · up to 4 images · 5MB max each
                      </p>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Adding references helps keep your likeness accurate.
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      {uploadedImages.length}/4 reference images
                      {uploadedImages.length < 4 && (
                        <button
                          type="button"
                          className="text-foreground underline-offset-4 transition hover:underline"
                          onClick={(event) => {
                            event.stopPropagation()
                            fileInputRef.current?.click()
                          }}
                        >
                          Add more
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm"
                        >
                          <Image
                            src={`data:image/png;base64,${image}`}
                            alt={`Reference ${index + 1}`}
                            fill
                            sizes="(min-width: 768px) 33vw, 50vw"
                            className="object-cover transition group-hover:scale-[1.02]"
                          />
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute right-2 top-2 h-7 w-7 rounded-full bg-background/95 text-muted-foreground shadow-sm transition hover:text-destructive focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:opacity-0 md:group-hover:opacity-100"
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
                    <p className="text-xs text-muted-foreground">
                      {uploadedImages.length < 4
                        ? `${4 - uploadedImages.length} slot(s) remaining`
                        : "Maximum reached. Remove an image to add another."}
                    </p>
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
              <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-muted-foreground">
                  Keep it short—only add details that must override the defaults.
                </span>
                <p
                  className={cn(
                    "text-xs whitespace-nowrap",
                    isNearPromptLimit ? "font-medium text-destructive" : "text-muted-foreground"
                  )}
                >
                  {instructions.length}/{maxPromptLength}
                </p>
              </div>
            </div>

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
              className="w-full h-12 gap-2 text-base font-semibold"
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
        <Card ref={outputSectionRef} className="overflow-hidden border border-border/70 bg-background/95 shadow-sm">
          <CardHeader className="space-y-1 border-b border-border/60 bg-muted/40 px-4 py-4 md:px-6">
            <CardTitle className="text-lg md:text-xl">Generated Image</CardTitle>
            {/*<CardDescription>*/}
            {/*  Your AI-generated result will appear here*/}
            {/*</CardDescription>*/}
          </CardHeader>
          <CardContent className="px-4 py-4 md:px-6">
            {!generatedImage && !isGenerating ? (
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/40 text-center md:aspect-square">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-muted flex items-center justify-center mb-2 md:mb-3">
                  <ImageIcon className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-muted-foreground" />
                </div>
                <p className="text-[11px] md:text-xs lg:text-sm text-muted-foreground px-4">
                  Configure settings and generate
                </p>
              </div>
            ) : isGenerating ? (
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-primary/60 bg-primary/10 p-4 text-center md:aspect-square md:p-6">
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
                <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-muted/20">
                  <Image
                    src={`data:image/png;base64,${generatedImage}`}
                    alt="Generated result"
                    width={1024}
                    height={1024}
                    className="h-auto w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/60 group-hover:opacity-100">
                    <Button
                      onClick={downloadImage}
                      size="lg"
                      variant="secondary"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  className="w-full gap-2 lg:hidden"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </Button>
              </div>
            )}
          </CardContent>
          { generatedImage &&
            <CardFooter className="flex flex-col gap-2 px-4 py-4 sm:flex-row md:px-6">
              <Button
                variant="outline"
                className="h-11 w-full touch-manipulation sm:w-1/2 md:h-12"
                onClick={handleModifyImage}
              >
                Modify Image
              </Button>
              <Button
                className="h-11 w-full touch-manipulation gap-2 sm:w-1/2 md:h-12"
                onClick={downloadImage}
              >
                <Download className="h-4 w-4" />
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
