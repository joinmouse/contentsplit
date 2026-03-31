import { NextRequest, NextResponse } from "next/server";

// Simple content extraction from URL using fetch
async function extractFromUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ContentSplit/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const html = await res.text();

    // Strip HTML tags and extract text content
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    // Take first 3000 chars as content
    return text.slice(0, 3000);
  } catch (e) {
    throw new Error(`Could not extract content from URL: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function generateTwitterThread(content: string): string {
  const sentences = content.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  if (sentences.length < 3) {
    return `🧵 Thread:\n\n1/ ${content.slice(0, 240)}\n\n2/ Key takeaway: ${content.slice(240, 480) || "This is a must-read."}\n\n3/ What do you think? Reply below 👇`;
  }

  const hook = sentences[0].slice(0, 200);
  const points = sentences.slice(1, 7);
  let thread = `🧵 ${hook}\n\nA thread 👇\n\n`;

  points.forEach((point, i) => {
    thread += `${i + 1}/ ${point.slice(0, 240)}\n\n`;
  });

  thread += `${points.length + 1}/ If you found this useful:\n• Retweet the first tweet\n• Follow for more insights\n• Drop a 🔥 in the replies`;

  return thread;
}

function generateLinkedInPost(content: string): string {
  const sentences = content.split(/(?<=[.!?])\s+/).filter((s) => s.length > 15);
  const hook = sentences[0]?.slice(0, 150) || content.slice(0, 150);
  const body = sentences.slice(1, 5).map((s) => s.slice(0, 200));

  let post = `${hook}\n\n`;
  post += `Here's what I learned:\n\n`;
  body.forEach((point) => {
    post += `→ ${point}\n\n`;
  });
  post += `---\n\n`;
  post += `The bottom line? ${sentences[sentences.length - 1]?.slice(0, 200) || "This changes everything."}\n\n`;
  post += `♻️ Repost if this resonated.\n💬 What's your take? Comment below.`;

  return post;
}

function generateVideoScript(content: string): string {
  const sentences = content.split(/(?<=[.!?])\s+/).filter((s) => s.length > 15);
  const topic = sentences[0]?.slice(0, 100) || content.slice(0, 100);
  const keyPoints = sentences.slice(1, 4).map((s) => s.slice(0, 150));

  let script = `[HOOK — 0:00-0:05]\n`;
  script += `"${topic}"\n\n`;
  script += `[CONTEXT — 0:05-0:15]\n`;
  script += `Here's what you need to know...\n\n`;
  script += `[KEY POINTS — 0:15-0:45]\n`;
  keyPoints.forEach((p, i) => {
    script += `${i + 1}. ${p}\n`;
  });
  script += `\n[CTA — 0:45-0:60]\n`;
  script += `"Follow for more insights like this. Save this video for later."\n`;
  script += `\n---\n`;
  script += `Total: ~60 seconds\n`;
  script += `Style: Talking head / text overlay\n`;
  script += `Music: Upbeat, minimal`;

  return script;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, input, platforms } = body as {
      mode: "url" | "text";
      input: string;
      platforms: string[];
    };

    if (!input || !platforms?.length) {
      return NextResponse.json({ error: "Missing input or platforms" }, { status: 400 });
    }

    // Get content
    let content: string;
    if (mode === "url") {
      content = await extractFromUrl(input);
    } else {
      content = input.slice(0, 3000);
    }

    if (content.length < 50) {
      return NextResponse.json({ error: "Content too short. Please provide more text." }, { status: 400 });
    }

    // Generate for each platform
    const results = platforms.map((platform) => {
      let generated: string;
      switch (platform) {
        case "twitter":
          generated = generateTwitterThread(content);
          break;
        case "linkedin":
          generated = generateLinkedInPost(content);
          break;
        case "script":
          generated = generateVideoScript(content);
          break;
        default:
          generated = `Content for ${platform}: ${content.slice(0, 500)}`;
      }
      return { platform, content: generated };
    });

    return NextResponse.json({ results });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
