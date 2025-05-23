"use server";

import { postChats } from "@/lib/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import "@/lib/server-init";
import { cookies } from "next/headers";

export async function createNewChat(prompt: string) {
  const chat = await postChats({
    body: {
      prompt: prompt,
    },
    credentials: "include",
    headers: { Cookie: (await cookies()).toString() },
  });

  if (chat.response.ok && chat.data) {
    revalidatePath("/chat");
    redirect(`/chat/${chat.data.chat.id}`);
  } else {
    console.log(chat.error);
  }
}
