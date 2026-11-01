"use server";

import { fetchWrapper } from "@/lib/fetch-wrapper";
import { revalidatePath } from "next/cache";

export async function joinGroup(formData: FormData) {
  const groupId = Number(formData.get("group_id"));
  if (!Number.isFinite(groupId)) return;

  try {
    await fetchWrapper("/group/join", {
      method: "POST",
      body: JSON.stringify({ group_id: groupId }),
    });

    revalidatePath("/mu");
  } catch (error) {
    console.error("Join group error:", error);
    return;
  }
}
