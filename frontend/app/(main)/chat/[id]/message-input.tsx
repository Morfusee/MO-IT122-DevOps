"use client";
import InputArea from "@/components/input-area";

function MessageInput() {
  const handleSubmit = () => {};
  return (
    <InputArea size="md" placeholder="Ask a question" onSubmit={handleSubmit} />
  );
}

export default MessageInput;
