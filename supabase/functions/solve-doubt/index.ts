import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert academic tutor helping students understand concepts clearly. When a student asks a doubt:

1. Provide a clear, step-by-step solution
2. Include a worked example when applicable
3. Highlight the key concept or insight
4. Use simple language appropriate for high school / early college students
5. Use markdown formatting: **bold** for emphasis, \`code\` for math expressions, numbered lists for steps

Structure your response as:
## Step-by-Step Solution
(numbered steps)

## Example
(a worked example)

## 💡 Key Concept
(the core insight in 1-2 sentences)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, sessionId } = await req.json();
    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Get user from auth header for persistence
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    let supabase: any = null;

    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      supabase = createClient(supabaseUrl, supabaseKey);

      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id ?? null;
    }

    // Create or reuse doubt session
    let doubtSessionId = sessionId;
    if (userId && supabase && !doubtSessionId) {
      const { data: session } = await supabase
        .from("doubt_sessions")
        .insert({ user_id: userId, question_preview: question.slice(0, 200) })
        .select("id")
        .single();
      doubtSessionId = session?.id;

      // Save user message
      if (doubtSessionId) {
        await supabase.from("doubt_messages").insert({
          doubt_session_id: doubtSessionId,
          role: "user",
          message_text: question,
        });
      }
    }

    // Call AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tee the stream: one for client, one to collect full response for saving
    const [clientStream, saveStream] = response.body!.tee();

    // Save assistant response in background
    if (userId && supabase && doubtSessionId) {
      (async () => {
        try {
          const reader = saveStream.getReader();
          const decoder = new TextDecoder();
          let fullResponse = "";
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let nl: number;
            while ((nl = buffer.indexOf("\n")) !== -1) {
              let line = buffer.slice(0, nl);
              buffer = buffer.slice(nl + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;
              const json = line.slice(6).trim();
              if (json === "[DONE]") break;
              try {
                const parsed = JSON.parse(json);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullResponse += content;
              } catch {}
            }
          }

          if (fullResponse) {
            await supabase.from("doubt_messages").insert({
              doubt_session_id: doubtSessionId,
              role: "assistant",
              message_text: fullResponse,
            });
          }

          // Log AI usage
          await supabase.from("ai_usage_logs").insert({
            user_id: userId,
            feature_type: "doubt",
            model_name: "google/gemini-3-flash-preview",
            request_status: "success",
          });
        } catch (e) {
          console.error("Error saving doubt response:", e);
        }
      })();
    }

    // Return session ID in header so client can reference it
    return new Response(clientStream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Doubt-Session-Id": doubtSessionId || "",
      },
    });
  } catch (e) {
    console.error("solve-doubt error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
