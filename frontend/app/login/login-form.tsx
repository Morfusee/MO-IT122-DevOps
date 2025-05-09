"use client";
import { postLogin } from "@/lib/client";
import { loginSchema } from "@/schema/auth";
import { Button, Card, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { redirect } from "next/navigation";

import "../../lib/client-init";

function LoginForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const login = async ({ email, password }: typeof form.values) => {
    const res = await postLogin({
      body: { email, password },
      credentials: "include",
    });

    if (res.response.ok) redirect("/chat");
  };

  return (
    <Card className="w-xs" shadow="md" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(login)}>
        <Stack gap="md" align="center">
          <Title order={2}>Login</Title>
          <TextInput
            className="w-full"
            label="Email"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <TextInput
            className="w-full"
            label="Password"
            type="password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Button fullWidth type="submit" loading={form.submitting}>
            Login
          </Button>
        </Stack>
      </form>
    </Card>
  );
}

export default LoginForm;
