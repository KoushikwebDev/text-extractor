"use client";
import React, { useState } from "react";
import { MdTextFields, MdContentCopy } from "react-icons/md";

interface ExtractedTextPanelProps {
  open: boolean;
  text: string;
  onClose: () => void;
}

export default function ExtractedTextPanel({
  open,
  text,
  onClose,
}: ExtractedTextPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{ boxShadow: open ? "-4px 0 24px 0 rgba(0,0,0,0.08)" : undefined }}
      aria-modal="true"
      role="dialog"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 text-2xl">
            <MdTextFields />
          </span>
          <h2 className="text-xl font-bold">Extracted Content</h2>
          <button
            className="text-gray-400 hover:text-blue-600 text-xl p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleCopy}
            aria-label="Copy extracted text"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            <MdContentCopy className="w-5 h-5" />
          </button>
          {copied && (
            <span className="text-xs text-green-600 ml-1">Copied!</span>
          )}
        </div>
        <button
          className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close panel"
        >
          &times;
        </button>
      </div>
      <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">
        <pre className="whitespace-pre-wrap text-gray-800 text-base">
          {text}
        </pre>
      </div>
    </div>
  );
}
