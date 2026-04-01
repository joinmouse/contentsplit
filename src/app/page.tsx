"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const PLATFORMS = [
  { id: "twitter", label: "Twitter Thread", icon: "𝕏", desc: "Hook + 5-8 tweets + CTA" },
  { id: "linkedin", label: "LinkedIn Post", icon: "in", desc: "Professional narrative" },
  { id: "script", label: "Video Script", icon: "▶", desc: "60s short-form script" },
  { id: "newsletter", label: "Newsletter", icon: "✉", desc: "Email-friendly digest" },
] as const;

type Platform = typeof PLATFORMS[number]["id"];
type Result = { platform: string; content: string };

const USE_CASES = [
  { role: "Content Creators", pain: "Spend 3+ hours rewriting each blog post for different platforms", solve: "Generate all formats in 10 seconds" },
  { role: "Marketing Teams", pain: "Inconsistent messaging across channels", solve: "Same core message, platform-optimized tone" },
  { role: "Solopreneurs", pain: "Can't afford a social media team", solve: "One tool replaces a content team" },
  { role: "Agencies", pain: "Client content turnaround too slow", solve: "10x faster content pipeline" },
];

const STATS = [
  { num: "10s", label: "Avg generation time" },
  { num: "4", label: "Platform formats" },
  { num: "75%", label: "Time saved vs manual" },
];

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"url" | "text">("url");
  const [selected, setSelected] = useState<Set<Platform>>(new Set(["twitter", "linkedin"]));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [genCount, setGenCount] = useState(0);

  // Track total generations (persist in localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("recast_gens");
    if (saved) setGenCount(parseInt(saved, 10));
  }, []);

  const togglePlatform = (p: Platform) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(p)) { if (next.size > 1) next.delete(p); }
      else next.add(p);
      return next;
    });
  };

  const generate = async () => {
    const input = mode === "url" ? url.trim() : text.trim();
    if (!input) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input, platforms: Array.from(selected) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results);
      const newCount = genCount + 1;
      setGenCount(newCount);
      localStorage.setItem("recast_gens", String(newCount));
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // In production: POST to /api/waitlist or a service like ConvertKit/Mailchimp
    setEmailSent(true);
    setEmail("");
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: 56 }}>
        {/* Hero — bold, conversion-focused */}
        <section style={{ padding: "clamp(60px, 10vw, 140px) 0 clamp(40px, 6vw, 80px)", position: "relative", overflow: "hidden" }}>
          {/* Gradient bg accent */}
          <div style={{
            position: "absolute", top: "-30%", right: "-10%",
            width: "60%", height: "80%", borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div className="container" style={{ textAlign: "center", position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "var(--accent-bg)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--accent-text)" }}>Free to use &middot; No sign-up required</span>
            </div>

            <h1 className="heading-xl" style={{ marginBottom: 20 }}>
              Write Once.<br />
              <span style={{ background: "linear-gradient(135deg, var(--accent), #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Publish Everywhere.
              </span>
            </h1>
            <p className="text-body" style={{ maxWidth: 580, margin: "0 auto 36px" }}>
              Paste any article or blog URL — Recast instantly generates optimized Twitter threads, LinkedIn posts, video scripts, and newsletters. No AI expertise needed.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#try" className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>
                Start Generating &darr;
              </a>
              <a href="#how-it-works" className="btn-secondary" style={{ fontSize: 16, padding: "14px 36px" }}>
                See How It Works
              </a>
            </div>

            {/* Social proof stats */}
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px, 5vw, 60px)", marginTop: 48 }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "var(--accent-text)" }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: "var(--text-4)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases — who it's for */}
        <section style={{ padding: "clamp(40px, 6vw, 80px) 0", background: "var(--bg-2)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="label">Who It's For</span>
              <h2 className="heading-lg" style={{ marginTop: 8 }}>Built for people who create content</h2>
              <p className="text-body" style={{ maxWidth: 500, margin: "12px auto 0" }}>
                Whether you write one article a week or ten, Recast turns each piece into a full content pipeline.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {USE_CASES.map((uc) => (
                <div key={uc.role} className="card" style={{ position: "relative" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>{uc.role}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-4)", marginBottom: 12, textDecoration: "line-through" }}>{uc.pain}</p>
                  <p style={{ fontSize: 14, color: "var(--success)", fontWeight: 500 }}>{uc.solve}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding: "clamp(40px, 6vw, 80px) 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="label">Features</span>
              <h2 className="heading-lg" style={{ marginTop: 8 }}>Everything you need to repurpose content</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {[
                { icon: "🧵", title: "Twitter Threads", desc: "Viral hooks, numbered tweets, and engagement-driven CTAs." },
                { icon: "💼", title: "LinkedIn Posts", desc: "Professional storytelling format optimized for B2B audiences." },
                { icon: "🎬", title: "Video Scripts", desc: "60-second scripts structured for Reels, TikTok, and Shorts." },
                { icon: "✉️", title: "Newsletter Digests", desc: "Email-friendly summaries with key takeaways and links." },
                { icon: "🔗", title: "URL Auto-Extract", desc: "Drop a URL — we handle content extraction automatically." },
                { icon: "📋", title: "One-Click Copy", desc: "Copy any output to clipboard instantly. Paste and publish." },
              ].map((f) => (
                <div key={f.title} className="card">
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "var(--text-1)" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" style={{ padding: "clamp(40px, 6vw, 80px) 0", background: "var(--bg-2)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="label">How It Works</span>
              <h2 className="heading-lg" style={{ marginTop: 8 }}>Three steps. Ten seconds.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
              {[
                { step: "1", title: "Paste Content", desc: "Drop in a blog URL or paste article text directly. We extract the key content." },
                { step: "2", title: "Pick Platforms", desc: "Choose one or all: Twitter, LinkedIn, Video Script, Newsletter." },
                { step: "3", title: "Copy & Publish", desc: "Get platform-optimized content instantly. One-click copy to clipboard." },
              ].map((s) => (
                <div key={s.step} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, background: "var(--accent-bg)",
                    color: "var(--accent-text)", fontSize: 22, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                  }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-1)" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Try It — The Product */}
        <section id="try" style={{ padding: "clamp(60px, 8vw, 100px) 0" }}>
          <div className="container" style={{ maxWidth: 840 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span className="label">Try It Now</span>
              <h2 className="heading-lg" style={{ marginTop: 8, marginBottom: 8 }}>Generate content in seconds</h2>
              <p style={{ fontSize: 14, color: "var(--text-4)" }}>Free, no account needed. Paste and go.</p>
            </div>

            <div className="card" style={{ padding: "clamp(20px, 3vw, 32px)" }}>
              {/* Input mode toggle */}
              <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "var(--bg-3)", borderRadius: 10, padding: 4, width: "fit-content" }}>
                {(["url", "text"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    padding: "8px 20px", borderRadius: 8, border: "none",
                    background: mode === m ? "var(--bg)" : "transparent",
                    color: mode === m ? "var(--text-1)" : "var(--text-4)",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s",
                  }}>
                    {m === "url" ? "URL" : "Paste Text"}
                  </button>
                ))}
              </div>

              {/* Input */}
              {mode === "url" ? (
                <input
                  type="url"
                  placeholder="https://your-blog.com/article-to-repurpose..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
              ) : (
                <textarea
                  placeholder="Paste your article, blog post, or any long-form content here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  style={{ marginBottom: 16, resize: "vertical" }}
                />
              )}

              {/* Platform selector */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Output Formats</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                  {PLATFORMS.map((p) => (
                    <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                      padding: "12px 14px", borderRadius: 10,
                      border: `1.5px solid ${selected.has(p.id) ? "var(--accent)" : "var(--border)"}`,
                      background: selected.has(p.id) ? "var(--accent-bg)" : "transparent",
                      color: selected.has(p.id) ? "var(--accent-text)" : "var(--text-3)",
                      cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, width: 24 }}>{p.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                          <div style={{ fontSize: 11, color: "var(--text-4)" }}>{p.desc}</div>
                        </div>
                        {selected.has(p.id) && <span style={{ marginLeft: "auto", color: "var(--accent)", fontSize: 14 }}>&#10003;</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <button
                onClick={generate}
                disabled={loading || (mode === "url" ? !url.trim() : !text.trim())}
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: 15 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span className="spinner" /> Generating {selected.size} format{selected.size > 1 ? "s" : ""}...
                  </span>
                ) : (
                  <>Generate {selected.size} Format{selected.size > 1 ? "s" : ""} &rarr;</>
                )}
              </button>

              {genCount > 0 && !loading && results.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-4)", marginTop: 8 }}>
                  You&apos;ve generated {genCount} time{genCount > 1 ? "s" : ""} this session
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="fade-in" style={{
                marginTop: 16, padding: "12px 16px", borderRadius: 10,
                background: "color-mix(in srgb, var(--error) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--error) 20%, transparent)",
                color: "var(--error)", fontSize: 14,
              }}>
                {error}
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="fade-in" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-1)" }}>Generated Content</h3>
                  <span style={{ fontSize: 12, color: "var(--text-4)" }}>{results.length} format{results.length > 1 ? "s" : ""}</span>
                </div>
                {results.map((r, i) => {
                  const plat = PLATFORMS.find((p) => p.id === r.platform);
                  const shareText = r.platform === "twitter"
                    ? encodeURIComponent(r.content.slice(0, 250) + "\n\n— Made with https://contentsplit.vercel.app")
                    : encodeURIComponent("Just used Recast to turn an article into a " + (plat?.label || r.platform) + " in 10 seconds.\n\nTry it free: https://contentsplit.vercel.app");
                  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
                  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://contentsplit.vercel.app")}`;

                  return (
                    <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px", borderBottom: "1px solid var(--border)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>{plat?.icon}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>
                            {plat?.label || r.platform}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "var(--text-4)" }}>{r.content.length} chars</span>
                          <button onClick={() => copyToClipboard(r.content, r.platform)} style={{
                            padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border)",
                            background: copied === r.platform ? "var(--success)" : "transparent",
                            color: copied === r.platform ? "#fff" : "var(--text-3)",
                            fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                          }}>
                            {copied === r.platform ? "Copied!" : "Copy"}
                          </button>
                          <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" style={{
                            padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)",
                            fontSize: 12, fontWeight: 500, color: "var(--text-3)", textDecoration: "none",
                            display: "inline-flex", alignItems: "center", gap: 4, transition: "all 0.15s",
                          }}>
                            𝕏 Share
                          </a>
                          <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" style={{
                            padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)",
                            fontSize: 12, fontWeight: 500, color: "var(--text-3)", textDecoration: "none",
                            display: "inline-flex", alignItems: "center", gap: 4, transition: "all 0.15s",
                          }}>
                            in Share
                          </a>
                        </div>
                      </div>
                      <div className="output-block" style={{ border: "none", borderRadius: 0 }}>
                        {r.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Waitlist / Email Capture */}
        <section style={{
          padding: "clamp(60px, 8vw, 100px) 0",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 5%, var(--bg)) 0%, var(--bg-2) 100%)",
        }}>
          <div className="container" style={{ textAlign: "center", maxWidth: 560 }}>
            <span className="label">Coming Soon</span>
            <h2 className="heading-lg" style={{ marginTop: 8, marginBottom: 12 }}>Pro features on the way</h2>
            <p className="text-body" style={{ marginBottom: 28 }}>
              AI-powered generation with GPT-4, custom brand voice, tone adjustment, bulk processing, and API access. Join the waitlist.
            </p>

            {emailSent ? (
              <div className="fade-in" style={{
                padding: "16px 24px", borderRadius: 12, background: "color-mix(in srgb, var(--success) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)",
                color: "var(--success)", fontSize: 15, fontWeight: 500,
              }}>
                You&apos;re on the list! We&apos;ll notify you when Pro launches.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                  Join Waitlist
                </button>
              </form>
            )}
            <p style={{ fontSize: 12, color: "var(--text-4)", marginTop: 12 }}>No spam. Unsubscribe anytime.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
