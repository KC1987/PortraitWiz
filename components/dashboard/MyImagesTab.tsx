"use client"

import { useState, useEffect } from "react"
import { useAtomValue } from "jotai"
import Image from "next/image"
import { authAtom } from "@/lib/atoms"
import { createClient } from "@/utils/supabase/client"
import { Download, Loader2, ImageIcon, AlertCircle, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"

type StorageImage = {
  name: string
  url: string
  createdAt: string
  watermarkedUrl?: string
}

export default function MyImagesTab() {
  const auth = useAtomValue(authAtom)
  const [images, setImages] = useState<StorageImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingImage, setDeletingImage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<StorageImage | null>(null)
  const supabase = createClient()

  // Check if user has purchased a package
  const hasPurchasedPackage = auth?.profile?.transactions && auth.profile.transactions.length > 0

  // Browser-based watermark function using Canvas API
  const watermarkImage = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const logo = new window.Image()
        logo.crossOrigin = 'anonymous'

        logo.onload = () => {
          const logoSize = Math.floor(img.width * 0.4)
          const logoAspectRatio = logo.width / logo.height
          const logoWidth = logoSize
          const logoHeight = logoSize / logoAspectRatio

          const padding = 20
          const x = canvas.width - logoWidth - padding
          const y = (canvas.height - logoHeight) / 2

          ctx.drawImage(logo, x, y, logoWidth, logoHeight)

          const watermarkedDataUrl = canvas.toDataURL('image/png')
          resolve(watermarkedDataUrl)
        }

        logo.onerror = () => {
          console.warn('Failed to load watermark logo, returning original image')
          resolve(imageUrl)
        }

        logo.src = '/brand/logo-watermark.png'
      }

      img.onerror = () => {
        reject(new Error('Failed to load image for watermarking'))
      }

      img.src = imageUrl
    })
  }

  useEffect(() => {
    const fetchImages = async () => {
      if (!auth?.profile?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // List all files in user's folder
        const { data: fileList, error: listError } = await supabase.storage
          .from("user-images")
          .list(auth.profile.id, {
            sortBy: { column: "created_at", order: "desc" },
          })

        if (listError) {
          throw listError
        }

        if (!fileList || fileList.length === 0) {
          setImages([])
          setIsLoading(false)
          return
        }

        // Get signed URLs for each image (valid for 1 hour)
        const imageDataPromises = fileList.map(async (file) => {
          const { data, error } = await supabase.storage
            .from("user-images")
            .createSignedUrl(`${auth.profile.id}/${file.name}`, 3600) // 1 hour expiry

          if (error) {
            console.error(`Error creating signed URL for ${file.name}:`, error)
            return null
          }

          return {
            name: file.name,
            url: data.signedUrl,
            createdAt: file.created_at || "",
          }
        })

        const imageData = (await Promise.all(imageDataPromises)).filter(
          (img): img is StorageImage => img !== null
        )

        // Apply watermarks if user hasn't purchased
        if (!hasPurchasedPackage && imageData.length > 0) {
          const watermarkedImages = await Promise.all(
            imageData.map(async (image) => {
              try {
                const watermarkedUrl = await watermarkImage(image.url)
                return { ...image, watermarkedUrl }
              } catch (err) {
                console.error('Failed to watermark image:', err)
                return image
              }
            })
          )
          setImages(watermarkedImages)
        } else {
          setImages(imageData)
        }
      } catch (err) {
        console.error("Error fetching images:", err)
        setError(err instanceof Error ? err.message : "Failed to load images")
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [auth?.profile?.id, supabase, hasPurchasedPackage])

  const handleDownload = (image: StorageImage) => {
    const link = document.createElement("a")
    // Download watermarked version if user hasn't purchased
    const downloadUrl = !hasPurchasedPackage && image.watermarkedUrl
      ? image.watermarkedUrl
      : image.url
    link.href = downloadUrl
    link.download = image.name
    link.target = "_blank"
    link.click()
  }

  const handleDelete = async (imageName: string) => {
    if (!auth?.profile?.id) return

    const confirmDelete = window.confirm('Are you sure you want to delete this image? This action cannot be undone.')
    if (!confirmDelete) return

    try {
      setDeletingImage(imageName)

      const { error } = await supabase.storage
        .from("user-images")
        .remove([`${auth.profile.id}/${imageName}`])

      if (error) {
        throw error
      }

      // Remove from local state
      setImages(prev => prev.filter(img => img.name !== imageName))
    } catch (err) {
      console.error('Error deleting image:', err)
      alert('Failed to delete image. Please try again.')
    } finally {
      setDeletingImage(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading your images...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive font-medium mb-2">Error loading images</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium mb-2">No images yet</p>
        <p className="text-muted-foreground text-sm">
          Generate your first AI portrait to see it here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Images</h2>
        <p className="text-muted-foreground">
          {images.length} {images.length === 1 ? "image" : "images"} generated
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => {
          // Display watermarked version if user hasn't purchased
          const displayUrl = !hasPurchasedPackage && image.watermarkedUrl
            ? image.watermarkedUrl
            : image.url
          const isDeleting = deletingImage === image.name

          return (
            <div key={image.name} className="space-y-3">
              <div
                className="relative aspect-square overflow-hidden rounded-lg bg-muted/60 ring-1 ring-border/40 cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={displayUrl}
                  alt={`Generated image ${image.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized={!hasPurchasedPackage && !!image.watermarkedUrl}
                />
              </div>
              {/* Buttons below image */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload(image)}
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  onClick={() => handleDelete(image.name)}
                  disabled={isDeleting}
                  size="sm"
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full-size image modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="w-[95vw] h-[90vh] p-0 flex items-center justify-center" showCloseButton={false}>
          <DialogTitle className="sr-only">
            {selectedImage ? `Full size image: ${selectedImage.name}` : 'Image preview'}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-background/80 p-1">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedImage && (
            <div className="relative w-full h-full">
              <Image
                src={
                  !hasPurchasedPackage && selectedImage.watermarkedUrl
                    ? selectedImage.watermarkedUrl
                    : selectedImage.url
                }
                alt={`Full size ${selectedImage.name}`}
                fill
                sizes="95vw"
                className="object-contain"
                unoptimized={!hasPurchasedPackage && !!selectedImage.watermarkedUrl}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
