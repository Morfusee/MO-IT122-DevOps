"use client";
import { Chat, deleteChatsById } from "@/lib/client";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { deleteChat } from "./delete-chat-function";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { editChatTitle } from "./edit-chat-function";

interface ChatListProps {
  list: Chat[];
}

function ChatList(props: ChatListProps) {
  const pathname = usePathname();
  const activePath = pathname.split("/").filter(Boolean)[1];

  return (
    <>
      {props.list.map((item) => (
        <ChatCard
          key={item.id}
          to={`/chat/${item.id}`}
          id={item.id}
          title={item.name}
          topic={item.topic}
          active={item.id == activePath}
        />
      ))}
    </>
  );
}

interface ChatCardProps {
  id: string | undefined;
  title: string;
  topic: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

function ChatCard(props: ChatCardProps) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const [isDropdownOpen, dropdownState] = useDisclosure(false);
  const [isEditModalOpen, editModalState] = useDisclosure(false);
  const [isDeleteModalOpen, deleteModalState] = useDisclosure(false);

  const handleEditClick = (chatId: string | undefined) => {
    if (!chatId) return;
    editModalState.open();
  };

  const handleDeleteClick = (chatId: string | undefined) => {
    if (!chatId) return;
    deleteModalState.open();
  };

  const onChatDelete = async (chatId: string | undefined) => {
    if (!chatId) return;
    deleteChat(chatId, pathname);
  };

  return (
    <>
      <Group
        className={`w-full rounded-sm pr-2 hover:bg-neutral-200 ${
          props.active || hovered ? "bg-neutral-200" : ""
        }`}
        onMouseEnter={() => {
          if (!isDropdownOpen) {
            setHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!isDropdownOpen) {
            setHovered(false);
          }
        }}
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
          data-name="chat-history-item"
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
          <Menu
            position="bottom-start"
            width={140}
            opened={isDropdownOpen}
            onOpen={dropdownState.open}
            onClose={() => {
              dropdownState.close();
              setHovered(false);
            }}
          >
            <MenuTarget>
              <ActionIcon
                variant="light"
                size="sm"
                radius="xl"
                data-name="chat-item-menu-trigger"
              >
                <IconDots />
              </ActionIcon>
            </MenuTarget>

            <MenuDropdown>
              <MenuItem
                leftSection={<IconEdit size={18} />}
                onClick={() => handleEditClick(props.id)}
                data-name="menu-rename-button"
              >
                Rename
              </MenuItem>
              <MenuItem
                color="red"
                leftSection={<IconTrash size={18} />}
                onClick={() => handleDeleteClick(props.id)}
                data-name="menu-delete-button"
              >
                Delete
              </MenuItem>
            </MenuDropdown>
          </Menu>
        ) : null}
      </Group>
      <EditTitleModal
        id={props.id}
        title={props.title}
        opened={isEditModalOpen}
        onClose={editModalState.close}
      />
      <DeleteConfirmModal
        opened={isDeleteModalOpen}
        onClose={deleteModalState.close}
        onConfirm={() => onChatDelete(props.id)}
      />
    </>
  );
}

interface EditTitleModalProps {
  id: string | undefined;
  title: string;
  opened: boolean;
  onClose: () => void;
}

function EditTitleModal(props: EditTitleModalProps) {
  return (
    <>
      <Modal
        opened={props.opened}
        onClose={props.onClose}
        title="Edit chat title"
      >
        <EditModalForm
          id={props.id}
          title={props.title}
          onClose={props.onClose}
        />
      </Modal>
    </>
  );
}

interface EditModalFormProps {
  id: string | undefined;
  title: string;
  onClose: () => void;
}

function EditModalForm(props: EditModalFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: props.title,
    },
    validate: zodResolver(
      z.object({
        title: z.string().trim().min(1, { message: "Title is required" }),
      })
    ),
  });

  const onEditTitle = async ({ title }: typeof form.values) => {
    if (!props.id) return;
    editChatTitle(props.id, title);
    props.onClose();
  };
  return (
    <form onSubmit={form.onSubmit(onEditTitle)}>
      <TextInput
        radius="md"
        data-name="rename-input"
        {...form.getInputProps("title")}
      />
      <Group mt="lg" justify="flex-end">
        <Button onClick={props.onClose} variant="default">
          Cancel
        </Button>
        <Button type="submit">Edit</Button>
      </Group>
    </form>
  );
}

interface DeleteConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal(props: DeleteConfirmModalProps) {
  return (
    <>
      <Modal
        opened={props.opened}
        onClose={props.onClose}
        title="Delete this chat?"
      >
        <Text>
          Are you sure you want to delete this page? This action cannot be
          undone.
        </Text>
        <Group mt="lg" justify="flex-end">
          <Button onClick={props.onClose} variant="default">
            Cancel
          </Button>
          <Button onClick={props.onConfirm} color="red">
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default ChatList;
