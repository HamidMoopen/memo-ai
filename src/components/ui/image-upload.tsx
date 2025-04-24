import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  maxSize?: number
  accept?: string
  className?: string
}

export function ImageUpload({
  onImageSelect,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      onImageSelect(file)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 flex flex-col items-center justify-center gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Click to upload an image
          </span>
        </Button>
      )}
    </div>
  )
} 