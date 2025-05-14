import { Container } from "@mantine/core";
import LoginForm from "./login-form";
import { useToggle } from "@mantine/hooks";
import { ForgotPasswordForm } from "./forget-pass-form";

export default async function Login() {
  return (
    <Container size="xl" className="h-screen grid place-content-center">
      <LoginForm />
    </Container>
  );
}
