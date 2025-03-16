
import { toast } from "sonner";
import { ImageProcessingOptions } from "./types";

export const processImage = (
  file: File,
  options: ImageProcessingOptions,
  callback: (file: File, dataUrl: string) => void
): void => {
  const { maxSizeMB, minWidth, minHeight, maxWidth, maxHeight, aspectRatio } = options;
  const reader = new FileReader();
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    toast.error(`File size exceeds ${maxSizeMB}MB limit`);
    return;
  }
  
  reader.onload = (e) => {
    const img = document.createElement("img");
    
    img.onload = () => {
      // Validate dimensions
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
      
      // Process and optimize image
      const canvas = document.createElement("canvas");
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;
      let targetWidth = img.width;
      let targetHeight = img.height;
      
      // Apply aspect ratio cropping if specified
      if (aspectRatio) {
        if (img.width / img.height > aspectRatio) {
          sourceWidth = img.height * aspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else if (img.width / img.height < aspectRatio) {
          sourceHeight = img.width / aspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
      }
      
      // Scale down if too large
      if (targetWidth > maxWidth) {
        targetHeight = (targetHeight * maxWidth) / targetWidth;
        targetWidth = maxWidth;
      }
      
      if (targetHeight > maxHeight) {
        targetWidth = (targetWidth * maxHeight) / targetHeight;
        targetHeight = maxHeight;
      }
      
      // Draw optimized image to canvas
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(
        img, 
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, targetWidth, targetHeight
      );
      
      // Convert to optimized JPEG
      const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
      
      // Convert data URL to File
      fetch(optimizedDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const optimizedFile = new File(
            [blob], 
            file.name, 
            { type: "image/jpeg" }
          );
          callback(optimizedFile, optimizedDataUrl);
        });
    };
    
    img.src = e.target?.result as string;
  };
  
  reader.readAsDataURL(file);
};
