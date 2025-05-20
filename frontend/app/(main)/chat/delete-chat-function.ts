"use server";

import { deleteChatsById } from "@/lib/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import "@/lib/client-init";
import { cookies } from "next/headers";

export async function deleteChat(chatId: string, currentPath: string) {
  const res = await deleteChatsById({
    path: {
      id: chatId,
    },
    credentials: "include",
    headers: { Cookie: (await cookies()).toString() },
  });

  if (res.response.ok) {
    revalidatePath("/chat");
    if (currentPath === `/chat/${chatId}`) {
      redirect(`/chat`);
    }
  } else {
    console.log("Error deleting the chat", res.error);
  }
}
