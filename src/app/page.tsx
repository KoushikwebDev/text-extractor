"use client";
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Tesseract from "tesseract.js";
import ExtractedTextPanel from "./ExtractedTextPanel";
import ImageUpload from "./ImageUpload";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pasteMsg, setPasteMsg] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              setImage(file);
              setPasteMsg("Image pasted from clipboard!");
              setTimeout(() => setPasteMsg(null), 2000);
            }
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleExtractText = async () => {
    if (!image) return;
    setLoading(true);
    setExtractedText(null);
    setError(null);
    try {
      const { data } = await Tesseract.recognize(image, "eng");
      setExtractedText(data.text);
      setPanelOpen(true);
    } catch (err) {
      setError("Failed to extract text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setExtractedText(null);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50">
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 shadow-lg py-4 px-6 flex items-center justify-between">
        <span className="text-white text-2xl font-extrabold tracking-tight drop-shadow-lg">
          OCR<span className="text-emerald-200">Text</span>
        </span>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white font-medium transition-colors text-sm"
        >
          GitHub
        </a>
      </nav>

      {/* Paste message */}
      {pasteMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full shadow-lg z-50 text-base font-semibold animate-fade-in-out">
          {pasteMsg}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col items-center">
        <header className="w-full max-w-2xl mb-8 mt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-slate-900 tracking-tight drop-shadow-md">
            OCR <span className="text-indigo-600">Text Extractor</span>
          </h1>
          <p className="mt-3 text-center text-lg text-slate-600 font-medium">
            Upload or paste an image and extract text instantly with AI-powered
            OCR.
          </p>
        </header>
        <main className="w-full max-w-2xl flex flex-col items-center gap-8">
          {imagePreview && (
            <div className="w-full flex flex-col items-center mb-2 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded shadow border border-gray-200"
              />
              <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow focus:outline-none"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <MdClose className="w-5 h-5" />
              </button>
              <span className="text-xs text-gray-500 mt-1">
                Preview of pasted image
              </span>
            </div>
          )}
          {!imagePreview && <ImageUpload onImageSelected={setImage} />}
          <button
            className={`mt-2 px-6 py-3 rounded-lg font-semibold transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 text-white text-lg ${
              image && !loading
                ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600"
                : "bg-gray-300 cursor-not-allowed text-gray-400"
            }`}
            disabled={!image || loading}
            onClick={handleExtractText}
          >
            {loading ? "Extracting..." : "Extract Text"}
          </button>
          {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 py-4 px-6 mt-10 flex items-center justify-center shadow-inner">
        <span className="text-white/90 text-sm">
          &copy; {new Date().getFullYear()} OCR Text Extractor. All rights
          reserved.
        </span>
      </footer>

      <ExtractedTextPanel
        open={panelOpen && !!extractedText}
        text={extractedText || ""}
        onClose={handleClosePanel}
      />
    </div>
  );
}
