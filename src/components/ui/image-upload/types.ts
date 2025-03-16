
import { type InputHTMLAttributes } from "react";

export interface ImageUploadProps extends InputHTMLAttributes<HTMLInputElement> {
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

export interface ImageProcessingOptions {
  maxSizeMB: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  aspectRatio?: number;
}
