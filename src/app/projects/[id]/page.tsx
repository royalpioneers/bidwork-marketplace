import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BidForm from "@/components/BidForm";
import { CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS, STATUS_COLORS, Project, Bid } from "@/lib/types";

export const revalidate = 30;

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: bids } = await supabase
    .from("bids")
    .select("*")
    .eq("project_id", id)
    .order("amount", { ascending: true });

  const p = project as Project;
  const bidList = (bids ?? []) as Bid[];

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
            ← Proyectos
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="flex gap-8 flex-col lg:flex-row">

          {/* Left: Project Detail */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[p.category]}`}>
                {CATEGORY_LABELS[p.category]}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[p.status]}`}>
                {STATUS_LABELS[p.status]}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-zinc-100 mb-2">{p.title}</h1>
            <p className="text-sm text-zinc-500 mb-6">
              Publicado por <span className="text-zinc-300">{p.contact_name}</span> · {new Date(p.created_at).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Presupuesto</p>
                <p className="text-lg font-bold text-zinc-100">
                  {p.budget ? `$${p.budget.toLocaleString()}` : "A convenir"}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Vence</p>
                <p className="text-lg font-bold text-zinc-100">
                  {p.deadline ? new Date(p.deadline).toLocaleDateString("es", { day: "numeric", month: "short" }) : "Sin fecha"}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Ofertas</p>
                <p className="text-lg font-bold text-zinc-100">{bidList.length}</p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">Descripción</h2>
              <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{p.description}</p>
            </div>

            {p.requirements && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-zinc-300 mb-3">Especificaciones técnicas</h2>
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{p.requirements}</p>
              </div>
            )}

            {/* Bids List */}
            {bidList.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800">
                  <h2 className="font-semibold text-zinc-200">Ofertas recibidas ({bidList.length})</h2>
                </div>
                <div className="divide-y divide-zinc-800">
                  {bidList.map((bid) => (
                    <div key={bid.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="font-medium text-zinc-200">{bid.company_name}</p>
                          <p className="text-xs text-zinc-500">{new Date(bid.created_at).toLocaleDateString("es")}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-violet-400">${bid.amount.toLocaleString()}</p>
                          <p className="text-xs text-zinc-500">{bid.delivery_days} días</p>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">{bid.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Bid Form */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-6">
              {p.status === "open" ? (
                <BidForm projectId={p.id} />
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-400 text-sm">
                  Este proyecto ya no está aceptando ofertas.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
