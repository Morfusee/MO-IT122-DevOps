"use server";

import { patchChatsById } from "@/lib/client";

import { revalidatePath } from "next/cache";

import "@/lib/server-init";
import { cookies } from "next/headers";

export async function editChatTitle(chatId: string, title: string) {
  const res = await patchChatsById({
    path: {
      id: chatId,
    },
    body: {
      name: title,
    },
    credentials: "include",
    headers: { Cookie: (await cookies()).toString() },
  });

  if (res.response.ok) {
    revalidatePath("/chat");
  } else {
    console.log("Error deleting the chat", res.error);
  }
}
