
import React, { useState, useRef } from "react";
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
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const img = new Image();
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
        
        if (aspectRatio && Math.abs(img.width / img.height - aspectRatio) > 0.1) {
          validImage = false;
          message = `Image aspect ratio should be approximately ${aspectRatio}:1`;
        }
        
        if (!validImage) {
          toast.error(message);
          return;
        }
        
        // Create resized image if needed
        const canvas = document.createElement("canvas");
        let newWidth = img.width;
        let newHeight = img.height;
        
        // Resize if larger than max dimensions
        if (newWidth > maxWidth) {
          newHeight = (newHeight * maxWidth) / newWidth;
          newWidth = maxWidth;
        }
        
        if (newHeight > maxHeight) {
          newWidth = (newWidth * maxHeight) / newHeight;
          newHeight = maxHeight;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
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
              className="w-full h-auto rounded-md object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
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
                  JPG, PNG or GIF • Max {maxSizeMB}MB
                </p>
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
