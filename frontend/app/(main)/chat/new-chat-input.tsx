"use client";
import InputArea from "@/components/input-area";

function NewChatInput() {
  const handleSubmit = () => {};
  return (
    <InputArea
      size="md"
      placeholder="Ask a question"
      minRows={3}
      onSubmit={handleSubmit}
    />
  );
}

export default NewChatInput;
