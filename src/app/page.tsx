"use client";

import { useState } from "react";
import Image from "next/image";

type ImageSize = "1024x1024" | "1792x1024" | "1024x1792";
type ImageQuality = "standard" | "hd";
type ImageStyle = "vivid" | "natural";

interface GeneratedImage {
  url: string;
  prompt: string;
  revisedPrompt?: string;
  size: ImageSize;
  timestamp: number;
}

const SIZE_LABELS: Record<ImageSize, string> = {
  "1024x1024": "Cuadrada (1:1)",
  "1792x1024": "Apaisada (16:9)",
  "1024x1792": "Vertical (9:16)",
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<ImageSize>("1024x1024");
  const [quality, setQuality] = useState<ImageQuality>("standard");
  const [style, setStyle] = useState<ImageStyle>("vivid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [selected, setSelected] = useState<GeneratedImage | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size, quality, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al generar la imagen.");
        return;
      }

      const newImage: GeneratedImage = {
        url: data.imageUrl,
        prompt,
        revisedPrompt: data.revisedPrompt,
        size,
        timestamp: Date.now(),
      };

      setGallery((prev) => [newImage, ...prev]);
      setSelected(newImage);
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">ImageAI</h1>
            <p className="text-xs text-zinc-400">Generador de imágenes con DALL-E 3</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

        {/* Generator Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Describe tu imagen
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Un astronauta explorando una jungla alienígena al atardecer, arte digital, ultradetallado..."
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
                }}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tamaño</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as ImageSize)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {(Object.keys(SIZE_LABELS) as ImageSize[]).map((s) => (
                    <option key={s} value={s}>{SIZE_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Calidad</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as ImageQuality)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="standard">Estándar</option>
                  <option value="hd">HD (más detalle)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Estilo</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as ImageStyle)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="vivid">Vívido (dramático)</option>
                  <option value="natural">Natural (realista)</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-end px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generar imagen
                  <span className="text-violet-300 text-xs font-normal hidden sm:inline">⌘ Enter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="aspect-square bg-zinc-800 flex items-center justify-center animate-pulse">
              <div className="text-center text-zinc-500">
                <svg className="w-12 h-12 mx-auto mb-3 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm">Creando tu imagen con DALL-E 3...</p>
                <p className="text-xs mt-1 text-zinc-600">Puede tomar hasta 30 segundos</p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Image */}
        {selected && !loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="relative">
              <Image
                src={selected.url}
                alt={selected.prompt}
                width={1024}
                height={1024}
                className="w-full object-contain max-h-[70vh]"
                unoptimized
              />
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur text-white text-xs font-medium hover:bg-black/80 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
              </a>
            </div>
            <div className="p-5">
              <p className="text-sm text-zinc-300 font-medium">{selected.prompt}</p>
              {selected.revisedPrompt && selected.revisedPrompt !== selected.prompt && (
                <details className="mt-3">
                  <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">
                    Ver prompt revisado por DALL-E
                  </summary>
                  <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{selected.revisedPrompt}</p>
                </details>
              )}
              <span className="inline-flex items-center mt-3 px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 text-xs">
                {SIZE_LABELS[selected.size]}
              </span>
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 1 && (
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Generadas en esta sesión
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((img) => (
                <button
                  key={img.timestamp}
                  onClick={() => setSelected(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                    selected?.timestamp === img.timestamp
                      ? "border-violet-500"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.prompt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {gallery.length === 0 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-500">Escribe un prompt y genera tu primera imagen</p>
            <p className="text-xs mt-1 text-zinc-700">Powered by DALL-E 3 · OpenAI</p>
          </div>
        )}

      </main>

      <footer className="border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-600">
        ImageAI — Powered by DALL-E 3 &amp; Next.js
      </footer>
    </div>
  );
}
