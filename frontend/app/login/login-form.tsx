"use client";
import { postLogin } from "@/lib/client";
import { loginSchema } from "@/schema/auth";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { redirect } from "next/navigation";

import "@/lib/client-init";
import { useToggle } from "@mantine/hooks";
import { ForgotPasswordForm } from "./forget-pass-form";

function LoginForm() {
  const [type, toggle] = useToggle(["login", "forget password"]);

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

  const register = () => {
    redirect("/register");
  };

  return (
    <>
      {type === "forget password" && <ForgotPasswordForm toggle={toggle} />}

      {type === "login" && (
        <Container size="lg">
          <Title ta="center">Welcome back!</Title>

          <Text className="text-center mt-2" c="dimmed" size="sm">
            Do not have an account yet?{" "}
            <Anchor onClick={register}>Create account</Anchor>
          </Text>

          <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
            <form onSubmit={form.onSubmit(login)}>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                radius="md"
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                radius="md"
                {...form.getInputProps("password")}
              />
              <Group justify="space-between" mt="lg">
                <Checkbox label="Remember me" />
                <Anchor component="button" size="sm" onClick={() => toggle()}>
                  Forgot password?
                </Anchor>
              </Group>
              <Button fullWidth mt="xl" radius="md">
                Sign in
              </Button>
            </form>
          </Paper>
        </Container>
      )}
    </>
  );
}

export default LoginForm;
