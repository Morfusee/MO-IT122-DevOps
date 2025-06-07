"use client";
import { Group, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { useMessageQuery } from "@/lib/queries/message-query";
import DotsLoading from "@/components/dots-loading";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageListProps {
  id: string;
}

function MessageList(props: MessageListProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const previousChatId = useRef<string | null>(null);

  const {
    query: { isPending, data },
  } = useMessageQuery(props.id);

  useEffect(() => {
    if (viewport.current) {
      const behavior =
        previousChatId.current === props.id ? "smooth" : "instant";

      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior,
      });

      previousChatId.current = props.id;
    }
  }, [data, props.id]);

  const isResponse = (json: unknown): json is { response: string } => {
    console.log(json);
    return (
      typeof json === "object" &&
      json !== null &&
      "response" in json &&
      typeof (json as any).response === "string"
    );
  };

  return !isPending && data ? (
    <ScrollArea
      className="w-full flex-1"
      viewportRef={viewport}
      data-name="message-history"
    >
      {data.map((item) => (
        <React.Fragment key={item.id}>
          <UserMessageBubble content={item.prompt} />
          {item.json_response ? (
            isResponse(item.json_response) ? (
              <LLMMessageBubble content={item.json_response.response} />
            ) : (
              <div>An error as occured</div>
            )
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
    <Group
      justify="end"
      className="w-full max-w-2xl mx-auto mb-10"
      data-name="user-message"
    >
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
    <Group
      className="markdown w-full max-w-2xl mx-auto mb-18"
      data-name="llm-message"
    >
      <Markdown remarkPlugins={[remarkGfm]}>{props.content}</Markdown>
    </Group>
  );
}

export default MessageList;
