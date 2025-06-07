"use client";
import InputArea from "@/components/input-area";
import { useMessageQuery } from "@/lib/queries/message-query";

interface MessageInputProps {
  id: string;
}

function MessageInput(props: MessageInputProps) {
  const { mutation } = useMessageQuery(props.id);

  const handleSubmit = (val: string) => {
    mutation.mutate(val);
  };
  return (
    <InputArea
      name="prompt-input"
      size="md"
      placeholder="Ask a question"
      onSubmit={handleSubmit}
      disabled={mutation.isPending}
    />
  );
}

export default MessageInput;
