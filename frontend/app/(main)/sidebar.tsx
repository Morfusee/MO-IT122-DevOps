import { Stack } from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";
import SidebarNav from "./sidebar-nav";
import AccountMenu from "./account-menu";
import { getMe } from "@/lib/client";
import { cookies } from "next/headers";

import "@/lib/server-init";

async function Sidebar() {
  const userDetails = await getMe({
    credentials: "include",
    headers: { Cookie: (await cookies()).toString() },
  });

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
      {/* <SidebarNav /> */}

      <AccountMenu user={userDetails.data} />
    </Stack>
  );
}

export default Sidebar;
