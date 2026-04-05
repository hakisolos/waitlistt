"use client";

import { useState, useEffect } from "react";

type Status = "idle" | "loading" | "success" | "conflict" | "error";

export default function SparkDBPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [dark, setDark] = useState(false);

  // Respect system preference on first load
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const d = dark;

  // ── colour tokens ──────────────────────────────────────────────
  const bg         = d ? "#0d0d12" : "#f5f3ff";
  const surface    = d ? "#15151f" : "#ffffff";
  const surface2   = d ? "#1c1c2a" : "#faf9ff";
  const border     = d ? "#2a2a3d" : "#ede9fe";
  const border2    = d ? "#222233" : "#f3f4f6";
  const textMain   = d ? "#f0eeff" : "#18181b";
  const textSub    = d ? "#8b8aac" : "#6b7280";
  const purple     = "#7c3aed";
  const purpleL    = d ? "#ede9fe1a" : "#ede9fe";
  const purplePill = d ? "#1e1535" : "#ede9fe";
  const purplePillB= d ? "#3b2f6e" : "#ddd6fe";
  const purplePillT= d ? "#c4b5fd" : "#6d28d9";
  const inputBg    = d ? "#0f0f1a" : "#fafafa";
  const inputBdr   = d ? "#2e2e45" : "#e5e7eb";
  const dbRowBg    = d ? "#13131e" : "#fafafa";
  const sidebarBg  = d ? "#11111b" : "#faf9ff";
  const winBg      = d ? "#0e0e18" : "#faf9ff";
  const statBdr    = d ? "#1e1e2e" : "#f3f4f6";

  async function handleSubmit() {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("https://waitlist-backend.sparkdb.pro/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 409) {
        setStatus("conflict");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  const btnLabel =
    status === "loading" ? "Joining…"      :
    status === "success"  ? "You're in! 🎉" :
    "Join Waitlist";

  const feedbackMsg =
    status === "success"  ? { text: "🎉 You're on the waitlist! We'll be in touch.", color: "#22c55e" } :
    status === "conflict" ? { text: "✋ This email is already on the waitlist.",      color: "#f59e0b" } :
    status === "error"    ? { text: "Something went wrong. Please try again.",        color: "#ef4444" } :
    null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-text-size-adjust: 100%; }

        .sparkdb-root {
          min-height: 100vh;
          background: ${bg};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow-x: hidden;
          transition: background 0.3s;
        }

        /* TOGGLE */
        .dm-toggle {
          position: fixed; top: 14px; right: 14px; z-index: 100;
          width: 38px; height: 38px; border-radius: 50%;
          border: 1.5px solid ${border}; background: ${surface};
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: background 0.3s, border-color 0.3s;
          -webkit-tap-highlight-color: transparent;
        }

        /* HEADER */
        .header {
          display: flex; align-items: center; justify-content: center;
          padding: 36px 24px 8px;
        }
        .logo-wrap { display: flex; align-items: center; gap: 8px; }
        .logo-img  { width: 38px; height: 38px; object-fit: contain; }
        .logo-text { font-size: 24px; font-weight: 800; color: ${textMain}; letter-spacing: -0.5px; }
        .logo-text span { color: ${purple}; }

        /* HERO */
        .hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 28px 20px 0;
        }
        .pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: ${purplePill}; border: 1px solid ${purplePillB};
          border-radius: 999px; padding: 5px 16px; margin-bottom: 26px;
        }
        .pill-dot { width: 8px; height: 8px; border-radius: 50%; background: ${purple}; flex-shrink: 0; }
        .pill-text { font-size: 11px; font-weight: 700; color: ${purplePillT}; letter-spacing: 0.09em; text-transform: uppercase; }

        .h1-black  { font-size: clamp(32px, 8vw, 70px); font-weight: 800; line-height: 1.07; color: ${textMain}; letter-spacing: -1.5px; }
        .h1-purple { font-size: clamp(32px, 8vw, 70px); font-weight: 800; line-height: 1.07; color: ${purple}; letter-spacing: -1.5px; margin-bottom: 20px; }

        .subtext { font-size: 15px; color: ${textSub}; line-height: 1.65; max-width: 440px; margin-bottom: 36px; }

        /* FORM CARD */
        .form-card {
          background: ${surface};
          border-radius: 18px;
          box-shadow: ${d
            ? "0 4px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset"
            : "0 4px 32px rgba(124,58,237,0.08), 0 1px 4px rgba(0,0,0,0.06)"};
          padding: 26px 28px 22px;
          width: 100%; max-width: 540px; margin-bottom: 48px;
          border: 1px solid ${border};
        }
        .input-row { display: flex; gap: 10px; margin-bottom: 16px; }
        .input-wrap {
          flex: 1; min-width: 0; display: flex; align-items: center; gap: 9px;
          border: 1.5px solid ${inputBdr}; border-radius: 10px;
          padding: 0 13px; background: ${inputBg}; transition: border-color 0.2s;
        }
        .input-wrap:focus-within { border-color: ${purple}; }
        .email-input {
          border: none; outline: none; background: transparent;
          font-size: 14px; color: ${textMain}; width: 100%;
          padding: 13px 0; font-family: inherit; -webkit-appearance: none;
        }
        .email-input::placeholder { color: ${textSub}; }

        .join-btn {
          background: ${purple}; color: #fff; border: none; border-radius: 10px;
          padding: 0 20px; font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          white-space: nowrap; font-family: inherit; height: 46px; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent; transition: opacity 0.15s;
        }
        .join-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .join-btn:not(:disabled):active { opacity: 0.82; }

        .feedback { font-size: 13px; font-weight: 500; margin-bottom: 14px; text-align: center; }

        .badges { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .badge  { display: flex; align-items: center; gap: 7px; }
        .badge-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: ${purpleL}; border: 1px solid ${border};
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .badge-label { font-size: 13px; color: ${textSub}; font-weight: 500; }

        /* MOCKUP */
        .mockup-wrap { display: flex; justify-content: center; padding: 0 16px 64px; }
        .mockup {
          width: 100%; max-width: 820px; background: ${surface};
          border-radius: 18px;
          box-shadow: ${d
            ? "0 8px 60px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset"
            : "0 8px 48px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.06)"};
          overflow: hidden; border: 1px solid ${border};
        }
        .win-chrome {
          height: 34px; background: ${winBg}; border-bottom: 1px solid ${border};
          display: flex; align-items: center; padding: 0 14px; gap: 6px;
        }
        .chrome-dot { width: 10px; height: 10px; border-radius: 50%; }
        .mockup-body { display: flex; }

        /* SIDEBAR */
        .sidebar {
          width: 172px; border-right: 1px solid ${border};
          padding: 18px 0; background: ${sidebarBg}; flex-shrink: 0;
        }
        .sidebar-logo { display: flex; align-items: center; gap: 7px; padding: 0 16px; margin-bottom: 20px; }
        .sidebar-logo img { width: 20px; height: 20px; object-fit: contain; }
        .sidebar-logo-text { font-weight: 800; font-size: 14px; color: ${textMain}; }
        .sidebar-logo-text span { color: ${purple}; }
        .nav-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; margin: 1px 8px; border-radius: 8px;
          font-size: 12.5px; font-weight: 500; cursor: pointer; color: ${textSub};
        }
        .nav-item.active { background: ${d ? "#2a1f5e" : "#ede9fe"}; color: ${purple}; font-weight: 600; }

        /* DASH MAIN */
        .dash-main { flex: 1; padding: 18px 20px; min-width: 0; }
        .dash-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .dash-title { font-weight: 700; font-size: 15px; color: ${textMain}; }
        .new-db-btn {
          background: ${purple}; color: #fff; border: none; border-radius: 7px;
          padding: 6px 12px; font-size: 11.5px; font-weight: 600;
          cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 4px;
        }

        /* STATS */
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border: 1px solid ${statBdr}; border-radius: 10px;
          overflow: hidden; margin-bottom: 18px;
        }
        .stat-cell { padding: 13px 14px; border-right: 1px solid ${statBdr}; }
        .stat-cell:last-child { border-right: none; }
        .stat-val { font-size: 19px; font-weight: 800; color: ${purple}; letter-spacing: -0.5px; margin-bottom: 1px; }
        .stat-lbl { font-size: 10px; color: ${textSub}; margin-bottom: 1px; }
        .stat-sub { font-size: 10px; font-weight: 500; }

        .db-section-lbl { font-size: 12px; font-weight: 600; color: ${textMain}; margin-bottom: 10px; }
        .db-row {
          display: flex; align-items: center; padding: 9px 12px;
          border-radius: 8px; border: 1px solid ${border2};
          margin-bottom: 7px; background: ${dbRowBg}; gap: 10px;
        }
        .db-icon-wrap {
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .db-name   { font-weight: 600; font-size: 12px; color: ${textMain}; min-width: 80px; }
        .db-engine { font-size: 11px; color: ${textSub}; flex: 1; }
        .db-region { font-size: 11px; color: ${textSub}; min-width: 72px; }
        .db-pill   {
          background: ${d ? "#14301e" : "#dcfce7"}; color: ${d ? "#4ade80" : "#16a34a"};
          font-size: 10px; font-weight: 600; padding: 3px 9px;
          border-radius: 999px; flex-shrink: 0;
        }
        .db-dots { border: none; background: none; color: ${textSub}; font-size: 16px; cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0; }

        /* SPARKLE */
        .sparkle { position: absolute; pointer-events: none; opacity: ${d ? 0.3 : 0.5}; }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .sidebar { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-cell:nth-child(2) { border-right: none; }
          .stat-cell:nth-child(3) { border-top: 1px solid ${statBdr}; }
          .stat-cell:nth-child(4) { border-top: 1px solid ${statBdr}; border-right: none; }
          .db-region { display: none; }
        }

        @media (max-width: 520px) {
          .header { padding: 22px 16px 4px; }
          .logo-text { font-size: 20px; }
          .hero { padding: 18px 16px 0; }
          .subtext { font-size: 14px; }
          .form-card { padding: 18px 14px 16px; border-radius: 14px; }
          .input-row { flex-direction: column; gap: 10px; }
          .join-btn { width: 100%; justify-content: center; height: 50px; font-size: 15px; border-radius: 12px; }
          .badges { gap: 14px; }
          .badge-label { font-size: 12px; }
          .mockup-wrap { padding: 0 10px 44px; }
          .dash-main { padding: 14px 10px; }
          .db-engine { display: none; }
          .db-region { display: none; }
          .new-db-btn { font-size: 10px; padding: 5px 8px; }
          .dm-toggle { top: 10px; right: 10px; width: 34px; height: 34px; font-size: 14px; }
        }

        @media (max-width: 360px) {
          .h1-black, .h1-purple { font-size: 26px; letter-spacing: -0.8px; }
          .badges { flex-direction: column; align-items: center; gap: 10px; }
          .db-name { min-width: 60px; font-size: 11px; }
        }
      `}</style>

      <div className="sparkdb-root">

        {/* Dark mode toggle */}
        <button className="dm-toggle" onClick={() => setDark(!d)} aria-label="Toggle dark mode">
          {d ? (
            // Sun icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textMain} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          ) : (
            // Moon icon
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textMain} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Sparkles */}
        {[
          { top: "5%",  left: "7%",  size: 11 },
          { top: "3%",  left: "80%", size: 9  },
          { top: "18%", left: "93%", size: 13 },
          { top: "14%", left: "20%", size: 7  },
          { top: "55%", left: "2%",  size: 8  },
          { top: "70%", left: "97%", size: 10 },
        ].map((s, i) => (
          <svg key={i} className="sparkle" style={{ top: s.top, left: s.left }} width={s.size} height={s.size} viewBox="0 0 24 24" fill={purple}>
            <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6L12 17.2l-6.2 4.5 2.4-7.6L2 9.6h7.6z"/>
          </svg>
        ))}

        {/* Dashed arcs */}
        <svg style={{ position:"absolute", top:56, left:56, opacity: d ? 0.1 : 0.2, pointerEvents:"none" }} width="190" height="190" viewBox="0 0 200 200" fill="none">
          <path d="M 180 20 Q 20 20 20 180" stroke={purple} strokeWidth="1.5" strokeDasharray="6 6" fill="none"/>
        </svg>
        <svg style={{ position:"absolute", top:170, right:36, opacity: d ? 0.08 : 0.16, pointerEvents:"none" }} width="170" height="170" viewBox="0 0 180 180" fill="none">
          <path d="M 20 160 Q 160 160 160 20" stroke={purple} strokeWidth="1.5" strokeDasharray="6 6" fill="none"/>
        </svg>

        {/* ── HEADER ── */}
        <header className="header">
          <div className="logo-wrap">
            <img src="/spark.png" alt="SparkDB" className="logo-img" />
            <span className="logo-text">Spark<span>DB</span></span>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="pill">
            <span className="pill-dot" />
            <span className="pill-text">Coming Soon</span>
          </div>

          <h1 className="h1-black">Instant databases,</h1>
          <h1 className="h1-purple">ready in seconds</h1>

          <p className="subtext">
            Spin up isolated databases, connect instantly, and ship faster.<br />
            No infrastructure. No complexity. Just code.
          </p>

          {/* Form card */}
          <div className="form-card">
            <div className="input-row">
              <div className="input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
                <input
                  className="email-input"
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
                  onKeyDown={handleKey}
                  disabled={status === "loading" || status === "success"}
                />
              </div>
              <button
                className="join-btn"
                onClick={handleSubmit}
                disabled={status === "loading" || status === "success"}
              >
                {btnLabel}
                {status !== "loading" && status !== "success" && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </button>
            </div>

            {feedbackMsg && (
              <p className="feedback" style={{ color: feedbackMsg.color }}>{feedbackMsg.text}</p>
            )}

            <div className="badges">
              {[
                { label: "Early access",    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={purple} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
                { label: "Product updates", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={purple} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
                { label: "No spam",         icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={purple} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
              ].map((b) => (
                <div className="badge" key={b.label}>
                  <div className="badge-icon">{b.icon}</div>
                  <span className="badge-label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DASHBOARD MOCKUP ── */}
        <div className="mockup-wrap">
          <div className="mockup">
            <div className="win-chrome">
              {["#f87171","#fbbf24","#34d399"].map((c) => (
                <div key={c} className="chrome-dot" style={{ background: c }} />
              ))}
            </div>

            <div className="mockup-body">
              {/* Sidebar */}
              <aside className="sidebar">
                <div className="sidebar-logo">
                  <img src="/spark.png" alt="SparkDB" />
                  <span className="sidebar-logo-text">Spark<span>DB</span></span>
                </div>
                {[
                  { label: "Dashboard",   active: true,  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
                  { label: "Databases",   active: false, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
                  { label: "Connections", active: false, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
                  { label: "SDK & ORM",   active: false, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
                  { label: "Settings",    active: false, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
                ].map((item) => (
                  <div key={item.label} className={`nav-item${item.active ? " active" : ""}`}>
                    {item.icon}{item.label}
                  </div>
                ))}
              </aside>

              {/* Main dashboard */}
              <main className="dash-main">
                <div className="dash-topbar">
                  <span className="dash-title">Dashboard</span>
                  <button className="new-db-btn">
                    <span style={{ fontSize: 13 }}>+</span> New Database
                  </button>
                </div>

                <div className="stats-grid">
                  {[
                    { val: "15",     lbl: "Databases",    sub: "Running",    sc: "#22c55e" },
                    { val: "8",      lbl: "Connections",  sub: "Active",     sc: "#22c55e" },
                    { val: "99.9%",  lbl: "Uptime",       sub: "This Month", sc: textSub  },
                    { val: "320 ms", lbl: "Avg. Response", sub: "Time",      sc: textSub  },
                  ].map((s) => (
                    <div className="stat-cell" key={s.lbl}>
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-lbl">{s.lbl}</div>
                      <div className="stat-sub" style={{ color: s.sc }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="db-section-lbl">Your Databases</div>
                {[
                  { name: "users_db",  engine: "PostgreSQL", region: "us-east-1", color: "#4f6ef7", icon: "🐘" },
                  { name: "analytics", engine: "MongoDB",    region: "eu-west-1", color: "#22c55e", icon: "🍃" },
                  { name: "logs_db",   engine: "MySQL",      region: "us-east-1", color: "#f97316", icon: "🐬" },
                ].map((db) => (
                  <div className="db-row" key={db.name}>
                    <div className="db-icon-wrap" style={{ background: db.color + (d ? "22" : "18"), border: `1px solid ${db.color}30` }}>
                      {db.icon}
                    </div>
                    <span className="db-name">{db.name}</span>
                    <span className="db-engine">{db.engine}</span>
                    <span className="db-region">{db.region}</span>
                    <span className="db-pill">Running</span>
                    <button className="db-dots">⋮</button>
                  </div>
                ))}
              </main>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}