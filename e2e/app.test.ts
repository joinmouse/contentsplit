import { describe, it, expect } from "vitest";

const BASE = "http://localhost:3000";

describe("Homepage", () => {
  it("returns 200 with HTML", async () => {
    const res = await fetch(`${BASE}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("contains Recast branding", async () => {
    const html = await (await fetch(`${BASE}/`)).text();
    expect(html).toContain("Recast");
  });
});

describe("API /api/generate", () => {
  it("returns 400 for empty input", async () => {
    const res = await fetch(`${BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "text", input: "", platforms: ["twitter"] }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing platforms", async () => {
    const res = await fetch(`${BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "text", input: "Hello world this is a test article about AI and technology that is long enough to process.", platforms: [] }),
    });
    expect(res.status).toBe(400);
  });

  it("generates twitter thread from text", async () => {
    const res = await fetch(`${BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "text",
        input: "Artificial intelligence is transforming the way we work and live. Machine learning models can now generate text, images, and code with remarkable quality. Companies are investing billions in AI infrastructure. The productivity gains are estimated to be worth trillions over the next decade. Early adopters are seeing significant competitive advantages.",
        platforms: ["twitter"],
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toHaveLength(1);
    expect(data.results[0].platform).toBe("twitter");
    expect(data.results[0].content.length).toBeGreaterThan(50);
  });

  it("generates multiple platform outputs", async () => {
    const res = await fetch(`${BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "text",
        input: "The future of content creation is AI-powered repurposing. Instead of writing unique content for every platform, creators can now write once and distribute everywhere. This saves hours of work per week and ensures consistent messaging across channels. The best tools maintain the original voice while adapting format and tone for each platform.",
        platforms: ["twitter", "linkedin", "script"],
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toHaveLength(3);
    expect(data.results.map((r: { platform: string }) => r.platform)).toEqual(["twitter", "linkedin", "script"]);
  });
});
