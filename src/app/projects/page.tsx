import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProjectCard from "@/components/ProjectCard";
import { Project, Category, CATEGORY_LABELS } from "@/lib/types";

export const revalidate = 30;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  const params = await searchParams;
  const category = params.category as Category | undefined;
  const status = params.status ?? "open";

  let query = supabase
    .from("projects")
    .select("*, bids(id)")
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (status !== "all") query = query.eq("status", status);

  const { data: projects } = await query;

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
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Proyectos</h1>
            <p className="text-zinc-500 text-sm mt-1">{projects?.length ?? 0} resultado{projects?.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Todos", value: "" },
              { label: "Sublimación", value: "sublimation" },
              { label: "Vinilo", value: "vinyl" },
              { label: "Merchandising", value: "merchandise" },
            ].map((f) => (
              <Link
                key={f.value}
                href={`/projects?${f.value ? `category=${f.value}&` : ""}status=${status}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  (category ?? "") === f.value
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            {[
              { label: "Abiertos", value: "open" },
              { label: "Todos", value: "all" },
            ].map((f) => (
              <Link
                key={f.value}
                href={`/projects?${category ? `category=${category}&` : ""}status=${f.value}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  status === f.value
                    ? "bg-zinc-700 text-white border-zinc-600"
                    : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p as unknown as Project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-zinc-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No hay proyectos con estos filtros.</p>
            <Link href="/projects/new" className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300">
              Publicar el primero →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
