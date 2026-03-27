"use client";

import { useRef, useState, useTransition } from "react";
import { createBid } from "@/lib/actions";

export default function BidForm({ projectId }: { projectId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createBid(formData, projectId);
        setSubmitted(true);
        formRef.current?.reset();
      } catch {
        setError("Error al enviar la oferta. Intenta de nuevo.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-green-950 border border-green-800 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-green-300">¡Oferta enviada!</p>
        <p className="text-sm text-green-500 mt-1">El cliente revisará tu propuesta.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-xs text-green-400 hover:text-green-300 underline"
        >
          Enviar otra oferta
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="font-semibold text-zinc-100">Enviar oferta</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Empresa</label>
          <input
            name="company_name"
            required
            placeholder="Nombre de tu empresa"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email de contacto</label>
          <input
            name="contact_email"
            type="email"
            required
            placeholder="empresa@email.com"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Monto de la oferta ($)</label>
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="0.00"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tiempo de entrega (días)</label>
          <input
            name="delivery_days"
            type="number"
            min="1"
            required
            placeholder="ej. 10"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Propuesta</label>
        <textarea
          name="notes"
          required
          rows={4}
          placeholder="Describe tu enfoque, experiencia, materiales y por qué eres la mejor opción para este proyecto..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-4 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando...
          </>
        ) : "Enviar oferta"}
      </button>
    </form>
  );
}
