"use client"

import { useState, useRef, DragEvent, ChangeEvent, MouseEvent, KeyboardEvent as ReactKeyboardEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAtom } from "jotai"
import { Upload, X, Download, ImageIcon, Loader2, AlertCircle } from "lucide-react"
import imageCompression from "browser-image-compression"

import { authAtom } from "@/lib/atoms"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InsufficientCreditsDialog from "@/components/InsufficientCreditsDialog";
import SignInRequiredDialog from "@/components/main/image-gen/sign-in-required-dialog"
import SceneSelector from "@/components/main/image-gen/scene-selector";
import IndustrySelector from "@/components/main/image-gen/industry-selector";
import MaleOutfitSelector from "@/components/main/image-gen/male-outfit-selector";
import FemaleOutfitSelector from "@/components/main/image-gen/female-outfit-selector";
import {scenes} from "@/lib/scenes";
import {maleOutfits} from "@/lib/maleOutfits";
import {femaleOutfits} from "@/lib/femaleOutfits";

const MAX_REFERENCE_IMAGES = 4
const MAX_IMAGE_BYTES = 1024 * 1024 // 1MB limit for payload
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10MB upload allowance
const MAX_DIMENSION = 2000

type UploadedReferenceImage = {
  base64: string
  mimeType: string
  size: number
}

const compressImageToTarget = async (file: File): Promise<File> => {
  if (file.size <= MAX_IMAGE_BYTES) {
    return file
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_IMAGE_BYTES / (1024 * 1024),
    maxWidthOrHeight: MAX_DIMENSION,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.9,
  })

  if (compressed.size > MAX_IMAGE_BYTES) {
    throw new Error("Unable to reduce image under 1MB. Please upload a smaller file.")
  }

  return compressed
}

const approximateBase64Size = (base64: string) => Math.floor((base64.length * 3) / 4)

export default function ImageGen() {
  const [auth, setAuth] = useAtom(authAtom)


  const [uploadedImages, setUploadedImages] = useState<UploadedReferenceImage[]>([])
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [errorSuggestion, setErrorSuggestion] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [insufficientCreditsDialogOpen, setInsufficientCreditsDialogOpen] = useState<boolean>(false)
  const [signInDialogOpen, setSignInDialogOpen] = useState<boolean>(false)
  const [industry, setIndustry] = useState("all");
  const [selectedScene, setSelectedScene] = useState("formal");

  const [scene, setScene] = useState(null);

  // const [maleOutfit, setMaleOutfit] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState("default");
  const [instructions, setInstructions] = useState("");


  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const outputSectionRef = useRef<HTMLDivElement>(null)
  const maxPromptLength = 500
  const isNearPromptLimit = instructions.length >= maxPromptLength * 0.9


  const basePrompt = `Professional headshot portrait photograph of a real human being, framed from shoulders up showing upper chest to top of head with appropriate headroom.
    REALISM & QUALITY:
    Photorealistic professional portrait of an actual person with authentic natural skin texture showing visible pores and fine details. Sharp professional focus with crystal clear high resolution quality. Realistic human proportions and facial anatomy. Genuine fabric textures with natural material properties and realistic draping.
    LIGHTING & TECHNICAL:
    Professional photography lighting creating even illumination with natural dimensional shadows. Accurate natural skin tones and consistent professional color grading. Clean pristine appearance without digital artifacts or defects.
    STRICTLY FORBIDDEN:
    No watermarks, logos, text overlays, timestamps, signatures, borders, frames, or decorative elements. No artificial smoothing, beauty filters, or plastic mannequin appearance. No cartoon, anime, illustration, drawing, or painting styles. No blur, pixelation, distortion, or compression artifacts.`;


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

  const requireAuthForUpload = () => {
    if (!auth?.user) {
      setSignInDialogOpen(true)
      return false
    }
    return true
  }

  // Handle file upload (supports up to 4 images)
  const handleFileUpload = async (file: File) => {
    if (!requireAuthForUpload()) {
      return
    }

    if (uploadedImages.length >= MAX_REFERENCE_IMAGES) {
      setError(`Maximum ${MAX_REFERENCE_IMAGES} images allowed`)
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Each image must be 10MB or less before upload")
      return
    }

    try {
      const compressedFile = await compressImageToTarget(file)
      const base64 = await fileToBase64(compressedFile)
      const size = compressedFile.size

      if (size > MAX_IMAGE_BYTES) {
        setError("Could not reduce image below 1MB. Please choose a smaller image.")
        return
      }

      setUploadedImages((prev) => [
        ...prev,
        {
          base64,
          mimeType: compressedFile.type || "image/jpeg",
          size,
        },
      ])
      setError(null)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process image. Please try another file."
      setError(message)
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

    if (!requireAuthForUpload()) {
      return
    }

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      // Process multiple files (up to remaining slots)
      const remainingSlots = MAX_REFERENCE_IMAGES - uploadedImages.length
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
    if (!requireAuthForUpload()) {
      e.target.value = ""
      return
    }

    const files = e.target.files
    if (files && files.length > 0) {
      // Process multiple files (up to remaining slots)
      const remainingSlots = MAX_REFERENCE_IMAGES - uploadedImages.length
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
      if (!requireAuthForUpload()) {
        return
      }
      fileInputRef.current?.click()
    }
  }

  const handleGallerySelect = (event?: MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation()
    }
    if (!requireAuthForUpload()) {
      return
    }
    fileInputRef.current?.click()
  }

  const handleCameraSelect = (event?: MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation()
    }
    if (!requireAuthForUpload()) {
      return
    }
    cameraInputRef.current?.click()
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
      const sceneDescription = scenes.find(scene => scene.slug === selectedScene)?.prompt;

      const combinedOutfits = maleOutfits.concat(femaleOutfits);
      const outfitDescription = combinedOutfits.find( outfit => outfit.slug === selectedOutfit)?.prompt;

      // console.log("Scene: ", sceneDescription, "Outfit: ", outfitDescription);

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // prompt: setting.concat(" ", instructions),
          prompt: `${basePrompt} Scene: ${sceneDescription} Outfit: ${outfitDescription} Special instructions (the following instruction (if any) overrides any previous instructions: ${instructions || 'no special instructions'}`,
          imageBase64Array:
            uploadedImages.length > 0
              ? uploadedImages.map(({ base64, mimeType }) => ({
                  data: base64,
                  mimeType,
                }))
              : undefined,
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
      setUploadedImages([
        {
          base64: generatedImage,
          mimeType: "image/png",
          size: approximateBase64Size(generatedImage),
        },
      ])
      setGeneratedImage(null)
    }
  }

  return (
    <section className="w-full max-w-5xl mx-auto overflow-x-hidden px-3 sm:px-5 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
        {/* Input Section */}
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Create Image</h2>
          </div>
          <div className="space-y-4">
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
                onClick={auth?.user ? handleGallerySelect : undefined}
                onKeyDown={auth?.user ? handleDropzoneKeyDown : undefined}
                role={auth?.user ? "button" : undefined}
                tabIndex={auth?.user ? 0 : undefined}
                aria-label="Upload reference images"
                className={cn(
                  "relative flex w-full rounded-md",
                  auth?.user && "cursor-pointer bg-[#b47005]",
                  uploadedImages.length > 0
                    ? "flex-col items-stretch gap-3 p-4 text-left md:p-5"
                    : "flex-col items-center justify-center gap-3 p-6 md:p-8",
                  isDragging && auth?.user
                    ? "border-primary/70 bg-primary/10"
                    : auth?.user && "hover:border-foreground/20",
                  uploadedImages.length >= MAX_REFERENCE_IMAGES && "border-border/60"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {!auth?.user ? (
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted md:h-14 md:w-14">
                      <Upload className="h-6 w-6 text-muted-foreground md:h-7 md:w-7" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground md:text-base">
                        Sign in to upload reference images
                      </p>
                      <p className="text-xs text-muted-foreground md:text-sm">
                        Upload photos of yourself to generate personalized portraits
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      asChild
                    >
                      <Link href="/enter">
                        Sign In to Upload
                      </Link>
                    </Button>
                  </div>
                ) : uploadedImages.length === 0 ? (
                  <>
                    <div className="hidden flex-col items-center gap-4 py-2 text-center sm:flex">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted md:h-14 md:w-14">
                        <Upload className="h-6 w-6 text-muted-foreground md:h-7 md:w-7" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground md:text-base">
                          Choose reference images from your gallery or capture new ones
                        </p>
                        <p className="text-xs md:text-sm">
                          PNG, JPG, or WEBP · up to {MAX_REFERENCE_IMAGES} images · 10MB max each
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="mt-1"
                        onClick={handleCameraSelect}
                      >
                        Use camera instead
                      </Button>
                    </div>
                    <div className="flex w-full flex-col gap-3 py-2 text-center sm:hidden">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          Tap to add reference images or capture new ones
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, or WEBP · up to {MAX_REFERENCE_IMAGES} images · 10MB max each
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={handleGallerySelect}
                        >
                          Choose from gallery
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={handleCameraSelect}
                        >
                          Use camera instead
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                      {uploadedImages.length}/{MAX_REFERENCE_IMAGES} reference images
                      {uploadedImages.length < MAX_REFERENCE_IMAGES && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-foreground underline-offset-4 transition hover:underline"
                            onClick={handleGallerySelect}
                          >
                            Add from gallery
                          </button>
                          <button
                            type="button"
                            className="text-foreground underline-offset-4 transition hover:underline"
                            onClick={handleCameraSelect}
                          >
                            Add from camera
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-lg bg-muted/60 ring-1 ring-border/40"
                        >
                          <Image
                            src={`data:${image.mimeType};base64,${image.base64}`}
                            alt={`Reference ${index + 1}`}
                            fill
                            sizes="(min-width: 768px) 33vw, 50vw"
                            className="object-cover"
                          />
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute right-2 top-2 h-7 w-7 rounded-full bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity"
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
                      {uploadedImages.length < MAX_REFERENCE_IMAGES
                        ? `${MAX_REFERENCE_IMAGES - uploadedImages.length} slot(s) remaining`
                        : "Maximum reached. Remove an image to add another."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/*Scene Selector*/}
            <IndustrySelector industry={industry} setIndustry={setIndustry} setSelectedScene={setSelectedScene} setSelectedOutfit={setSelectedOutfit} />
            {/*{ industry && industry }*/}

            <SceneSelector industry={industry} setScene={setScene} selectedScene={selectedScene} setSelectedScene={setSelectedScene} />

            <MaleOutfitSelector industry={industry} selectedOutfit={selectedOutfit} setSelectedOutfit={setSelectedOutfit} />

            <FemaleOutfitSelector industry={industry} selectedOutfit={selectedOutfit} setSelectedOutfit={setSelectedOutfit} />


            {/*/!*Setting selection*!/*/}
            {/*<SettingSelection setting={setting}  setSetting={setSetting} />*/}

            {/*/!* Outfit Gender Toggle *!/*/}
            {/*<div>*/}
            {/*  <label className="text-sm md:text-base font-medium mb-2 block">*/}
            {/*    Outfit Style*/}
            {/*  </label>*/}
            {/*  <Tabs value={outfitGender} onValueChange={(value) => setOutfitGender(value as "male" | "female")} className="w-full">*/}
            {/*    <TabsList className="grid w-full grid-cols-2 h-10 md:h-11">*/}
            {/*      <TabsTrigger value="male" className="text-sm md:text-base">Male </TabsTrigger>*/}
            {/*      <TabsTrigger value="female" className="text-sm md:text-base">Female</TabsTrigger>*/}
            {/*    </TabsList>*/}
            {/*  </Tabs>*/}
            {/*</div>*/}

            {/*/!*Outfit Selection - Conditional*!/*/}
            {/*{outfitGender === "male" ? (*/}
            {/*  <OutfitSelection outfit={outfit} setOutfit={setOutfit} />*/}
            {/*) : (*/}
            {/*  <FemaleOutfitSelection outfit={femaleOutfit} setOutfit={setFemaleOutfit} />*/}
            {/*)}*/}

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
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-destructive">{error}</p>
                    {errorSuggestion && (
                      <p className="text-sm text-muted-foreground">{errorSuggestion}</p>
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
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Output Section */}
        <div
          ref={outputSectionRef}
          className="min-w-0"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Generated Image</h2>
          </div>
          <div>
            {!generatedImage && !isGenerating ? (
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/60 text-center md:aspect-square">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-background flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground px-4">
                  Your generated image will appear here
                </p>
              </div>
            ) : isGenerating ? (
              <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-primary/60 bg-primary/10 p-4 text-center md:aspect-square md:p-6">
                <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin mb-3" />
                <p className="text-sm md:text-base font-medium text-foreground">
                  Creating your portrait...
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 px-4">
                  This may take a moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="group relative overflow-hidden rounded-xl bg-muted/40">
                  <Image
                    src={`data:image/png;base64,${generatedImage}`}
                    alt="Generated result"
                    width={1024}
                    height={1024}
                    className="h-auto w-full"
                  />
                  <div className="absolute inset-0 hidden items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/60 group-hover:opacity-100 lg:flex">
                    <Button
                      onClick={downloadImage}
                      size="lg"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          { generatedImage &&
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
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
            </div>
          }
        </div>
      </div>

      {/* Insufficient Credits Dialog */}
      <InsufficientCreditsDialog
        open={insufficientCreditsDialogOpen}
        onOpenChange={setInsufficientCreditsDialogOpen}
      />
      <SignInRequiredDialog open={signInDialogOpen} onOpenChange={setSignInDialogOpen} />
    </section>
  )
}
