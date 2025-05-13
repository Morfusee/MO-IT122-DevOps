"use client";
import InputArea from "@/components/input-area";
import { createNewChat } from "./chat-list-function";
import { useState } from "react";

function NewChatInput() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (value: string) => {
    setSubmitted(true);
    createNewChat(value);
  };

  return (
    <InputArea
      size="md"
      placeholder="Ask a question"
      minRows={3}
      onSubmit={handleSubmit}
      disabled={submitted}
    />
  );
}

export default NewChatInput;
