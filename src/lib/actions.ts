"use server";

import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  void formData;
  redirect("/projects");
}

export async function createBid(formData: FormData, projectId: string) {
  void formData;
  void projectId;
}
