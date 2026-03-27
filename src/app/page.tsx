import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*, bids(id)")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(6);

  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: totalBids } = await supabase
    .from("bids")
    .select("*", { count: "exact", head: true });

  return (
    <div className="flex flex-col min-h-dvh bg-zinc-950 text-zinc-50">
      {/* Header */}
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
          <div className="flex items-center gap-4">
            <Link href="/projects" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
              Ver proyectos
            </Link>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Publicar proyecto
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800 py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950 border border-violet-800 text-violet-300 text-xs font-medium mb-6">
              Sublimación · Vinilo · Merchandising
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              El marketplace de licitación para impresión y producción
            </h1>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              Publica tu proyecto, recibe ofertas de empresas especializadas y elige la mejor propuesta.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/projects/new"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
              >
                Publicar un proyecto
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold transition-colors border border-zinc-700"
              >
                Ver proyectos abiertos
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-zinc-800 py-8 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-violet-400">{totalProjects ?? 0}</div>
              <div className="text-sm text-zinc-500 mt-1">Proyectos publicados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-violet-400">{totalBids ?? 0}</div>
              <div className="text-sm text-zinc-500 mt-1">Ofertas recibidas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-violet-400">3</div>
              <div className="text-sm text-zinc-500 mt-1">Categorías</div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-6 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-8 text-center">¿Qué tipo de trabajo puedes publicar?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: "🎨",
                  title: "Sublimación",
                  desc: "Camisetas, tazas, almohadas, banners y cualquier superficie que acepte transferencia por calor.",
                  color: "border-blue-800 bg-blue-950/40",
                },
                {
                  icon: "✂️",
                  title: "Vinilo",
                  desc: "Corte de vinil, ploteo, letras y gráficos adhesivos para vehículos, vidrios y paredes.",
                  color: "border-orange-800 bg-orange-950/40",
                },
                {
                  icon: "🛍️",
                  title: "Merchandising",
                  desc: "Bolsas, gorras, playeras, artículos promocionales y producción de mercancía de marca.",
                  color: "border-violet-800 bg-violet-950/40",
                },
              ].map((cat) => (
                <div key={cat.title} className={`rounded-2xl border p-6 ${cat.color}`}>
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold text-zinc-100 mb-2">{cat.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        {projects && projects.length > 0 && (
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Proyectos recientes</h2>
                <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300">
                  Ver todos →
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p as unknown as Project} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="py-16 px-6 border-t border-zinc-800 bg-zinc-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-12">¿Cómo funciona?</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-xs font-medium mb-5">Para clientes</div>
                <div className="space-y-5">
                  {[
                    ["Publica tu proyecto", "Describe lo que necesitas: tipo, cantidad, especificaciones y presupuesto."],
                    ["Recibe ofertas", "Empresas especializadas revisan tu proyecto y envían sus propuestas."],
                    ["Elige la mejor", "Compara precios, tiempos y propuestas, y contacta al proveedor ganador."],
                  ].map(([title, desc], i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-violet-900 text-violet-300 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      <div>
                        <p className="font-medium text-zinc-200 text-sm">{title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-950 border border-violet-800 text-violet-300 text-xs font-medium mb-5">Para empresas de servicio</div>
                <div className="space-y-5">
                  {[
                    ["Explora proyectos", "Navega proyectos abiertos filtrados por categoría y presupuesto."],
                    ["Envía tu oferta", "Propón tu precio, tiempo de entrega y explica tu propuesta."],
                    ["Gana contratos", "Si el cliente te elige, recibe su contacto directo para cerrar el trato."],
                  ].map(([title, desc], i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-violet-900 text-violet-300 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      <div>
                        <p className="font-medium text-zinc-200 text-sm">{title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 border-t border-zinc-800 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
            <p className="text-zinc-400 mb-8">Publica tu proyecto gratis y empieza a recibir ofertas hoy.</p>
            <Link
              href="/projects/new"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
            >
              Publicar proyecto gratis
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-5 text-center text-xs text-zinc-600">
        PrintBid — Marketplace de licitación para sublimación, vinilo y merchandising
      </footer>
    </div>
  );
}
