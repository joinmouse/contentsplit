import { NextRequest, NextResponse } from "next/server";
// x402 payment — uncomment when ready to charge
// import { withX402 } from "@x402/next";
// import { server, generateRoute } from "@/lib/x402";

// Content extraction from URL
async function extractFromUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Recast/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const html = await res.text();

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
  script += `\n---\nTotal: ~60 seconds\nStyle: Talking head / text overlay\nMusic: Upbeat, minimal`;

  return script;
}

function generateNewsletter(content: string): string {
  const sentences = content.split(/(?<=[.!?])\s+/).filter((s) => s.length > 15);
  const title = sentences[0]?.slice(0, 100) || content.slice(0, 100);
  const keyPoints = sentences.slice(1, 6).map((s) => s.slice(0, 200));

  let nl = `📬 Subject Line: ${title}\n\n`;
  nl += `---\n\n`;
  nl += `Hey there,\n\n`;
  nl += `Here's a quick digest of something worth your time:\n\n`;
  nl += `**TL;DR**\n${sentences[0]?.slice(0, 200) || content.slice(0, 200)}\n\n`;
  nl += `**Key Takeaways:**\n\n`;
  keyPoints.forEach((p, i) => {
    nl += `${i + 1}. ${p}\n`;
  });
  nl += `\n**Why It Matters:**\n`;
  nl += `${sentences[sentences.length - 2]?.slice(0, 250) || "This is shaping the future of how we work."}\n\n`;
  nl += `---\n\n`;
  nl += `That's it for today. Hit reply if you have thoughts.\n\n`;
  nl += `Until next time,\n[Your Name]`;

  return nl;
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

    let content: string;
    if (mode === "url") {
      content = await extractFromUrl(input);
    } else {
      content = input.slice(0, 3000);
    }

    if (content.length < 50) {
      return NextResponse.json({ error: "Content too short. Please provide more text." }, { status: 400 });
    }

    const generators: Record<string, (c: string) => string> = {
      twitter: generateTwitterThread,
      linkedin: generateLinkedInPost,
      script: generateVideoScript,
      newsletter: generateNewsletter,
    };

    const results = platforms.map((platform) => {
      const gen = generators[platform];
      const generated = gen ? gen(content) : `Content for ${platform}: ${content.slice(0, 500)}`;
      return { platform, content: generated };
    });

    return NextResponse.json({ results });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// TODO: Enable x402 payment when ready to charge
// export const POST = withX402(handler, generateRoute, server);
