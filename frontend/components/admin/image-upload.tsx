"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  onRemove: (url: string) => void
  disabled?: boolean
  maxImages?: number
}

// Backend URL for serving media files
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"

/**
 * Resolves an image URL to a full URL
 */
function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return "/placeholder.svg"
  
  // Already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Media URL from our backend
  if (url.startsWith('/media/')) {
    return `${BACKEND_URL}${url}`
  }
  
  // Local public file or placeholder
  if (url.startsWith('/')) {
    return url
  }
  
  return "/placeholder.svg"
}

export function ImageUpload({ value, onChange, onRemove, disabled, maxImages = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) {
      return
    }

    // Check if we're exceeding max images
    if (value.length + files.length > maxImages) {
      toast.error(`حداکثر ${maxImages} تصویر می‌توانید آپلود کنید`)
      return
    }

    setIsUploading(true)

    try {
      const { urls } = await apiClient.uploadImages(files)
      if (urls && urls.length > 0) {
        onChange([...value, ...urls])
        toast.success("تصاویر با موفقیت آپلود شدند")
      }
    } catch (error: any) {
      toast.error(error?.message || "خطا در آپلود تصاویر")
      console.error("Error uploading images:", error)
    } finally {
      setIsUploading(false)
      // Reset input so same file can be re-selected
      event.target.value = ""
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        {value.map((url, index) => (
          <div 
            key={`${url}-${index}`} 
            className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted shadow-sm"
          >
            <img 
              src={resolveImageUrl(url)} 
              alt={`Product image ${index + 1}`} 
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={() => onRemove(url)}
              disabled={disabled || isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {value.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            className="h-24 w-24 flex-col items-center justify-center rounded-lg border-dashed"
            onClick={() => document.getElementById("image-upload-input")?.click()}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <PlusCircle className="mb-1 h-6 w-6 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {isUploading ? "در حال آپلود..." : "آپلود تصویر"}
            </span>
          </Button>
        )}
        
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          multiple
          placeholder="انتخاب تصویر"
          title="انتخاب تصویر برای آپلود"
          aria-label="انتخاب تصویر برای آپلود"
          className="hidden"
          onChange={handleUpload}
          disabled={disabled || isUploading}
        />
      </div>
      
      {value.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {value.length} از {maxImages} تصویر
        </p>
      )}
    </div>
  )
}
