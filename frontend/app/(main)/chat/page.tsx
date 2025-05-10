import { getMe } from "@/lib/client";
import { Stack, Title } from "@mantine/core";
import { cookies } from "next/headers";
import NewChatInput from "./new-chat-input";

import "@/lib/client-init";

async function Page() {
  const userDetails = await getMe({
    credentials: "include",
    headers: { Cookie: (await cookies()).toString() },
  });

  const userName = `${userDetails.data?.firstName} ${userDetails.data?.lastName}`;

  return (
    <Stack justify="center" align="center" className="w-full h-full">
      <Stack align="center" gap="xl" className="w-full max-w-2xl">
        <Stack gap={0}>
          <Title order={2} className="text-center">
            Hello {userName},
          </Title>
          <Title order={2} className="text-center">
            ready for a tutoring session?
          </Title>
        </Stack>
        <NewChatInput />
      </Stack>
    </Stack>
  );
}

export default Page;
