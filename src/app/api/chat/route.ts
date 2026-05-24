import { CursorAgentError } from "@cursor/sdk";
import { sendMessage } from "@/lib/cursor-agent";
import { buildUserMessage } from "@/lib/agent-prompt";
import { isCursorApiKeyConfigured } from "@/lib/cursor-config";
import { streamDemoResponse } from "@/lib/demo-agent";
import type { ChatStreamEvent } from "@/types/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sse(data: ChatStreamEvent): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function demoStream(message: string): ReadableStream<Uint8Array> {
  const demoAgentId = "demo-local-agent";

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const push = (event: ChatStreamEvent) => {
        controller.enqueue(encoder.encode(sse(event)));
      };

      push({ type: "agentId", agentId: demoAgentId });

      try {
        let accumulated = "";
        for await (const chunk of streamDemoResponse(message)) {
          accumulated += chunk;
          push({ type: "text", text: chunk });
        }
        push({ type: "done", status: "finished", result: accumulated });
      } catch (err) {
        push({
          type: "error",
          message: err instanceof Error ? err.message : "Demo stream error",
        });
      } finally {
        controller.close();
      }
    },
  });
}

export async function POST(req: Request) {
  let body: { message?: string; agentId?: string };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  if (!isCursorApiKeyConfigured()) {
    return new Response(demoStream(message), {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  try {
    const { agentId, run } = await sendMessage(body.agentId, buildUserMessage(message));

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const push = (event: ChatStreamEvent) => {
          controller.enqueue(encoder.encode(sse(event)));
        };

        push({ type: "agentId", agentId });

        try {
          for await (const event of run.stream()) {
            if (event.type === "assistant") {
              for (const block of event.message.content) {
                if (block.type === "text" && block.text) {
                  push({ type: "text", text: block.text });
                }
              }
            } else if (event.type === "thinking" && event.text) {
              push({ type: "thinking", text: event.text });
            }
          }

          const result = await run.wait();
          push({
            type: "done",
            status: result.status,
            result: result.result,
          });
        } catch (err) {
          push({
            type: "error",
            message: err instanceof Error ? err.message : "Stream error",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    if (err instanceof CursorAgentError) {
      return new Response(demoStream(message), {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: errMessage }, { status: 500 });
  }
}
