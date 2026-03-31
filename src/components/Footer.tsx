export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 0", textAlign: "center" }}>
      <div className="container">
        <p style={{ fontSize: 14, color: "var(--text-4)" }}>
          Built with Next.js & AI &middot; &copy; {new Date().getFullYear()} Recast
        </p>
      </div>
    </footer>
  );
}
