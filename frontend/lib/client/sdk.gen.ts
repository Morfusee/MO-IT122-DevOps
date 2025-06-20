// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-next';
import type { GetUsersData, GetUsersResponse, PostUsersData, PostPromptData, PostPromptResponse, PostRegisterData, PostRegisterResponse, PostRegisterError, PostLoginData, PostLoginResponse, PostLoginError, PostLogoutData, PostLogoutResponse, GetMeData, GetMeResponse, GetMeError, GetChatsData, GetChatsResponse, PostChatsData, PostChatsResponse, PostChatsError, DeleteChatsByIdData, DeleteChatsByIdResponse, DeleteChatsByIdError, GetChatsByIdData, GetChatsByIdResponse, GetChatsByIdError, PatchChatsByIdData, PatchChatsByIdResponse, PatchChatsByIdError, PutChatsByIdData, PutChatsByIdResponse, PutChatsByIdError, GetChatsByChatIdMessagesData, GetChatsByChatIdMessagesResponse, GetChatsByChatIdMessagesError, PostChatsByChatIdMessagesData, PostChatsByChatIdMessagesResponse, PostChatsByChatIdMessagesError } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

export const getUsers = <ThrowOnError extends boolean = false>(options?: Options<GetUsersData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetUsersResponse, unknown, ThrowOnError>({
        url: '/users',
        ...options
    });
};

export const postUsers = <ThrowOnError extends boolean = false>(options?: Options<PostUsersData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<unknown, unknown, ThrowOnError>({
        url: '/users',
        ...options
    });
};

export const postPrompt = <ThrowOnError extends boolean = false>(options?: Options<PostPromptData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostPromptResponse, unknown, ThrowOnError>({
        url: '/prompt',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postRegister = <ThrowOnError extends boolean = false>(options?: Options<PostRegisterData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostRegisterResponse, PostRegisterError, ThrowOnError>({
        url: '/register',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postLogin = <ThrowOnError extends boolean = false>(options?: Options<PostLoginData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostLoginResponse, PostLoginError, ThrowOnError>({
        url: '/login',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const postLogout = <ThrowOnError extends boolean = false>(options?: Options<PostLogoutData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostLogoutResponse, unknown, ThrowOnError>({
        url: '/logout',
        ...options
    });
};

export const getMe = <ThrowOnError extends boolean = false>(options?: Options<GetMeData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetMeResponse, GetMeError, ThrowOnError>({
        url: '/me',
        ...options
    });
};

export const getChats = <ThrowOnError extends boolean = false>(options?: Options<GetChatsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetChatsResponse, unknown, ThrowOnError>({
        url: '/chats',
        ...options
    });
};

export const postChats = <ThrowOnError extends boolean = false>(options?: Options<PostChatsData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).post<PostChatsResponse, PostChatsError, ThrowOnError>({
        url: '/chats',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const deleteChatsById = <ThrowOnError extends boolean = false>(options?: Options<DeleteChatsByIdData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).delete<DeleteChatsByIdResponse, DeleteChatsByIdError, ThrowOnError>({
        url: '/chats/{id}',
        ...options
    });
};

export const getChatsById = <ThrowOnError extends boolean = false>(options?: Options<GetChatsByIdData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetChatsByIdResponse, GetChatsByIdError, ThrowOnError>({
        url: '/chats/{id}',
        ...options
    });
};

export const patchChatsById = <ThrowOnError extends boolean = false>(options?: Options<PatchChatsByIdData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).patch<PatchChatsByIdResponse, PatchChatsByIdError, ThrowOnError>({
        url: '/chats/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const putChatsById = <ThrowOnError extends boolean = false>(options?: Options<PutChatsByIdData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).put<PutChatsByIdResponse, PutChatsByIdError, ThrowOnError>({
        url: '/chats/{id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

export const getChatsByChatIdMessages = <ThrowOnError extends boolean = false>(options: Options<GetChatsByChatIdMessagesData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetChatsByChatIdMessagesResponse, GetChatsByChatIdMessagesError, ThrowOnError>({
        url: '/chats/{chat_id}/messages',
        ...options
    });
};

export const postChatsByChatIdMessages = <ThrowOnError extends boolean = false>(options: Options<PostChatsByChatIdMessagesData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<PostChatsByChatIdMessagesResponse, PostChatsByChatIdMessagesError, ThrowOnError>({
        url: '/chats/{chat_id}/messages',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};