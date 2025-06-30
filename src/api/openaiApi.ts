import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ChatResponse {
  assistant: string;
}

interface ChatRequest {
  message: string;
}

export const openaiApi = createApi({
  reducerPath: "openaiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.openai.com/v1/",
    prepareHeaders: (headers) => {
      const key = process.env.OPENAI_API_KEY;
      if (key) headers.set("Authorization", `Bearer ${key}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    chatCompletion: builder.mutation<ChatResponse, ChatRequest>({
      query: ({ message }) => ({
        url: "chat/completions",
        method: "POST",
        body: {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
          temperature: 0.7,
        },
      }),
      transformResponse: (response: any): ChatResponse => ({
        assistant:
          response.choices?.[0]?.message?.content?.trim() ??
          "(No response)",
      }),
    }),
  }),
});

export const { useChatCompletionMutation } = openaiApi;
