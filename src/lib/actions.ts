"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const requirements = formData.get("requirements") as string;
  const budget = formData.get("budget") as string;
  const deadline = formData.get("deadline") as string;
  const contact_name = formData.get("contact_name") as string;
  const contact_email = formData.get("contact_email") as string;

  const { error } = await supabase.from("projects").insert({
    title,
    category,
    description,
    requirements: requirements || null,
    budget: budget ? parseFloat(budget) : null,
    deadline: deadline || null,
    contact_name,
    contact_email,
    status: "open",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  redirect("/projects");
}

export async function createBid(formData: FormData, projectId: string) {
  const company_name = formData.get("company_name") as string;
  const contact_email = formData.get("contact_email") as string;
  const amount = formData.get("amount") as string;
  const delivery_days = formData.get("delivery_days") as string;
  const notes = formData.get("notes") as string;

  const { error } = await supabase.from("bids").insert({
    project_id: projectId,
    company_name,
    contact_email,
    amount: parseFloat(amount),
    delivery_days: parseInt(delivery_days),
    notes,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/projects/${projectId}`);
}
