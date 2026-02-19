import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { materialId, question } = await req.json();
    if (!materialId || !question) {
      return new Response(JSON.stringify({ error: "materialId and question are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get material text
    const { data: material } = await supabase
      .from("materials")
      .select("extracted_text, file_name")
      .eq("id", materialId)
      .single();

    if (!material?.extracted_text) {
      return new Response(JSON.stringify({ error: "Material has no extracted text yet" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Also get chunks for context
    const { data: chunks } = await supabase
      .from("material_chunks")
      .select("chunk_text")
      .eq("material_id", materialId)
      .order("chunk_index")
      .limit(10);

    const context = chunks?.map((c) => c.chunk_text).join("\n\n") || material.extracted_text.slice(0, 8000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI tutor. The student has uploaded a document titled "${material.file_name}". Use the following document content to answer their question accurately. If the answer isn't in the document, say so.

When relevant, proactively recommend YouTube playlists or channels that could help the student learn the topic better. Format YouTube recommendations like:
📺 **Recommended YouTube Resources:**
- [Channel/Playlist Name](https://youtube.com/...) — Brief description of why it's helpful

Only suggest real, well-known educational channels (e.g., Khan Academy, 3Blue1Brown, Organic Chemistry Tutor, CrashCourse, Professor Leonard, MIT OpenCourseWare, etc.) that match the subject matter.

Document content:\n${context}`,
          },
          { role: "user", content: question },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    // Log usage
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        await supabase.from("ai_usage_logs").insert({
          user_id: user.id,
          feature_type: "material",
          model_name: "google/gemini-3-flash-preview",
          request_status: "success",
        });
      }
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("query-material error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
