import { Button, Container, Divider, Stack, Title } from "@mantine/core";
import Link from "next/link";
import ChatList from "./chat-list";
import { getChats } from "@/lib/client";
import { cookies } from "next/headers";

import "@/lib/server-init";

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container
      size="xl"
      className="h-screen py-8 grid grid-cols-[220px_47px_1fr] justify-items-center"
    >
      <ChatHistory />
      <Divider orientation="vertical" />
      <>{children}</>
    </Container>
  );
}

async function ChatHistory() {
  const chatList = await getChats({
    credentials: "include",
    headers: { Cookie: (await cookies()).toString() },
  });

  return (
    <Stack align="center" gap={2} className="w-full" data-name="chat-history">
      <Stack align="center" className="w-full mb-4">
        <Title order={4} fw={700}>
          AI Tutor
        </Title>
        <Button component={Link} href="/chat" fullWidth>
          Start a Chat
        </Button>
      </Stack>
      {chatList.response.ok && chatList.data ? (
        <ChatList list={chatList.data} />
      ) : (
        <div>Error getting the chat list</div>
      )}
    </Stack>
  );
}

export default Layout;
