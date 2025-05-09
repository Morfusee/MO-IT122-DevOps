import { Button, Container, Divider, Stack, Text } from "@mantine/core";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container
      size="xl"
      className="h-full py-8 grid grid-cols-[220px_20px_1fr] gap-8"
    >
      <ChatHistory />
      <Divider orientation="vertical" />
      <Stack>{children}</Stack>
    </Container>
  );
}

function ChatHistory() {
  return (
    <Stack align="center">
      <Text size="lg" fw={700}>
        AI Tutor
      </Text>
      <Button fullWidth>Start a Chat</Button>
    </Stack>
  );
}

export default Layout;
