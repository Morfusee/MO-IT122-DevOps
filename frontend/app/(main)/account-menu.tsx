"use client";
import { postLogout, User } from "@/lib/client";
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Stack,
  Text,
} from "@mantine/core";
import { redirect } from "next/navigation";

import "@/lib/client-init";

interface AccountMenuProps {
  user: User | undefined;
}

function AccountMenu(props: AccountMenuProps) {
  const logout = async () => {
    const res = await postLogout({ credentials: "include" });
    if (res.response.ok) redirect("/login");
  };

  return (
    <Popover position="right-end">
      <PopoverTarget>
        <ActionIcon variant="transparent" radius="xl" size="lg">
          <Avatar />
        </ActionIcon>
      </PopoverTarget>

      <PopoverDropdown>
        <Stack align="center" gap={8} className="min-w-54">
          <Group className="w-full py-2">
            <Avatar size="md" />
            <Stack gap={0}>
              <Text size="lg">{`${props.user?.firstName} ${props.user?.lastName}`}</Text>
              <Text size="sm" c="dimmed">
                {props.user?.email}
              </Text>
            </Stack>
          </Group>
          <Button variant="outline" fullWidth onClick={() => {}}>
            Settings
          </Button>
          <Button fullWidth onClick={() => logout()}>
            Log out
          </Button>
        </Stack>
      </PopoverDropdown>
    </Popover>
  );
}

export default AccountMenu;
