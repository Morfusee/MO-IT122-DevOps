import { Stack, Title } from "@mantine/core";
import MessageList from "./message-list";
import MessageInput from "./message-input";

type Params = Promise<{ id: string }>;

async function ChatLog({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Stack align="center" className="overflow-y-hidden w-full h-full">
      <Stack className="w-full max-w-2xl">
        <Title order={3}>The pavlovian architecture</Title>
      </Stack>
      <MessageList />
      <MessageInput />
    </Stack>
  );
}

export default ChatLog;
