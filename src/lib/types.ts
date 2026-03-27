export type Category = "sublimation" | "vinyl" | "merchandise";
export type ProjectStatus = "open" | "closed" | "awarded";

export interface Project {
  id: string;
  title: string;
  category: Category;
  description: string;
  requirements: string | null;
  budget: number | null;
  deadline: string | null;
  contact_name: string;
  contact_email: string;
  status: ProjectStatus;
  created_at: string;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  project_id: string;
  company_name: string;
  contact_email: string;
  amount: number;
  delivery_days: number;
  notes: string;
  created_at: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  sublimation: "Sublimación",
  vinyl: "Vinilo",
  merchandise: "Merchandising",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  sublimation: "bg-blue-100 text-blue-800",
  vinyl: "bg-orange-100 text-orange-800",
  merchandise: "bg-violet-100 text-violet-800",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  open: "Abierto",
  closed: "Cerrado",
  awarded: "Adjudicado",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  open: "bg-green-100 text-green-800",
  closed: "bg-zinc-100 text-zinc-600",
  awarded: "bg-indigo-100 text-indigo-800",
};
