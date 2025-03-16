
import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";

interface UploadPlaceholderProps {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  maxSizeMB: number;
  aspectRatio?: number;
  onClick: () => void;
}

export const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  maxSizeMB,
  aspectRatio,
  onClick,
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center space-y-2 text-center"
      onClick={onClick}
    >
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
  );
};
