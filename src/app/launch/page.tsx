"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const SITE = "https://contentsplit.vercel.app";

const LAUNCH_POSTS = [
  {
    platform: "Twitter",
    icon: "𝕏",
    posts: [
      {
        label: "Launch announcement",
        content: `I built a free tool that turns any article into:\n\n🧵 Twitter threads\n💼 LinkedIn posts\n🎬 Video scripts\n✉️ Newsletters\n\nNo sign-up. No AI key needed. Just paste and go.\n\n→ ${SITE}\n\nRT if this is useful 🔁`,
      },
      {
        label: "Problem → Solution",
        content: `Content creators spend 3+ hours rewriting one blog post for different platforms.\n\nI built Recast to fix that.\n\nPaste any article → get Twitter thread + LinkedIn post + video script + newsletter in 10 seconds.\n\nFree, no sign-up:\n${SITE}`,
      },
      {
        label: "Show HN style",
        content: `Show HN: Recast — turn any article into Twitter threads, LinkedIn posts, and video scripts\n\nBuilt with Next.js, free to use. Paste a URL or text → get 4 platform-optimized formats instantly.\n\nNo login, no API key needed.\n\n${SITE}`,
      },
    ],
  },
  {
    platform: "Reddit",
    icon: "🔴",
    posts: [
      {
        label: "r/SideProject",
        content: `**Recast — Free tool to repurpose content for every platform**\n\nHey r/SideProject!\n\nI built a free tool that converts blog posts/articles into:\n- Twitter threads (with hooks + CTAs)\n- LinkedIn posts (professional narrative)\n- 60s video scripts (for Reels/TikTok)\n- Newsletter digests\n\nJust paste a URL or text. No sign-up needed.\n\n**Link:** ${SITE}\n\n**Tech stack:** Next.js, TypeScript, Vercel\n\nWould love feedback! What other formats would be useful?`,
      },
      {
        label: "r/ContentMarketing",
        content: `**Free tool: Turn 1 article into 4 platform-ready posts in 10 seconds**\n\nTired of manually rewriting content for every platform? I built Recast — paste any article URL and instantly get:\n\n1. Twitter thread (hook + numbered tweets + CTA)\n2. LinkedIn post (professional storytelling format)\n3. 60-second video script (structured for short-form)\n4. Newsletter digest (email-ready summary)\n\nCompletely free, no account needed: ${SITE}\n\nLooking for feedback from fellow content marketers!`,
      },
    ],
  },
  {
    platform: "Hacker News",
    icon: "🟠",
    posts: [
      {
        label: "Show HN submission",
        content: `Show HN: Recast – Repurpose any article into Twitter threads, LinkedIn posts, and video scripts\n\n${SITE}\n\nBuilt this over a weekend. It extracts content from any URL (or paste text directly) and generates platform-optimized versions for Twitter, LinkedIn, short video, and newsletters.\n\nNo auth, no API keys, completely free. Built with Next.js + TypeScript, deployed on Vercel.\n\nLooking for feedback on the output quality and what formats to add next.`,
      },
    ],
  },
  {
    platform: "LinkedIn",
    icon: "💼",
    posts: [
      {
        label: "Launch post",
        content: `I just shipped something I've wanted for years.\n\nAs a content creator, I was spending 3+ hours turning each blog post into social media content. Different tone for Twitter. Different format for LinkedIn. Another version for newsletters.\n\nSo I built Recast.\n\n→ Paste any article URL\n→ Get Twitter thread + LinkedIn post + video script + newsletter in seconds\n→ Copy and publish\n\nIt's completely free. No sign-up needed.\n\nTry it: ${SITE}\n\nWhat platform formats would you add? Drop a comment 👇\n\n#ContentMarketing #Productivity #SideProject #AI`,
      },
    ],
  },
  {
    platform: "Product Hunt",
    icon: "🐱",
    posts: [
      {
        label: "Product Hunt tagline",
        content: `🏷️ Tagline: "Turn any article into Twitter threads, LinkedIn posts & video scripts in 10 seconds"\n\n📝 Description:\nRecast is a free content repurposing tool. Paste any blog post URL or text and instantly get:\n\n🧵 Twitter Thread — viral hooks, numbered tweets, engagement CTA\n💼 LinkedIn Post — professional narrative with storytelling structure\n🎬 Video Script — 60-second script for Reels/TikTok/Shorts\n✉️ Newsletter — email-friendly digest with key takeaways\n\nNo sign-up. No API key. Just paste and go.\n\nPerfect for content creators, marketers, and solopreneurs who want to publish everywhere without the grind.\n\n🔗 ${SITE}`,
      },
    ],
  },
  {
    platform: "IndieHackers",
    icon: "🧑‍💻",
    posts: [
      {
        label: "Launch post",
        content: `## Recast — Turn 1 article into 4 platform-ready posts\n\nHey IH! Just launched Recast, a free content repurposing tool.\n\n**The problem:** Writing unique content for every platform takes forever. One blog post = 3+ hours of reformatting.\n\n**The solution:** Paste a URL or text → get Twitter thread + LinkedIn post + video script + newsletter in 10 seconds.\n\n**How it works:**\n1. Paste content (URL or text)\n2. Pick platforms (1 or all 4)\n3. Copy & publish\n\n**Tech:** Next.js, TypeScript, Vercel\n**Price:** Free (validating demand before adding paid features)\n\n→ ${SITE}\n\nQuestions:\n- Would you pay for this? If so, how much?\n- What other output formats would be useful?\n- Any content creators here who'd give it a real test?`,
      },
    ],
  },
];

export default function LaunchPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: 56 }}>
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0" }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="label">Launch Kit</span>
              <h1 className="heading-xl" style={{ marginTop: 8, marginBottom: 12 }}>Ready-to-post launch content</h1>
              <p className="text-body" style={{ maxWidth: 500, margin: "0 auto" }}>
                Copy these posts and share on your social channels to spread the word about Recast.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {LAUNCH_POSTS.map((group) => (
                <div key={group.platform}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{group.icon}</span>
                    {group.platform}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {group.posts.map((post, j) => {
                      const id = `${group.platform}-${j}`;
                      return (
                        <div key={id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 16px", borderBottom: "1px solid var(--border)",
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{post.label}</span>
                            <div style={{ display: "flex", gap: 6 }}>
                              <span style={{ fontSize: 11, color: "var(--text-4)" }}>{post.content.length} chars</span>
                              <button onClick={() => copy(post.content, id)} style={{
                                padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)",
                                background: copied === id ? "var(--success)" : "transparent",
                                color: copied === id ? "#fff" : "var(--text-3)",
                                fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                              }}>
                                {copied === id ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          </div>
                          <div className="output-block" style={{ border: "none", borderRadius: 0, fontSize: 13 }}>
                            {post.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
