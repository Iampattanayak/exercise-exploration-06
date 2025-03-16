
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  alt: string;
  onRemove: () => void;
  onReplace: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  alt,
  onRemove,
  onReplace,
}) => {
  return (
    <div className="relative w-full">
      <img
        src={previewUrl}
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
          onRemove();
        }}
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        type="button" 
        variant="secondary"
        size="sm"
        className="mt-2"
        onClick={onReplace}
      >
        <Upload className="h-4 w-4 mr-2" />
        Replace Image
      </Button>
    </div>
  );
};
