"use client";
import { Chat } from "@/lib/client";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Stack,
  Text,
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface ChatListProps {
  list: Chat[];
}

function ChatList(props: ChatListProps) {
  const pathname = usePathname();
  const activePath = pathname.split("/").filter(Boolean)[1];

  return props.list.map((item) => (
    <ChatCard
      key={item.id}
      to={`/chat/${item.id}`}
      title={item.name}
      topic={item.topic}
      active={item.id == activePath}
    />
  ));
}

interface ChatCardProps {
  title: string;
  topic: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

function ChatCard(props: ChatCardProps) {
  const [hovered, setHovered] = useState(false);

  const handleRename = () => {};

  const handleDelete = () => {};

  return (
    <Group
      className={`w-full rounded-sm pr-2 hover:bg-neutral-200 ${
        props.active || hovered ? "bg-neutral-200" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={props.onClick}
    >
      <Button
        component={Link}
        href={props.to}
        size="lg"
        justify="start"
        px="xs"
        h={60}
        variant="transparent"
        className="flex-1"
      >
        <Stack align="start" gap={0} className="w-full">
          <Text fw={500} truncate="end" className="w-full">
            {props.title}
          </Text>
          <Text c="dimmed" size="sm" className="capitalize">
            {props.topic}
          </Text>
        </Stack>
      </Button>

      {hovered ? (
        <Menu position="bottom-start" width={140}>
          <MenuTarget>
            <ActionIcon variant="light" size="sm" radius="xl">
              <IconDots />
            </ActionIcon>
          </MenuTarget>

          <MenuDropdown>
            <MenuItem
              leftSection={<IconEdit size={18} />}
              onClick={() => handleRename()}
            >
              Rename
            </MenuItem>
            <MenuItem
              color="red"
              leftSection={<IconTrash size={18} />}
              onClick={() => handleDelete()}
            >
              Delete
            </MenuItem>
          </MenuDropdown>
        </Menu>
      ) : null}
    </Group>
  );
}

export default ChatList;
