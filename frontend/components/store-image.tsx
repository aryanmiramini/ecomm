"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { PLACEHOLDER_IMAGE, resolveMediaUrl } from "@/lib/media"

type StoreImageProps = {
  src?: string | null
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  objectFit?: "cover" | "contain"
}

export function StoreImage({
  src,
  alt,
  className,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  objectFit = "cover",
}: StoreImageProps) {
  const resolved = resolveMediaUrl(src)
  const [currentSrc, setCurrentSrc] = useState(resolved)

  const imageClass = cn(
    objectFit === "cover" ? "object-cover" : "object-contain",
    className,
  )

  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={imageClass}
        onError={() => {
          if (currentSrc !== PLACEHOLDER_IMAGE) {
            setCurrentSrc(PLACEHOLDER_IMAGE)
          }
        }}
      />
    )
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      sizes={sizes}
      priority={priority}
      className={imageClass}
      onError={() => {
        if (currentSrc !== PLACEHOLDER_IMAGE) {
          setCurrentSrc(PLACEHOLDER_IMAGE)
        }
      }}
    />
  )
}
