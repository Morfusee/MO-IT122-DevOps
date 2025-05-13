import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getChatsByChatIdMessages,
  MessagePair,
  postChatsByChatIdMessages,
} from "../client";
import { getQueryClient } from "@/components/get-query-client";

export const useMessageQuery = (id: string) => {
  const queryClient = getQueryClient();

  const chatLogKey = [id, "messages"];

  const query = useQuery({
    queryKey: chatLogKey,
    queryFn: async () => {
      const data = await getChatsByChatIdMessages({
        path: {
          chat_id: id,
        },
        credentials: "include",
      });
      if (!data.response.ok || !data.data)
        throw new Error("Error retrieving chat messages");
      return data.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const data = await postChatsByChatIdMessages({
        path: {
          chat_id: id,
        },
        body: {
          prompt: prompt,
        },
        credentials: "include",
      });

      if (!data.response.ok || !data.data)
        throw new Error("Error retrieving chat messages");

      return data.data;
    },
    onMutate: async (newPrompt) => {
      await queryClient.cancelQueries({ queryKey: chatLogKey });

      const previousChats = queryClient.getQueryData(chatLogKey);

      queryClient.setQueryData<MessagePair[]>(chatLogKey, (old) => [
        ...(old as MessagePair[]),
        {
          id: "",
          prompt: newPrompt,
          response: [],
        },
      ]);

      return { previousChats };
    },
    onError: (_err, _newPrompt, context) =>
      queryClient.setQueryData(chatLogKey, context?.previousChats),
    onSettled: () => queryClient.invalidateQueries({ queryKey: chatLogKey }),
  });

  return {
    query,
    mutation,
  };
};
