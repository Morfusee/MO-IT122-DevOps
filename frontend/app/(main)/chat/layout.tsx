import { Button, Container, Divider, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

function Layout({
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

function ChatHistory() {
  return (
    <Stack align="center" gap={2} className="w-full">
      <Stack align="center" className="w-full mb-4">
        <Title order={4} fw={700}>
          AI Tutor
        </Title>
        <Button component={Link} href="/chat" fullWidth>
          Start a Chat
        </Button>
      </Stack>
      <ChatCard
        to="/chat/1"
        title="What is the largest mamal"
        topic="Biology"
        active
      />
      <ChatCard
        to="/chat/2"
        title="The pavlovian architecture"
        topic="Psychology"
      />
      <ChatCard to="/chat/3" title="Why Hitler is a Nazi" topic="History" />
    </Stack>
  );
}

interface ChatCardProps {
  title: string;
  topic: string;
  to: string;
  active?: boolean;
}

function ChatCard(props: ChatCardProps) {
  return (
    <Button
      component={Link}
      href={props.to}
      fullWidth
      size="lg"
      justify="start"
      px="xs"
      h={60}
      variant={props.active ? "light" : "subtle"}
    >
      <Stack align="start" gap={0} className="w-full">
        <Text fw={500} truncate="end" className="w-full">
          {props.title}
        </Text>
        <Text c="dimmed" size="sm">
          {props.topic}
        </Text>
      </Stack>
    </Button>
  );
}

export default Layout;
