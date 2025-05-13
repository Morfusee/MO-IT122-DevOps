import { Stack, Title } from "@mantine/core";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { cookies } from "next/headers";
import { getChatsById } from "@/lib/client";

import "@/lib/client-init";

type Params = Promise<{ id: string }>;

async function ChatLog({ params }: { params: Params }) {
  const { id } = await params;

  const chatDetail = await getChatsById({
    path: {
      id: id,
    },
    credentials: "include",
    headers: { Cookie: (await cookies()).toString() },
  });

  return (
    <Stack align="center" className="overflow-y-hidden w-full h-full">
      <Stack className="w-full max-w-2xl">
        <Title order={3}>{chatDetail.data?.name}</Title>
      </Stack>
      <MessageList id={id} />
      <MessageInput id={id} />
    </Stack>
  );
}

export default ChatLog;
