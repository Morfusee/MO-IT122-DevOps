"use client";
import { ActionIcon, Stack, Tooltip } from "@mantine/core";
import {
  Icon,
  IconClipboardText,
  IconClipboardTextFilled,
  IconMessage,
  IconMessageFilled,
  IconProps,
  IconSquareCheck,
  IconSquareCheckFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

function SidebarNav() {
  const pathname = usePathname();
  const activePath = pathname.split("/").filter(Boolean)[0];

  return (
    <Stack gap="xl">
      <NavButton
        to="/chat"
        label="Chat"
        IconActive={IconMessageFilled}
        IconInactive={IconMessage}
        active={activePath == "chat"}
      />
      <NavButton
        to="/quiz"
        label="Quiz"
        IconActive={IconSquareCheckFilled}
        IconInactive={IconSquareCheck}
        active={activePath == "quiz"}
      />
      <NavButton
        to="/reviewer"
        label="Reviewer"
        IconActive={IconClipboardTextFilled}
        IconInactive={IconClipboardText}
        active={activePath == "reviewer"}
      />
    </Stack>
  );
}

interface NavButtonProps {
  to: string;
  label: string;
  IconActive: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  IconInactive: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  active: boolean;
}

function NavButton(props: NavButtonProps) {
  const Icon = props.active ? props.IconActive : props.IconInactive;

  return (
    <Tooltip label={props.label} position="right">
      <ActionIcon
        component={Link}
        href={props.to}
        variant="subtle"
        color="dark"
        size="xl"
      >
        <Icon size={28} />
      </ActionIcon>
    </Tooltip>
  );
}

export default SidebarNav;
