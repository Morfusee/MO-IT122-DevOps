import { Stack, Text } from "@mantine/core";

type Params = Promise<{ id: string }>;

async function ChatLog({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Stack>
      <Text>Chat {id}</Text>
    </Stack>
  );
}

export default ChatLog;
