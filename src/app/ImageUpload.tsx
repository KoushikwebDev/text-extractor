"use client";
import React, { useRef, useState } from "react";

interface ImageUploadProps {
  onImageSelected?: (file: File) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export default function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPEG and PNG images are supported.");
      setPreview(null);
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
    onImageSelected?.(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      className="w-full bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
      role="button"
      aria-label="Upload image"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleChange}
      />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="max-h-48 rounded shadow mb-4"
        />
      ) : (
        <span className="text-gray-400 text-lg text-center">
          Drag & drop a JPEG or PNG image here,
          <br />
          or click to select <br />
          or paste copied image
        </span>
      )}
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
    </div>
  );
}

export type { ImageUploadProps };
