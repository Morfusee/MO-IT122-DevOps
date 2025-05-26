"use server";

import { postChats } from "@/lib/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import "@/lib/server-init";

export async function createNewChat(prompt: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const chat = await postChats({
      body: {
        prompt: prompt,
      },
      credentials: "include",
      headers: { Cookie: `accessToken=${token}` },
    });

    if (chat.response.ok && chat.data) {
      revalidatePath("/chat");
      redirect(`/chat/${chat.data.chat.id}`);
    } else {
      console.log("Doggy", chat.error);
    }
  } catch (err) {
    console.log("Woggy", err);
  }
}
