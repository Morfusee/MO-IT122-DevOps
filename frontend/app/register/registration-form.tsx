"use client";
import { postRegister } from "@/lib/client";
import { registerSchema } from "@/schema/auth";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { redirect } from "next/navigation";
import { upperFirst, useToggle } from "@mantine/hooks";

import "@/lib/client-init";
import { GoogleButton } from "@/components/google-button";
import { ForgotPasswordForm } from "../login/forget-pass-form";

function RegistrationForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      institution: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(registerSchema),
  });

  const register = async ({
    email,
    password,
    firstName,
    lastName,
    institution,
  }: typeof form.values) => {
    const res = await postRegister({
      body: { email, password, firstName, lastName, institution },
      credentials: "include",
    });

    if (res.response.ok) redirect("/chat");
  };

  const login = () => {
    redirect("/login");
  };


  return (
    <Container>
      <Title ta="center">Welcome back!</Title>

      <Text className="text-center mt-2" c="dimmed" size="sm">
        Already have an account? <Anchor onClick={login}>Login here</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={form.onSubmit(register)}>
          <Group justify="space-between">
            <TextInput
              label="First name"
              placeholder="Your first name"
              required
              radius="md"
            />
            <TextInput
              label="Last name"
              placeholder="Your last name"
              required
              radius="md"
            />
          </Group>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            radius="md"
            mt="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
          />
          {/* <TextInput
            label="Institution"
            placeholder="Your institution"
            required
            mt="md"
          ></TextInput> */}

          <Checkbox label="Remember me" my="lg" />
          <Button fullWidth radius="md" mt="xl">
            Sign in
          </Button>
        </form>
        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group>
      </Paper>
    </Container>
  );
}

export default RegistrationForm;
