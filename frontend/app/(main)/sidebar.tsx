"use client";
import { postLogout } from "@/lib/client";
import {
  ActionIcon,
  Avatar,
  Button,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import {
  Icon,
  IconBrain,
  IconClipboardText,
  IconClipboardTextFilled,
  IconMessage,
  IconMessageFilled,
  IconProps,
  IconSquareCheck,
  IconSquareCheckFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import "../../lib/client-init";

function Sidebar() {
  const pathname = usePathname();
  const activePath = pathname.split("/").filter(Boolean)[0];

  return (
    <Stack
      justify="space-between"
      align="center"
      className="py-10 border-r border-neutral-300"
    >
      <Stack gap={0} align="center">
        <IconBrain size={38} />
        {/* <Text size="xs" fw="bold">
          Brain
        </Text>
        <Text size="xs" fw="bold">
          Bytes
        </Text> */}
      </Stack>
      <Stack gap="xl">
        <NavButton
          to="/chat"
          IconActive={IconMessageFilled}
          IconInactive={IconMessage}
          active={activePath == "chat"}
        />
        <NavButton
          to="/quiz"
          IconActive={IconSquareCheckFilled}
          IconInactive={IconSquareCheck}
          active={activePath == "quiz"}
        />
        <NavButton
          to="/reviewer"
          IconActive={IconClipboardTextFilled}
          IconInactive={IconClipboardText}
          active={activePath == "reviewer"}
        />
      </Stack>

      <AccountMenu />
    </Stack>
  );
}

interface NavButtonProps {
  to: string;
  IconActive: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  IconInactive: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  active: boolean;
}

function NavButton(props: NavButtonProps) {
  const Icon = props.active ? props.IconActive : props.IconInactive;

  return (
    <ActionIcon
      component={Link}
      href={props.to}
      variant="subtle"
      color="dark"
      size="xl"
    >
      <Icon size={34} />
    </ActionIcon>
  );
}

function AccountMenu() {
  const logout = async () => {
    const res = await postLogout({ credentials: "include" });
    if (res.response.ok) redirect("/login");
  };

  return (
    <Popover position="right-end">
      <Popover.Target>
        <ActionIcon variant="transparent" radius="xl" size="lg">
          <Avatar />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack align="center" className="w-48">
          <Avatar size="lg" />
          <Text size="xl">Hat Doggy</Text>
          <Button fullWidth onClick={() => logout()}>
            Log out
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default Sidebar;
