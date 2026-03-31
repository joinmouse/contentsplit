"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const PLATFORMS = [
  { id: "twitter", label: "Twitter Thread", icon: "𝕏", desc: "Hook + 5-8 tweets + CTA" },
  { id: "linkedin", label: "LinkedIn Post", icon: "in", desc: "Professional narrative format" },
  { id: "script", label: "Video Script", icon: "▶", desc: "60s short-form video script" },
] as const;

type Platform = typeof PLATFORMS[number]["id"];
type Result = { platform: string; content: string };

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"url" | "text">("url");
  const [selected, setSelected] = useState<Set<Platform>>(new Set(["twitter"]));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

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
        body: JSON.stringify({
          mode,
          input,
          platforms: Array.from(selected),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results);
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

  return (
    <>
      <Header />
      <main style={{ paddingTop: 80 }}>
        {/* Hero */}
        <section style={{ padding: "clamp(40px, 8vw, 100px) 0 clamp(40px, 6vw, 80px)" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>AI-Powered</span>
            <h1 className="heading-xl" style={{ marginBottom: 16 }}>
              One Article.<br />
              <span style={{ color: "var(--accent)" }}>Every Platform.</span>
            </h1>
            <p className="text-body" style={{ maxWidth: 560, margin: "0 auto 32px" }}>
              Paste a blog post or article URL and instantly get optimized content for Twitter, LinkedIn, and short-form video — powered by AI.
            </p>
            <a href="#try" className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>
              Try It Free &darr;
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding: "clamp(40px, 6vw, 80px) 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="label">Features</span>
              <h2 className="heading-lg" style={{ marginTop: 8 }}>Repurpose smarter, not harder</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {[
                { icon: "🧵", title: "Twitter Threads", desc: "Engaging hooks, numbered tweets, and a strong CTA — optimized for virality." },
                { icon: "💼", title: "LinkedIn Posts", desc: "Professional tone with storytelling structure that drives engagement." },
                { icon: "🎬", title: "Video Scripts", desc: "60-second scripts with hooks, key points, and calls to action for Reels/TikTok." },
                { icon: "🔗", title: "URL or Text Input", desc: "Paste a URL and we'll extract the content, or paste text directly." },
                { icon: "⚡", title: "Instant Generation", desc: "AI generates all formats in seconds. Copy and post immediately." },
                { icon: "🌙", title: "Dark Mode", desc: "Easy on the eyes with full dark/light theme support." },
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
              <h2 className="heading-lg" style={{ marginTop: 8 }}>Three steps. Zero friction.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
              {[
                { step: "1", title: "Paste Your Content", desc: "Drop in a blog URL or paste article text directly." },
                { step: "2", title: "Choose Platforms", desc: "Select Twitter, LinkedIn, Video Script — or all three." },
                { step: "3", title: "Get Results", desc: "AI generates platform-optimized content in seconds. Copy and share." },
              ].map((s) => (
                <div key={s.step} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%", background: "var(--accent-bg)",
                    color: "var(--accent-text)", fontSize: 20, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "var(--text-1)" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Try It Section */}
        <section id="try" style={{ padding: "clamp(40px, 8vw, 100px) 0" }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span className="label">Try It Now</span>
              <h2 className="heading-lg" style={{ marginTop: 8 }}>Generate content in seconds</h2>
            </div>

            {/* Input mode toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setMode("url")} style={{
                padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border)",
                background: mode === "url" ? "var(--accent)" : "transparent",
                color: mode === "url" ? "#fff" : "var(--text-3)",
                fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              }}>
                URL
              </button>
              <button onClick={() => setMode("text")} style={{
                padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border)",
                background: mode === "text" ? "var(--accent)" : "transparent",
                color: mode === "text" ? "#fff" : "var(--text-3)",
                fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              }}>
                Paste Text
              </button>
            </div>

            {/* Input field */}
            {mode === "url" ? (
              <input
                type="url"
                placeholder="https://your-blog.com/article..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ marginBottom: 16 }}
              />
            ) : (
              <textarea
                placeholder="Paste your article or blog post text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                style={{ marginBottom: 16, resize: "vertical" }}
              />
            )}

            {/* Platform selector */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)", marginBottom: 10 }}>Output Formats</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PLATFORMS.map((p) => (
                  <button key={p.id} onClick={() => togglePlatform(p.id)} style={{
                    padding: "10px 18px", borderRadius: 10,
                    border: `1.5px solid ${selected.has(p.id) ? "var(--accent)" : "var(--border)"}`,
                    background: selected.has(p.id) ? "var(--accent-bg)" : "transparent",
                    color: selected.has(p.id) ? "var(--accent-text)" : "var(--text-3)",
                    cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>{p.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                        <div style={{ fontSize: 11, opacity: 0.7 }}>{p.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={loading || (mode === "url" ? !url.trim() : !text.trim())}
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: 15 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="spinner" /> Generating...
                </span>
              ) : (
                "Generate Content"
              )}
            </button>

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
              <div className="fade-in" style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                {results.map((r, i) => (
                  <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderBottom: "1px solid var(--border)",
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>
                        {PLATFORMS.find((p) => p.id === r.platform)?.label || r.platform}
                      </span>
                      <button onClick={() => copyToClipboard(r.content, r.platform)} style={{
                        padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border)",
                        background: copied === r.platform ? "var(--success)" : "transparent",
                        color: copied === r.platform ? "#fff" : "var(--text-3)",
                        fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                      }}>
                        {copied === r.platform ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="output-block" style={{ border: "none", borderRadius: 0 }}>
                      {r.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
