import { Container } from "@mantine/core";
import RegistrationForm from "./registration-form";

export default async function Register() {
  return (
    <Container size="880" className="h-screen grid place-content-center">
      <RegistrationForm />
    </Container>
  );
}
