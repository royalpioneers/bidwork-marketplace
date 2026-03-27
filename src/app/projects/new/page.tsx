import Link from "next/link";
import { createProject } from "@/lib/actions";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="font-bold text-lg">PrintBid</span>
          </Link>
          <Link href="/projects" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            ← Volver a proyectos
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Publicar proyecto</h1>
          <p className="text-zinc-400 text-sm mt-1">Describe tu proyecto y empieza a recibir ofertas de empresas especializadas.</p>
        </div>

        <form action={createProject} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 flex flex-col gap-5">

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Título del proyecto *</label>
            <input
              name="title"
              required
              placeholder="ej. 200 playeras sublimadas para evento corporativo"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Categoría *</label>
            <select
              name="category"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Selecciona una categoría</option>
              <option value="sublimation">Sublimación</option>
              <option value="vinyl">Vinilo</option>
              <option value="merchandise">Merchandising</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Descripción del proyecto *</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe qué necesitas, para qué, cuándo y cualquier detalle importante..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Especificaciones técnicas <span className="text-zinc-500 font-normal">(opcional)</span>
            </label>
            <textarea
              name="requirements"
              rows={3}
              placeholder="Tallas, colores, materiales, formato de archivos, cantidad por talla..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Presupuesto estimado ($) <span className="text-zinc-500 font-normal">(opcional)</span>
              </label>
              <input
                name="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="ej. 5000"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Fecha límite <span className="text-zinc-500 font-normal">(opcional)</span>
              </label>
              <input
                name="deadline"
                type="date"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-5">
            <p className="text-sm font-medium text-zinc-300 mb-4">Datos de contacto</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nombre *</label>
                <input
                  name="contact_name"
                  required
                  placeholder="Tu nombre o empresa"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email *</label>
                <input
                  name="contact_email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors mt-1"
          >
            Publicar proyecto
          </button>
        </form>
      </main>
    </div>
  );
}
