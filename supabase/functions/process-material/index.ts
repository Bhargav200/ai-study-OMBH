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
    const { materialId } = await req.json();
    if (!materialId) {
      return new Response(JSON.stringify({ error: "materialId is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get material
    const { data: material } = await supabase
      .from("materials")
      .select("*")
      .eq("id", materialId)
      .single();

    if (!material) {
      return new Response(JSON.stringify({ error: "Material not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download file from storage
    const { data: fileData } = await supabase.storage
      .from("materials")
      .download(material.storage_path);

    if (!fileData) {
      await supabase.from("materials").update({ processing_status: "error" }).eq("id", materialId);
      return new Response(JSON.stringify({ error: "Could not download file" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract text (simple text extraction for txt/text files)
    let extractedText = "";
    const ct = material.content_type || "";

    if (ct.includes("text") || material.file_name.endsWith(".txt") || material.file_name.endsWith(".md")) {
      extractedText = await fileData.text();
    } else {
      // For PDF/DOCX, use AI to extract/summarize
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

      // Convert to base64 for multimodal processing
      const bytes = await fileData.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));

      // Use Gemini for document understanding
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Extract all text content from this document. Preserve headings, paragraphs, and structure. Output as clean markdown." },
                { type: "image_url", image_url: { url: `data:${ct || "application/pdf"};base64,${base64}` } },
              ],
            },
          ],
        }),
      });

      if (aiResp.ok) {
        const aiData = await aiResp.json();
        extractedText = aiData.choices?.[0]?.message?.content || "Could not extract text from this document.";
      } else {
        extractedText = "Document uploaded but text extraction failed. You can still ask questions about it.";
      }
    }

    // Chunk text (simple: split by ~1000 chars at paragraph boundaries)
    const chunks: string[] = [];
    const paragraphs = extractedText.split(/\n\n+/);
    let current = "";
    for (const p of paragraphs) {
      if ((current + p).length > 1000 && current) {
        chunks.push(current.trim());
        current = p;
      } else {
        current += (current ? "\n\n" : "") + p;
      }
    }
    if (current.trim()) chunks.push(current.trim());

    // Save extracted text + chunks
    await supabase.from("materials").update({
      extracted_text: extractedText.slice(0, 50000),
      processing_status: "ready",
    }).eq("id", materialId);

    if (chunks.length > 0) {
      await supabase.from("material_chunks").insert(
        chunks.map((text, i) => ({ material_id: materialId, chunk_text: text, chunk_index: i }))
      );
    }

    return new Response(JSON.stringify({ success: true, chunks: chunks.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-material error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
