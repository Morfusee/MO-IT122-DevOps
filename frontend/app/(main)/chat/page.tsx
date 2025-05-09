import { Stack, Textarea, Title } from "@mantine/core";

function Page() {
  return (
    <Stack justify="center" align="center" className="w-full h-full">
      <Stack align="center" gap="xl" className="w-full max-w-2xl">
        <Title order={2} className="text-center">
          Hello Test User, ready for a tutoring session?
        </Title>
        <ChatInput />
      </Stack>
    </Stack>
  );
}

function ChatInput() {
  return (
    <Stack className="px-4 py-1 w-full max-w-2xl rounded-2xl bg-gray-100">
      <Textarea
        variant="unstyled"
        size="md"
        placeholder="Ask a question"
        autosize
        minRows={3}
      />
    </Stack>
  );
}

export default Page;
