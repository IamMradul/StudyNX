<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>StudyNX – Smart Study Tracker</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #05071A;
    --surface: #0C0F2A;
    --surface2: #111535;
    --border: rgba(120,130,255,0.12);
    --accent: #6C63FF;
    --accent2: #00E5C3;
    --accent3: #FF6B9D;
    --text: #F0F2FF;
    --muted: #8890B8;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* ── NOISE OVERLAY ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* ── NAV ── */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2.5rem;
    background: rgba(5, 7, 26, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
    text-decoration: none;
  }

  .nav-logo span { color: var(--accent); }

  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--text); }

  .nav-cta {
    background: var(--accent);
    color: #fff !important;
    padding: 0.45rem 1.1rem;
    border-radius: 8px;
    font-weight: 500;
    transition: opacity 0.2s !important;
  }
  .nav-cta:hover { opacity: 0.85; }

  /* ── SECTIONS ── */
  section { position: relative; z-index: 1; }

  .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }

  /* ── HERO ── */
  #hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 5rem;
    overflow: hidden;
  }

  .hero-glow {
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%);
    top: -100px; left: 50%; transform: translateX(-50%);
    pointer-events: none;
  }

  .hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    width: 100%;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(108,99,255,0.12);
    border: 1px solid rgba(108,99,255,0.3);
    color: #A89FFF;
    font-size: 0.78rem;
    font-weight: 500;
    padding: 0.3rem 0.85rem;
    border-radius: 100px;
    margin-bottom: 1.5rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent2);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.4); }
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 1.2rem;
  }

  h1 .gradient {
    background: linear-gradient(135deg, #6C63FF 0%, #00E5C3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    color: var(--muted);
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 480px;
  }

  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 0 24px rgba(108,99,255,0.35);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 32px rgba(108,99,255,0.5); }

  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-outline:hover { border-color: rgba(120,130,255,0.4); background: rgba(108,99,255,0.06); }

  /* ── HERO MOCKUP ── */
  .hero-mockup {
    position: relative;
  }

  .mockup-frame {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  }

  .mockup-bar {
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid var(--border);
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-r { background: #FF5F57; }
  .dot-y { background: #FEBC2E; }
  .dot-g { background: #28C840; }

  .mockup-body { padding: 1.2rem; }

  /* heatmap mini */
  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(26, 1fr);
    gap: 3px;
    margin-bottom: 1rem;
  }

  .hm-cell {
    aspect-ratio: 1;
    border-radius: 2px;
    background: rgba(108,99,255,0.08);
  }
  .hm-cell.l1 { background: rgba(108,99,255,0.2); }
  .hm-cell.l2 { background: rgba(108,99,255,0.4); }
  .hm-cell.l3 { background: rgba(108,99,255,0.65); }
  .hm-cell.l4 { background: rgba(108,99,255,0.9); }

  .mock-stats {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 8px;
    margin-bottom: 1rem;
  }

  .mock-stat {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 10px;
  }

  .mock-stat-val {
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
  }

  .mock-stat-lbl {
    font-size: 0.65rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .mock-bars { display: flex; flex-direction: column; gap: 6px; }

  .mock-bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    color: var(--muted);
  }

  .mock-bar-track {
    flex: 1;
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
  }

  .mock-bar-fill {
    height: 100%;
    border-radius: 3px;
  }

  .mock-bar-pct { min-width: 28px; text-align: right; }

  /* ── STATS STRIP ── */
  .stats-strip {
    padding: 3rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    text-align: center;
  }

  .stat-item-val {
    font-family: var(--font-display);
    font-size: 2.4rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-item-lbl {
    color: var(--muted);
    font-size: 0.85rem;
    margin-top: 0.2rem;
  }

  /* ── SECTION HEADERS ── */
  .section-header { text-align: center; margin-bottom: 3.5rem; }

  .section-tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent2);
    margin-bottom: 0.75rem;
  }

  h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  .section-sub {
    color: var(--muted);
    font-size: 1.05rem;
    max-width: 520px;
    margin: 0 auto;
  }

  /* ── FEATURES ── */
  #features { padding: 6rem 0; }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.75rem;
    transition: border-color 0.3s, transform 0.3s;
  }

  .feature-card:hover {
    border-color: rgba(108,99,255,0.35);
    transform: translateY(-4px);
  }

  .feature-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .ic-purple { background: rgba(108,99,255,0.12); }
  .ic-teal { background: rgba(0,229,195,0.1); }
  .ic-pink { background: rgba(255,107,157,0.1); }
  .ic-amber { background: rgba(255,180,50,0.1); }
  .ic-blue { background: rgba(56,180,255,0.1); }
  .ic-green { background: rgba(80,220,130,0.1); }

  .feature-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  .feature-desc { color: var(--muted); font-size: 0.9rem; line-height: 1.65; }

  /* ── HOW IT WORKS ── */
  #how { padding: 6rem 0; background: linear-gradient(180deg, transparent, rgba(108,99,255,0.04), transparent); }

  .steps { display: flex; flex-direction: column; gap: 0; max-width: 780px; margin: 0 auto; }

  .step {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 1.5rem;
    align-items: start;
    padding: 2rem 0;
    border-bottom: 1px solid var(--border);
  }

  .step:last-child { border-bottom: none; }

  .step-num {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(108,99,255,0.12);
    border: 1px solid rgba(108,99,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1rem;
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 4px;
  }

  .step-title {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.4rem;
  }

  .step-desc { color: var(--muted); font-size: 0.95rem; }

  /* ── TECH STACK ── */
  #tech { padding: 6rem 0; }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .tech-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    transition: border-color 0.2s;
  }

  .tech-card:hover { border-color: rgba(108,99,255,0.35); }

  .tech-logo {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .tech-name {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text);
  }

  .tech-role { color: var(--muted); font-size: 0.75rem; }

  /* ── ARCHITECTURE ── */
  #arch { padding: 6rem 0; }

  .arch-diagram {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2.5rem;
    max-width: 780px;
    margin: 0 auto;
  }

  .arch-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .arch-box {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text);
    text-align: center;
    min-width: 130px;
  }

  .arch-box.accent { border-color: rgba(108,99,255,0.5); background: rgba(108,99,255,0.08); color: #A89FFF; }
  .arch-box.teal { border-color: rgba(0,229,195,0.4); background: rgba(0,229,195,0.06); color: var(--accent2); }
  .arch-box.pink { border-color: rgba(255,107,157,0.4); background: rgba(255,107,157,0.06); color: var(--accent3); }

  .arch-arrow {
    color: var(--muted);
    font-size: 1.2rem;
  }

  .arch-divider {
    height: 1px;
    background: var(--border);
    margin: 1.25rem 0;
  }

  .arch-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    text-align: center;
    margin-bottom: 0.75rem;
  }

  /* ── SETUP ── */
  #setup { padding: 6rem 0; }

  .setup-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

  .code-block {
    background: #080B20;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 1rem;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
  }

  .code-lang {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }

  .code-dots { display: flex; gap: 5px; }

  pre {
    padding: 1.25rem 1.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.82rem;
    line-height: 1.7;
    color: #B4C2FF;
    overflow-x: auto;
    white-space: pre;
  }

  .c-green { color: #50EDA0; }
  .c-yellow { color: #FFE082; }
  .c-pink2 { color: #FF9DB8; }
  .c-blue2 { color: #82CFFF; }
  .c-gray2 { color: #6B7AAA; }

  /* ── ENV VARS ── */
  .env-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }

  .env-table th {
    text-align: left;
    padding: 0.65rem 1rem;
    color: var(--muted);
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
  }

  .env-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }

  .env-table tr:last-child td { border-bottom: none; }

  .env-key { font-family: monospace; font-size: 0.8rem; color: var(--accent2); }
  .env-desc { color: var(--muted); font-size: 0.82rem; }

  /* ── VERTICAL ── */
  #vertical { padding: 6rem 0; }

  .vertical-card {
    background: linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,229,195,0.05));
    border: 1px solid rgba(108,99,255,0.25);
    border-radius: 20px;
    padding: 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .vertical-tag {
    display: inline-block;
    background: rgba(108,99,255,0.15);
    border: 1px solid rgba(108,99,255,0.3);
    color: #A89FFF;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.85rem;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 1rem;
  }

  .vertical-title {
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 0.75rem;
    line-height: 1.2;
  }

  .vertical-desc { color: var(--muted); font-size: 0.95rem; line-height: 1.7; }

  .vertical-points { display: flex; flex-direction: column; gap: 1rem; }

  .vertical-point {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .vp-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(108,99,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .vp-text { font-size: 0.9rem; color: var(--muted); }
  .vp-text strong { color: var(--text); font-weight: 500; }

  /* ── FOOTER ── */
  footer {
    padding: 3rem 0;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .footer-logo {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  .footer-logo span { color: var(--accent); }

  .footer-desc { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem; }

  .footer-links { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; }

  .footer-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.88rem;
    transition: color 0.2s;
  }

  .footer-links a:hover { color: var(--accent); }

  .footer-copy { color: var(--muted); font-size: 0.8rem; opacity: 0.6; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-up { animation: fadeUp 0.7s ease both; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.35s; }
  .delay-4 { animation-delay: 0.5s; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .hero-inner { grid-template-columns: 1fr; gap: 2.5rem; }
    .features-grid { grid-template-columns: 1fr 1fr; }
    .tech-grid { grid-template-columns: 1fr 1fr; }
    .setup-grid { grid-template-columns: 1fr; }
    .vertical-card { grid-template-columns: 1fr; gap: 1.5rem; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    #tests .container > div[style*="grid-template-columns:1fr 1fr"] { grid-template-columns: 1fr !important; }
    #checklist .container > div[style*="grid-template-columns:1fr 1fr"] { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 600px) {
    nav { padding: 0.75rem 1.25rem; }
    .nav-links { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .tech-grid { grid-template-columns: 1fr 1fr; }
    h1 { font-size: 2.2rem; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo">Study<span>NX</span></a>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#how">How it works</a></li>
    <li><a href="#tech">Tech Stack</a></li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#tests">Tests</a></li>
    <li><a href="https://github.com/IamMradul/StudyNX" target="_blank" class="nav-cta">GitHub →</a></li>
  </ul>
</nav>

<!-- HERO -->
<section id="hero">
  <div class="hero-glow"></div>
  <div class="container">
    <div class="hero-inner">
      <div>
        <div class="badge fade-up"><span class="badge-dot"></span> Student Productivity Assistant</div>
        <h1 class="fade-up delay-1">Track. Analyze.<br /><span class="gradient">Master your study.</span></h1>
        <p class="hero-desc fade-up delay-2">StudyNX is an AI-powered study tracker that visualizes your consistency, coaches you with Gemini AI, and syncs your sessions to Google Calendar — all in one place.</p>
        <div class="hero-actions fade-up delay-3">
          <a href="https://studynx.vercel.app/" target="_blank" class="btn btn-primary">🚀 Live Demo</a>
          <a href="https://github.com/IamMradul/StudyNX" target="_blank" class="btn btn-outline">⭐ GitHub</a>
        </div>
      </div>

      <!-- MOCK DASHBOARD -->
      <div class="hero-mockup fade-up delay-4">
        <div class="mockup-frame">
          <div class="mockup-bar">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
            <span style="margin-left:8px; font-size:0.7rem; color:var(--muted);">StudyNX — Dashboard</span>
          </div>
          <div class="mockup-body">
            <div style="font-size:0.7rem; color:var(--muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.07em;">Activity Heatmap</div>
            <div class="heatmap-grid" id="heatmap"></div>
            <div class="mock-stats">
              <div class="mock-stat"><div class="mock-stat-val">47</div><div class="mock-stat-lbl">Day Streak</div></div>
              <div class="mock-stat"><div class="mock-stat-val">128h</div><div class="mock-stat-lbl">This Month</div></div>
              <div class="mock-stat"><div class="mock-stat-val">6.4</div><div class="mock-stat-lbl">Hrs Today</div></div>
            </div>
            <div style="font-size:0.7rem; color:var(--muted); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.07em;">Subject Progress</div>
            <div class="mock-bars">
              <div class="mock-bar-row">
                <span style="min-width:60px">Mathematics</span>
                <div class="mock-bar-track"><div class="mock-bar-fill" style="width:82%;background:var(--accent);"></div></div>
                <span class="mock-bar-pct">82%</span>
              </div>
              <div class="mock-bar-row">
                <span style="min-width:60px">Physics</span>
                <div class="mock-bar-track"><div class="mock-bar-fill" style="width:64%;background:var(--accent2);"></div></div>
                <span class="mock-bar-pct">64%</span>
              </div>
              <div class="mock-bar-row">
                <span style="min-width:60px">Chemistry</span>
                <div class="mock-bar-track"><div class="mock-bar-fill" style="width:45%;background:var(--accent3);"></div></div>
                <span class="mock-bar-pct">45%</span>
              </div>
              <div class="mock-bar-row">
                <span style="min-width:60px">English</span>
                <div class="mock-bar-track"><div class="mock-bar-fill" style="width:91%;background:#50EDA0;"></div></div>
                <span class="mock-bar-pct">91%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="stats-strip">
  <div class="container">
    <div class="stats-grid">
      <div><div class="stat-item-val">7+</div><div class="stat-item-lbl">Google Services integrated</div></div>
      <div><div class="stat-item-val">AI</div><div class="stat-item-lbl">Powered by Gemini 1.5 Flash</div></div>
      <div><div class="stat-item-val">100%</div><div class="stat-item-lbl">Context-aware coaching</div></div>
      <div><div class="stat-item-val">0</div><div class="stat-item-lbl">Motivational blockers</div></div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section id="features">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">✦ Features</span>
      <h2>Everything a student needs</h2>
      <p class="section-sub">From visual habit tracking to AI-generated study plans — StudyNX covers it all.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon ic-purple">🔥</div>
        <div class="feature-title">GitHub-style Heatmap</div>
        <div class="feature-desc">Visualize your daily study consistency over the year in a colour-coded activity grid — spot patterns and protect your streak.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon ic-teal">🤖</div>
        <div class="feature-title">Gemini AI Coach</div>
        <div class="feature-desc">Your personal study assistant powered by Gemini 1.5 Flash — analyses your actual data and gives context-aware advice, not generic tips.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon ic-pink">📅</div>
        <div class="feature-title">Google Calendar Sync</div>
        <div class="feature-desc">Study sessions automatically create Google Calendar events. Use "Plan Tomorrow" to push an AI-generated schedule straight to your calendar.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon ic-amber">📊</div>
        <div class="feature-title">Subject Analytics</div>
        <div class="feature-desc">Track hours, completion percentage, and targets per subject. Circular progress bars and trend charts make weak spots instantly obvious.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon ic-blue">🔐</div>
        <div class="feature-title">Supabase Auth</div>
        <div class="feature-desc">Secure email/password login, magic link, and Google OAuth — with RLS-enforced data isolation per user, backed by Supabase.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon ic-green">⚡</div>
        <div class="feature-title">Streak & Nudge System</div>
        <div class="feature-desc">Gemini detects when your streak is at risk and sends personalised nudges to keep you on track before the habit breaks.</div>
      </div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="how">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">✦ How it works</span>
      <h2>Simple by design</h2>
      <p class="section-sub">Log, analyse, improve — StudyNX turns scattered study sessions into a clear picture of your progress.</p>
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-num">01</div>
        <div>
          <div class="step-title">Log your study session</div>
          <div class="step-desc">Check off subjects studied each day using the dashboard checkbox system. StudyNX records the session, updates your heatmap instantly, and creates a matching Google Calendar event in the background.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">02</div>
        <div>
          <div class="step-title">Gemini builds your context</div>
          <div class="step-desc">Before every AI response, StudyNX compiles a live context object — your streak, total hours, weak subjects, strong subjects, and recent patterns — and injects it into every Gemini prompt so advice is always personal.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">03</div>
        <div>
          <div class="step-title">Get personalised coaching</div>
          <div class="step-desc">Ask the AI assistant anything. It will identify which subjects need attention, suggest realistic study blocks, motivate you when your streak is slipping, and answer questions using your actual study history.</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">04</div>
        <div>
          <div class="step-title">Plan tomorrow with one click</div>
          <div class="step-desc">Hit "Plan Tomorrow" — Gemini generates a structured schedule, StudyNX converts it to Google Calendar events, and syncs them instantly. Upcoming planned sessions also appear back inside the dashboard.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- VERTICAL -->
<section id="vertical">
  <div class="container">
    <div class="vertical-card">
      <div>
        <div class="vertical-tag">Challenge Vertical</div>
        <div class="vertical-title">Student Productivity Assistant</div>
        <p class="vertical-desc">StudyNX was built for the Google Antigravity Hackathon under the Student Productivity vertical — combining AI coaching, Google Services, and smart habit tracking into a real-world tool students actually want to use.</p>
      </div>
      <div class="vertical-points">
        <div class="vertical-point">
          <div class="vp-icon">🧠</div>
          <div class="vp-text"><strong>Smart assistant</strong> — Gemini understands your study history and responds with personalised, context-aware guidance.</div>
        </div>
        <div class="vertical-point">
          <div class="vp-icon">🌐</div>
          <div class="vp-text"><strong>Google Services</strong> — Gemini API + Google Calendar API + Google OAuth working together meaningfully, not as bolt-ons.</div>
        </div>
        <div class="vertical-point">
          <div class="vp-icon">✅</div>
          <div class="vp-text"><strong>Real-world usability</strong> — clean UI, persistent Supabase storage, responsive design, and WCAG-compliant accessibility.</div>
        </div>
        <div class="vertical-point">
          <div class="vp-icon">🧪</div>
          <div class="vp-text"><strong>Tested & maintainable</strong> — Vitest unit tests covering core logic; clean TypeScript with strict typing throughout.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TECH STACK -->
<section id="tech">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">✦ Tech Stack</span>
      <h2>Built with modern tools</h2>
      <p class="section-sub">Every tool chosen for a reason — fast, type-safe, and production-ready.</p>
    </div>
    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-logo ic-blue" style="font-size:1.2rem;">⚛️</div>
        <div><div class="tech-name">React</div><div class="tech-role">UI Framework</div></div>
      </div>
      <div class="tech-card">
        <div class="tech-logo ic-blue" style="color:#3178C6;font-weight:700;font-size:0.75rem;">TS</div>
        <div><div class="tech-name">TypeScript</div><div class="tech-role">Type Safety</div></div>
      </div>
      <div class="tech-card">
        <div class="tech-logo ic-purple" style="font-size:1.1rem;">⚡</div>
        <div><div class="tech-name">Vite</div><div class="tech-role">Build Tool</div></div>
      </div>
      <div class="tech-card">
        <div class="tech-logo ic-teal" style="font-size:1.1rem;">🎨</div>
        <div><div class="tech-name">Tailwind CSS</div><div class="tech-role">Styling</div></div>
      </div>
      <div class="tech-card">
        <div class="tech-logo ic-green" style="font-size:1.1rem;">🗄️</div>
        <div><div class="tech-name">Supabase</div><div class="tech-role">Auth & Database</div></div>
      </div>
      <div class="tech-card">
        <div class="tech-logo ic-pink" style="font-size:1.1rem;">🤖</div>
        <div><div class="tech-name">Gemini API</div><div class="tech-role">AI Assistant</div></div>
      </div>
      <div class="tech-card">
        <div class="tech-logo ic-amber" style="font-size:1.1rem;">📅</div>
        <div><div class="tech-name">Google Calendar</div><div class="tech-role">Session Sync</div></div>
      </div>
      <div class="tech-card">
        <div class="tech-logo ic-blue" style="font-size:1.1rem;">🧪</div>
        <div><div class="tech-name">Vitest</div><div class="tech-role">Testing</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ARCHITECTURE -->
<section id="arch">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">✦ Architecture</span>
      <h2>System overview</h2>
      <p class="section-sub">How the pieces connect under the hood.</p>
    </div>
    <div class="arch-diagram">
      <div class="arch-label">User Interface</div>
      <div class="arch-row">
        <div class="arch-box accent">React + TypeScript</div>
        <div class="arch-arrow">↕</div>
        <div class="arch-box accent">Tailwind CSS</div>
      </div>
      <div class="arch-divider"></div>
      <div class="arch-label">AI Layer</div>
      <div class="arch-row">
        <div class="arch-box teal">Context Builder</div>
        <div class="arch-arrow">→</div>
        <div class="arch-box teal">Gemini 1.5 Flash</div>
        <div class="arch-arrow">→</div>
        <div class="arch-box teal">AI Response Panel</div>
      </div>
      <div class="arch-divider"></div>
      <div class="arch-label">Google Services</div>
      <div class="arch-row">
        <div class="arch-box pink">Google OAuth</div>
        <div class="arch-arrow">+</div>
        <div class="arch-box pink">Calendar API</div>
        <div class="arch-arrow">+</div>
        <div class="arch-box pink">Gemini API</div>
      </div>
      <div class="arch-divider"></div>
      <div class="arch-label">Data Layer</div>
      <div class="arch-row">
        <div class="arch-box">Supabase Auth</div>
        <div class="arch-arrow">↔</div>
        <div class="arch-box">user_progress table</div>
        <div class="arch-arrow">↔</div>
        <div class="arch-box">RLS Policies</div>
      </div>
    </div>
  </div>
</section>

<!-- SETUP -->
<section id="setup">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">✦ Local Setup</span>
      <h2>Get it running locally</h2>
      <p class="section-sub">Up and running in under 5 minutes.</p>
    </div>
    <div class="setup-grid">
      <div>
        <div class="code-block">
          <div class="code-header">
            <span class="code-lang">Terminal</span>
            <div class="code-dots">
              <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            </div>
          </div>
          <pre><span class="c-gray2"># 1. Clone the repo</span>
<span class="c-green">git</span> clone https://github.com/IamMradul/StudyNX.git
<span class="c-blue2">cd</span> StudyNX

<span class="c-gray2"># 2. Install dependencies</span>
<span class="c-green">npm</span> install

<span class="c-gray2"># 3. Copy env example</span>
<span class="c-green">cp</span> .env.example .env.local

<span class="c-gray2"># 4. Add your API keys (see table)</span>

<span class="c-gray2"># 5. Run Supabase SQL schema</span>
<span class="c-gray2"># → supabase/user_progress.sql</span>

<span class="c-gray2"># 6. Start dev server</span>
<span class="c-green">npm</span> run dev

<span class="c-gray2"># 7. Run tests</span>
<span class="c-green">npm</span> run test</pre>
        </div>
      </div>
      <div>
        <div class="code-block">
          <div class="code-header">
            <span class="code-lang">.env.local</span>
            <div class="code-dots">
              <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            </div>
          </div>
          <pre><span class="c-gray2"># Supabase</span>
<span class="c-yellow">VITE_SUPABASE_URL</span>=<span class="c-pink2">https://xxx.supabase.co</span>
<span class="c-yellow">VITE_SUPABASE_ANON_KEY</span>=<span class="c-pink2">your-anon-key</span>

<span class="c-gray2"># Google</span>
<span class="c-yellow">VITE_GOOGLE_CLIENT_ID</span>=<span class="c-pink2">xxx.apps.googleusercontent.com</span>
<span class="c-yellow">VITE_GOOGLE_CALENDAR_ID</span>=<span class="c-pink2">primary</span>

<span class="c-gray2"># Gemini AI</span>
<span class="c-yellow">VITE_GEMINI_API_KEY</span>=<span class="c-pink2">your-gemini-api-key</span>
<span class="c-yellow">VITE_GEMINI_MODEL</span>=<span class="c-pink2">gemini-1.5-flash</span></pre>
        </div>

        <div style="margin-top:1rem; background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden;">
          <table class="env-table">
            <thead><tr><th>Variable</th><th>Where to get it</th></tr></thead>
            <tbody>
              <tr><td><span class="env-key">SUPABASE_URL</span></td><td><span class="env-desc">Supabase Dashboard → Project Settings</span></td></tr>
              <tr><td><span class="env-key">GOOGLE_CLIENT_ID</span></td><td><span class="env-desc">Google Cloud Console → Credentials</span></td></tr>
              <tr><td><span class="env-key">GEMINI_API_KEY</span></td><td><span class="env-desc">Google AI Studio → Get API Key</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TESTS -->
<section id="tests" style="padding:6rem 0;background:linear-gradient(180deg,transparent,rgba(0,229,195,0.03),transparent);">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">✦ Testing</span>
      <h2>13 tests. All passing.</h2>
      <p class="section-sub">Core logic is validated with Vitest — session tracking, Gemini prompt building, and subject progress calculations.</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start;">

      <!-- Terminal output -->
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">npm run test — output</span>
          <div class="code-dots">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
          </div>
        </div>
        <pre><span class="c-gray2"> RUN  v3.2.4 D:/Project/StudyNX</span>

<span class="c-green"> ✓</span> tests/studyLogic.test.ts    <span class="c-gray2">(4 tests) 2ms</span>
<span class="c-green"> ✓</span> tests/geminiPrompt.test.ts  <span class="c-gray2">(3 tests) 2ms</span>
<span class="c-green"> ✓</span> tests/sessionLog.test.ts    <span class="c-gray2">(2 tests) 2ms</span>
<span class="c-green"> ✓</span> src/lib/studyLogic.test.ts  <span class="c-gray2">(4 tests) 10ms</span>

<span class="c-green"> Test Files  4 passed (4)</span>
<span class="c-green">      Tests  13 passed (13)</span>
<span class="c-gray2">   Start at  15:31:05</span>
<span class="c-gray2">   Duration  400ms</span></pre>
      </div>

      <!-- Test breakdown cards -->
      <div style="display:flex;flex-direction:column;gap:1rem;">

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;">
            <div style="font-weight:600;font-size:0.9rem;color:var(--text);">studyLogic.test.ts</div>
            <span style="background:rgba(0,229,195,0.1);color:var(--accent2);font-size:0.7rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:100px;border:1px solid rgba(0,229,195,0.25);">4 passed</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.45rem;">
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> returns correct progress percentage</div>
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> does not exceed 100%</div>
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> returns 0 for empty log</div>
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> counts consecutive days correctly</div>
          </div>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;">
            <div style="font-weight:600;font-size:0.9rem;color:var(--text);">geminiPrompt.test.ts</div>
            <span style="background:rgba(0,229,195,0.1);color:var(--accent2);font-size:0.7rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:100px;border:1px solid rgba(0,229,195,0.25);">3 passed</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.45rem;">
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> includes total hours in context</div>
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> includes streak in context</div>
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> includes weak subjects in context</div>
          </div>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;">
            <div style="font-weight:600;font-size:0.9rem;color:var(--text);">sessionLog.test.ts</div>
            <span style="background:rgba(0,229,195,0.1);color:var(--accent2);font-size:0.7rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:100px;border:1px solid rgba(0,229,195,0.25);">2 passed</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.45rem;">
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> adds a session to the log</div>
            <div style="font-size:0.8rem;color:var(--muted);display:flex;align-items:center;gap:0.5rem;"><span style="color:var(--accent2);font-size:0.75rem;">✓</span> does not add duplicate sessions</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<!-- SUBMISSION CHECKLIST -->
<section id="checklist" style="padding:6rem 0;">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">✦ Submission Status</span>
      <h2>Hackathon ready ✓</h2>
      <p class="section-sub">Every evaluation criteria addressed — nothing left on the checklist.</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:900px;margin:0 auto;">

      <!-- Rules -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.75rem;">
        <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem;display:flex;align-items:center;gap:0.6rem;">
          <span style="font-size:1rem;">📋</span> Submission Rules
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Public GitHub repository</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Single branch (main only)</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Repository size under 1 MB</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">README with vertical, approach, logic</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">.env.example committed (no real keys)</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Live demo deployed on Vercel</span>
          </div>
        </div>
      </div>

      <!-- Evaluation criteria -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.75rem;">
        <div style="font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem;display:flex;align-items:center;gap:0.6rem;">
          <span style="font-size:1rem;">🏆</span> Evaluation Criteria
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Code quality — TypeScript, clean structure</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Security — RLS policies, no exposed keys</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Testing — 13 Vitest unit tests passing</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Google Services — Gemini + Calendar + OAuth</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Smart assistant — context-aware Gemini AI</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;">
            <span style="color:var(--accent2);font-size:1rem;flex-shrink:0;">✅</span>
            <span style="color:var(--muted);">Accessibility — aria-labels, WCAG AA contrast</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Final badge -->
    <div style="text-align:center;margin-top:3rem;">
      <div style="display:inline-flex;align-items:center;gap:1rem;background:linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,229,195,0.08));border:1px solid rgba(108,99,255,0.3);border-radius:100px;padding:0.85rem 2rem;">
        <span style="font-size:1.2rem;">🚀</span>
        <span style="font-family:var(--font-display);font-weight:700;font-size:1rem;color:var(--text);">Submission Ready</span>
        <span style="width:8px;height:8px;border-radius:50%;background:var(--accent2);animation:pulse 2s infinite;display:inline-block;"></span>
      </div>
    </div>

  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-logo">Study<span>NX</span></div>
    <div class="footer-desc">Smart Study Tracker · Built for the Google Antigravity Hackathon</div>
    <div class="footer-links">
      <a href="https://studynx.vercel.app/" target="_blank">Live Demo</a>
      <a href="https://github.com/IamMradul/StudyNX" target="_blank">GitHub</a>
      <a href="https://github.com/IamMradul/StudyNX/blob/main/README.md" target="_blank">README</a>
      <a href="https://github.com/IamMradul" target="_blank">Author</a>
    </div>
    <div class="footer-copy">Built by Mradul Gupta · MIT License</div>
  </div>
</footer>

<script>
  const hm = document.getElementById('heatmap');
  const levels = ['','l1','l1','l2','l2','l3','l3','l4'];
  const pattern = [0,0,1,2,3,4,3,2,1,0,0,1,3,4,4,3,2,1,0,1,2,3,4,4,3,2,
                   1,0,0,2,3,4,3,2,0,0,1,2,4,4,3,1,0,0,1,3,4,4,2,1,0,0,
                   2,3,3,2,1,0,0,1,2,3,4,3,2,1,0,1,3,4,4,3,1,0,0,0,2,3,
                   4,3,2,1,0,0,1,2,3,4,3,1,0,0,1,2,4,4,3,2,1,0,0,2,3,4,
                   4,3,2,1,0,0,1,3,4,4,3,2,0,0,1,2,3,4,3,1,0,0,0,2,4,4,
                   3,2,1,0,0,1,2,3,4,4,3,1,0,0,1,3,4,3,2,1,0,0,2,3,4,4,
                   3,2,1,0,0,1,2,4,4,3,2,0,0,1,3,4,4,3,1,0,0,2,3,4,3,2,
                   1,0,0,0,1,3,4,4,3,2,1,0,0,2,4,4,3,2,1,0,0,1,2,3,4,3];

  for(let i=0;i<182;i++){
    const cell = document.createElement('div');
    cell.className = 'hm-cell ' + (levels[pattern[i % pattern.length]] || '');
    hm.appendChild(cell);
  }
</script>
</body>
</html>