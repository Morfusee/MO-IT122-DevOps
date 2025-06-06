"use client";
import { postRegister } from "@/lib/client";
import { registerSchema } from "@/schema/auth";
import {
  Anchor,
  Button,
  Container,
  // Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { redirect } from "next/navigation";
import { notifications } from "@mantine/notifications";

// import { GoogleButton } from "@/components/google-button";
// import { ForgotPasswordForm } from "../login/forget-pass-form";

import "@/lib/client-init";
import Link from "next/link";

function RegistrationForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(registerSchema),
  });

  const register = async ({
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
  }: typeof form.values) => {
    if (password !== confirmPassword) {
      notifications.show({
        title: "Confirm Password",
        message: "Password is not the same as the confirmed password",
        autoClose: 3000,
        color: "red",
      });
      return;
    }

    const res = await postRegister({
      body: { email, password, firstName, lastName },
      credentials: "include",
    });

    if (!res.response.ok) {
      notifications.show({
        title: "Error logging in",
        message: "The email or password is incorrect",
        autoClose: 3000,
        color: "red",
      });

      return;
    }

    redirect("/login");
  };

  return (
    <Container>
      <Title ta="center">Join now!</Title>

      <Text className="text-center mt-2" c="dimmed" size="sm">
        Already have an account?{" "}
        <Anchor component={Link} href="/login">
          Login here
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={form.onSubmit(register)}>
          <Group justify="space-between">
            <TextInput
              name="fname"
              label="First name"
              placeholder="Your first name"
              required
              radius="md"
              {...form.getInputProps("firstName")}
            />
            <TextInput
              name="lname"
              label="Last name"
              placeholder="Your last name"
              required
              radius="md"
              {...form.getInputProps("lastName")}
            />
          </Group>
          <TextInput
            name="email"
            label="Email"
            placeholder="you@example.com"
            required
            radius="md"
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            name="cpassword"
            label="Confirm password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            {...form.getInputProps("confirmPassword")}
          />
          {/* <TextInput
            label="Institution"
            placeholder="Your institution"
            required
            mt="md"
          ></TextInput> */}

          <Button
            type="submit"
            fullWidth
            mt="xl"
            radius="md"
            loading={form.submitting}
          >
            Sign up
          </Button>
        </form>
        {/* <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group> */}
      </Paper>
    </Container>
  );
}

export default RegistrationForm;
