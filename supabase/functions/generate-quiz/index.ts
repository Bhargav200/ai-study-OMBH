import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a quiz question generator for students. Generate multiple-choice questions.

IMPORTANT: You MUST respond by calling the generate_quiz function. Do not respond with plain text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, subject, count = 5, topicId } = await req.json();
    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
          { role: "user", content: `Generate ${count} multiple-choice questions about "${topic}" in ${subject || "general"}. Each question should have 4 options with exactly one correct answer. Vary difficulty from easy to hard.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_quiz",
            description: "Return quiz questions as structured data",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                      correct: { type: "integer", description: "Index of the correct option (0-3)" },
                      explanation: { type: "string", description: "Brief explanation of why the answer is correct" },
                    },
                    required: ["question", "options", "correct", "explanation"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["questions"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_quiz" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No quiz generated");

    const quiz = JSON.parse(toolCall.function.arguments);

    // Persist quiz to DB
    let quizId: string | null = null;
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: quizRow } = await supabase
        .from("quizzes")
        .insert({ topic_id: topicId || null, generated_by_ai: true })
        .select("id")
        .single();

      quizId = quizRow?.id;

      if (quizId && quiz.questions) {
        const rows = quiz.questions.map((q: any) => ({
          quiz_id: quizId,
          question_text: q.question,
          options: q.options,
          correct_answer: String(q.correct),
          explanation: q.explanation || "",
        }));
        await supabase.from("quiz_questions").insert(rows);
      }

      // Log AI usage
      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          await supabase.from("ai_usage_logs").insert({
            user_id: user.id,
            feature_type: "quiz",
            model_name: "google/gemini-3-flash-preview",
            request_status: "success",
          });
        }
      }
    } catch (e) {
      console.error("Error persisting quiz:", e);
    }

    return new Response(JSON.stringify({ ...quiz, quizId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-quiz error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
