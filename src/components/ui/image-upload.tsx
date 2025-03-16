
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onImageChange: (file: File | null, preview: string | null) => void;
  previewUrl?: string | null;
  className?: string;
  maxSizeMB?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: number;
  helpText?: string;
  alt?: string;
}

export function ImageUpload({
  onImageChange,
  previewUrl,
  className,
  maxSizeMB = 2,
  minWidth = 200,
  minHeight = 200,
  maxWidth = 2000,
  maxHeight = 2000,
  aspectRatio,
  helpText,
  alt = "Image preview",
  ...props
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set initial preview from props
  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
    }
  }, [previewUrl]);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }
    
    // Check image dimensions and apply resizing if needed
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        let validImage = true;
        let message = "";
        
        if (img.width < minWidth || img.height < minHeight) {
          validImage = false;
          message = `Image dimensions are too small. Minimum: ${minWidth}x${minHeight}px`;
        }
        
        if (img.width > maxWidth || img.height > maxHeight) {
          validImage = false;
          message = `Image dimensions are too large. Maximum: ${maxWidth}x${maxHeight}px`;
        }
        
        if (!validImage) {
          toast.error(message);
          return;
        }
        
        // Create canvas for the processed image
        const canvas = document.createElement("canvas");
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let targetWidth = img.width;
        let targetHeight = img.height;
        
        // Apply auto-cropping if aspect ratio is required
        if (aspectRatio) {
          if (img.width / img.height > aspectRatio) {
            // Image is wider than target aspect ratio, crop sides
            sourceWidth = img.height * aspectRatio;
            sourceX = (img.width - sourceWidth) / 2; // Center horizontally
          } else if (img.width / img.height < aspectRatio) {
            // Image is taller than target aspect ratio, crop top/bottom
            sourceHeight = img.width / aspectRatio;
            sourceY = (img.height - sourceHeight) / 2; // Center vertically
          }
        }
        
        // Resize if larger than max dimensions
        if (targetWidth > maxWidth) {
          targetHeight = (targetHeight * maxWidth) / targetWidth;
          targetWidth = maxWidth;
        }
        
        if (targetHeight > maxHeight) {
          targetWidth = (targetWidth * maxHeight) / targetHeight;
          targetHeight = maxHeight;
        }
        
        // Set canvas size to the target dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(
          img, 
          sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle
          0, 0, targetWidth, targetHeight // Destination rectangle
        );
        
        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPreview(optimizedDataUrl);
        
        // Convert data URL back to file
        fetch(optimizedDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const optimizedFile = new File(
              [blob], 
              file.name, 
              { type: "image/jpeg" }
            );
            onImageChange(optimizedFile, optimizedDataUrl);
          });
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onImageChange(null, null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          preview ? "h-auto aspect-auto" : "h-40"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!preview ? handleClick : undefined}
      >
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt={alt}
              className="w-full h-auto max-h-[250px] rounded-md object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              type="button" 
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={handleClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace Image
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="rounded-full bg-primary/10 p-2">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drag & drop an image or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF • Max {maxSizeMB}MB • Optimal {minWidth}x{minHeight}px to {maxWidth}x{maxHeight}px
                </p>
                {aspectRatio && (
                  <p className="text-xs text-muted-foreground">
                    Aspect ratio: {aspectRatio}:1 (recommended)
                    {aspectRatio === 1 && " • Images will be auto-cropped if needed"}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files)}
              {...props}
            />
          </>
        )}
      </div>
      
      {helpText && !preview && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
