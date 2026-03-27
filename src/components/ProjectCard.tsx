import Link from "next/link";
import { Project, CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[project.category]}`}>
          {CATEGORY_LABELS[project.category]}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      <h2 className="font-semibold text-zinc-100 group-hover:text-white transition-colors mb-1 line-clamp-2">
        {project.title}
      </h2>
      <p className="text-xs text-zinc-500 mb-3">por {project.contact_name}</p>
      <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{project.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
        <div>
          {project.budget ? (
            <span className="text-sm font-semibold text-zinc-100">
              ${project.budget.toLocaleString()}
            </span>
          ) : (
            <span className="text-sm text-zinc-500">Presupuesto a convenir</span>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-500">
            {project.bids?.length ?? 0} oferta{(project.bids?.length ?? 0) !== 1 ? "s" : ""}
          </span>
          {project.deadline && (
            <p className="text-xs text-zinc-600 mt-0.5">
              Vence {new Date(project.deadline).toLocaleDateString("es", { day: "numeric", month: "short" })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
