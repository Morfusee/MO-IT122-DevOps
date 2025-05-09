import { Container } from "@mantine/core";
import LoginForm from "./login-form";

export default async function Login() {
  return (
    <Container size="md" className="h-screen grid place-content-center">
      <LoginForm />
    </Container>
  );
}
