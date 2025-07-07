"use client";
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import ExtractedTextPanel from "./ExtractedTextPanel";
import ImageUpload from "./ImageUpload";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

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

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col items-center">
        <header className="w-full max-w-2xl mb-8 mt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-slate-900 tracking-tight drop-shadow-md">
            OCR <span className="text-indigo-600">Text Extractor</span>
          </h1>
          <p className="mt-3 text-center text-lg text-slate-600 font-medium">
            Upload an image and extract text instantly with AI-powered OCR.
          </p>
        </header>
        <main className="w-full max-w-2xl flex flex-col items-center gap-8">
          <ImageUpload onImageSelected={setImage} />
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
