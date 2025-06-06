import React from "react";
import InputArea from "../../components/input-area";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "../../app/globals.css";

describe("<InputArea />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <MantineProvider>
        <InputArea />
      </MantineProvider>
    );
  });

  it("types", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <MantineProvider>
        <InputArea />
      </MantineProvider>
    );

    cy.get("textarea.mantine-Textarea-input").type("Test Type");
  });

  it("loads", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <MantineProvider>
        <InputArea loading={true} />
      </MantineProvider>
    );

    cy.get('[data-name="input-area"]').contains("Loading...");
  });
});
