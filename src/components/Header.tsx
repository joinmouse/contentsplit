"use client";

import { useTheme } from "@/lib/theme";
import Link from "next/link";

export default function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "color-mix(in srgb, var(--bg) 85%, transparent)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--text-1)" }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
            Re<span style={{ color: "var(--accent)" }}>cast</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="#features" style={{ fontSize: 14, color: "var(--text-3)", textDecoration: "none" }}>Features</Link>
          <Link href="#how-it-works" style={{ fontSize: 14, color: "var(--text-3)", textDecoration: "none" }}>How It Works</Link>
          <Link href="#try" style={{ fontSize: 14, color: "var(--text-3)", textDecoration: "none" }}>Try It</Link>
          <Link href="/launch" style={{ fontSize: 14, color: "var(--accent-text)", textDecoration: "none", fontWeight: 600 }}>Launch Kit</Link>

          <button onClick={toggle} style={{
            background: "none", border: "1px solid var(--border)", borderRadius: 8,
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-3)", fontSize: 16,
          }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
