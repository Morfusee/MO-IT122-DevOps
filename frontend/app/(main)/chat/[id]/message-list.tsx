"use client";
import { Group, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { useMessageQuery } from "@/lib/queries/message-query";
import DotsLoading from "@/components/dots-loading";

interface MessageListProps {
  id: string;
}

function MessageList(props: MessageListProps) {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight });
    }
  }, [viewport.current]);

  const {
    query: { isPending, data },
  } = useMessageQuery(props.id);

  return !isPending && data ? (
    <ScrollArea className="w-full flex-1" viewportRef={viewport}>
      {data.map((item) => (
        <React.Fragment key={item.id}>
          <UserMessageBubble content={item.prompt} />
          {item.response.length > 0 ? (
            <LLMMessageBubble content={item.response[0].text} />
          ) : (
            <Group className="w-full max-w-2xl mx-auto mb-18">
              <DotsLoading size={8} />
            </Group>
          )}
        </React.Fragment>
      ))}
    </ScrollArea>
  ) : (
    <div className="w-full flex-1 grid place-items-center">
      <Loader />
    </div>
  );
}

interface UserMessageBubbleProps {
  content: string;
}

function UserMessageBubble(props: UserMessageBubbleProps) {
  return (
    <Group justify="end" className="w-full max-w-2xl mx-auto mb-10">
      <Stack className="px-6 py-3 bg-neutral-300/60 rounded-3xl max-w-2/3">
        <Text>{props.content}</Text>
      </Stack>
    </Group>
  );
}

interface LLMMessageBubbleProps {
  content: string | undefined;
}

function LLMMessageBubble(props: LLMMessageBubbleProps) {
  return (
    <Group className="w-full max-w-2xl mx-auto mb-18">
      <Text className="whitespace-pre-wrap">{props.content}</Text>
    </Group>
  );
}

export default MessageList;
