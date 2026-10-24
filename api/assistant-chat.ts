/// <reference types="node" />

import { pipeTextStreamToResponse, streamText, toTextStream } from "ai";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { ModelMessage } from "ai";

type ApiRequest = IncomingMessage & { body?: unknown };
type ApiResponse = ServerResponse;
type ClientMessage = { role: "user" | "assistant"; content: string };

const maxMessages = 12;
const maxMessageLength = 4_000;

function parseBody(body: unknown): unknown {
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return null;
  }
}

function readMessages(body: unknown): ClientMessage[] | null {
  if (
    !body ||
    typeof body !== "object" ||
    !("messages" in body) ||
    !Array.isArray(body.messages)
  ) {
    return null;
  }

  const rawMessages = body.messages;
  if (rawMessages.length === 0 || rawMessages.length > maxMessages) return null;

  const messages: ClientMessage[] = [];
  for (const item of rawMessages) {
    if (
      !item ||
      typeof item !== "object" ||
      !("role" in item) ||
      !("content" in item)
    ) {
      return null;
    }

    const role = item.role;
    const content = item.content;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    )
      return null;
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0 || trimmedContent.length > maxMessageLength)
      return null;
    messages.push({ role, content: trimmedContent });
  }

  return messages.at(-1)?.role === "user" ? messages : null;
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
): Promise<void> {
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.setHeader("Allow", "POST");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: "Use POST to send a chat message." }));
    return;
  }

  const messages = readMessages(parseBody(request.body));
  if (!messages) {
    response.statusCode = 400;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(
      JSON.stringify({ error: "Please send a valid message and try again." }),
    );
    return;
  }

  const modelMessages: ModelMessage[] = messages.map(({ role, content }) => ({
    role,
    content,
  }));
  const result = streamText({
    model: "openai/gpt-6.1-sol-fast",
    instructions: [
      "You are the intelligent, friendly AI assistant for Elite Pro Services, an agency founded by Imran Chatouan in Tangier, Morocco.",
      "Answer questions across all ordinary topics: general knowledge, science, programming, coding, technology, history, sports, daily life, and anything else the user asks. Do not redirect unrelated questions to agency services.",
      "Match the language and tone of the user. If they write Moroccan Darija, answer naturally in fluent Moroccan Darija. If they write English, answer in English. If they write Arabic, respond in the appropriate Arabic style and adapt to Darija when the user uses it. Match French, Spanish, German, and other languages as appropriate.",
      "Be clear, useful, accurate, and as comprehensive as the question needs. Explain technical ideas accessibly and format code clearly. If a fact is uncertain or may have changed, say so instead of inventing an answer.",
      "Represent Elite Pro Services warmly, but mention the agency only when it is relevant or the user asks about it. Do not invent agency pricing, policies, or capabilities.",
      "Follow applicable safety guidance. Do not claim to browse the web or know live information unless it is provided in the conversation.",
    ].join("\n"),
    messages: modelMessages,
    maxOutputTokens: 900,
    onError({ error }) {
      console.error(
        "[assistant-chat] Model stream failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
    },
  });

  response.setHeader("Cache-Control", "no-store");
  await pipeTextStreamToResponse({
    response,
    stream: toTextStream({ stream: result.stream }),
  });
}
