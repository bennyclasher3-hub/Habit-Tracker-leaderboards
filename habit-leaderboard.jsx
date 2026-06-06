import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --card: #1a1a24;
    --border: #2a2a38;
    --accent: #7fff6e;
    --accent2: #6e8fff;
    --gold: #ffd166;
    --silver: #c0c0d0;
    --bronze: #cd7f5e;
    --text: #f0f0f8;
    --muted: #8888aa;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px 80px;
  }

  .header {
    text-align: center;
    margin-bottom: 56px;
  }

  .header-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
    opacity: 0.9;
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(40px, 8vw, 72px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -2px;
    color: var(--text);
    margin-bottom: 16px;
  }

  .header h1 span {
    color: var(--accent);
    display: block;
  }

  .header-sub {
    color: var(--muted);
    font-size: 15px;
    max-width: 380px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .upload-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 36px;
    margin-bottom: 48px;
    position: relative;
    overflow: hidden;
  }

  .upload-card::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px; right: -1px;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent));
    border-radius: 20px 20px 0 0;
  }

  .upload-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .upload-title .dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 12px var(--accent);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .form-row { grid-template-columns: 1fr; }
  }

  .field label {
    display: block;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .field input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
  }

  .field input:focus {
    border-color: var(--accent);
  }

  .drop-zone {
    border: 2px dashed var(--border);
    border-radius: 14px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    margin-bottom: 20px;
    background: var(--surface);
  }

  .drop-zone:hover, .drop-zone.drag-over {
    border-color: var(--accent);
    background: rgba(127, 255, 110, 0.04);
  }

  .drop-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .drop-icon {
    font-size: 36px;
    margin-bottom: 12px;
    display: block;
  }

  .drop-text {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.5;
  }

  .drop-text strong {
    color: var(--accent);
    font-weight: 500;
  }

  .preview-img {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 10px;
    margin-bottom: 16px;
  }

  .submit-btn {
    width: 100%;
    background: var(--accent);
    color: #0a0a0f;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(127, 255, 110, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .analyzing-bar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 20px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--muted);
  }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .result-toast {
    background: rgba(127, 255, 110, 0.08);
    border: 1px solid rgba(127, 255, 110, 0.3);
    border-radius: 12px;
    padding: 16px 20px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
  }

  .result-score-big {
    font-family: 'Syne', sans-serif;
    font-size: 48px;
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 4px;
  }

  .leaderboard-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .leaderboard-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 800;
  }

  .count-badge {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 1px;
  }

  .leaderboard-empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
    border: 1px dashed var(--border);
    border-radius: 16px;
    font-size: 15px;
    line-height: 1.6;
  }

  .entry {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.15s, border-color 0.15s;
    animation: slideIn 0.4s ease both;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .entry:hover {
    transform: translateX(4px);
    border-color: rgba(127, 255, 110, 0.2);
  }

  .entry.rank-1 { border-color: rgba(255, 209, 102, 0.35); background: rgba(255, 209, 102, 0.04); }
  .entry.rank-2 { border-color: rgba(192, 192, 208, 0.3); }
  .entry.rank-3 { border-color: rgba(205, 127, 94, 0.3); }

  .rank-badge {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    width: 40px;
    text-align: center;
    flex-shrink: 0;
  }

  .entry-thumb {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid var(--border);
  }

  .entry-thumb-placeholder {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .entry-info {
    flex: 1;
    min-width: 0;
  }

  .entry-name {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entry-feedback {
    font-size: 12px;
    color: var(--muted);
    margin-top: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entry-score {
    text-align: right;
    flex-shrink: 0;
  }

  .score-num {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    line-height: 1;
  }

  .score-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
  }

  .score-bar-wrap {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    margin-top: 6px;
    width: 80px;
    overflow: hidden;
  }

  .score-bar {
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
    transition: width 1s ease;
  }

  .entry.rank-1 .score-num { color: var(--gold); }
  .entry.rank-1 .score-bar { background: var(--gold); }
  .entry.rank-2 .score-num { color: var(--silver); }
  .entry.rank-3 .score-num { color: var(--bronze); }

  .error-msg {
    color: #ff6e6e;
    font-size: 13px;
    margin-top: 10px;
    padding: 10px 14px;
    background: rgba(255, 110, 110, 0.08);
    border-radius: 8px;
    border: 1px solid rgba(255, 110, 110, 0.2);
  }
`;

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

async function scoreWithAI(base64Image, mediaType) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a habit tracker progress analyzer. When given an image of a habit tracker (physical or digital), analyze how complete it looks and return ONLY a JSON object with no extra text or markdown. JSON format: {"score": <number 1-100>, "feedback": "<one short encouraging sentence about their progress>", "habits_visible": <estimated count or null>}. Be generous and encouraging. If it's clearly not a habit tracker, give score 10 and say so in feedback.`,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Image }
          },
          { type: "text", text: "Analyze this habit tracker image and return the JSON score." }
        ]
      }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || "API error");
  }

  const data = await response.json();
  const text = data.content.map(b => b.text || "").join("").trim();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export default function HabitLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const fileRef = useRef();

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage.get("leaderboard-entries", true);
        if (stored?.value) {
          setEntries(JSON.parse(stored.value));
        }
      } catch (_) {}
      setStorageReady(true);
    })();
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !imageFile) {
      setError("Please enter your name and upload a photo.");
      return;
    }
    setError("");
    setLoading(true);
    setAnalyzing(true);
    setLastResult(null);

    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(imageFile);
      });

      const mediaType = imageFile.type || "image/jpeg";
      const result = await scoreWithAI(base64, mediaType);
      setLastResult(result);

      const newEntry = {
        id: Date.now(),
        name: name.trim(),
        handle: handle.trim() || null,
        score: result.score,
        feedback: result.feedback,
        thumb: imagePreview,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
      };

      const updated = [...entries, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

      setEntries(updated);
      await window.storage.set("leaderboard-entries", JSON.stringify(updated), true);

      // Reset form
      setName("");
      setHandle("");
      setImageFile(null);
      setImagePreview(null);
    } catch (e) {
      setError("Could not analyze your image. Make sure it's a clear photo of your habit tracker. Error: " + e.message);
    }

    setLoading(false);
    setAnalyzing(false);
  };

  const scoreColor = (s) => {
    if (s >= 80) return "#7fff6e";
    if (s >= 60) return "#6e8fff";
    if (s >= 40) return "#ffd166";
    return "#ff6e6e";
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="header-eyebrow">✦ Community Progress Wall</div>
          <h1>Habit<span>Leaderboard</span></h1>
          <p className="header-sub">Upload your completed habit tracker and let AI score your progress. Compete with the community.</p>
        </div>

        {/* Upload Card */}
        <div className="upload-card">
          <div className="upload-title"><span className="dot" />Submit Your Progress</div>
          <div className="form-row">
            <div className="field">
              <label>Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Chen" />
            </div>
            <div className="field">
              <label>Username (optional)</label>
              <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@yourhandle" />
            </div>
          </div>

          <div
            className={`drop-zone${dragOver ? " drag-over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
            {imagePreview ? (
              <img src={imagePreview} className="preview-img" alt="preview" />
            ) : (
              <>
                <span className="drop-icon">📸</span>
                <div className="drop-text">
                  <strong>Click or drag</strong> your habit tracker photo here<br />
                  JPG, PNG, or HEIC · AI will score your progress
                </div>
              </>
            )}
          </div>

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="spinner" /> Analyzing...</> : <>⚡ Submit & Score My Progress</>}
          </button>

          {error && <div className="error-msg">{error}</div>}

          {analyzing && (
            <div className="analyzing-bar">
              <div className="spinner" />
              AI is analyzing your habit tracker…
            </div>
          )}

          {lastResult && !loading && (
            <div className="result-toast">
              <div className="result-score-big" style={{ color: scoreColor(lastResult.score) }}>
                {lastResult.score}<span style={{ fontSize: 20, opacity: 0.6 }}>/100</span>
              </div>
              <div style={{ marginTop: 8, lineHeight: 1.6 }}>{lastResult.feedback}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                You're on the leaderboard! 🎉
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div>
          <div className="leaderboard-header">
            <div className="leaderboard-title">🏆 Top Trackers</div>
            <div className="count-badge">{entries.length} submissions</div>
          </div>

          {entries.length === 0 ? (
            <div className="leaderboard-empty">
              No submissions yet.<br />Be the first to claim the #1 spot! 🔥
            </div>
          ) : (
            entries.map((e, i) => (
              <div key={e.id} className={`entry${i < 3 ? ` rank-${i + 1}` : ""}`} style={{ animationDelay: `${i * 40}ms` }}>
                <div className="rank-badge" style={{ color: i === 0 ? "var(--gold)" : i === 1 ? "var(--silver)" : i === 2 ? "var(--bronze)" : "var(--muted)" }}>
                  {i < 3 ? RANK_MEDALS[i] : `#${i + 1}`}
                </div>
                {e.thumb
                  ? <img src={e.thumb} className="entry-thumb" alt={e.name} />
                  : <div className="entry-thumb-placeholder">📋</div>
                }
                <div className="entry-info">
                  <div className="entry-name">{e.name}{e.handle && <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>{e.handle}</span>}</div>
                  <div className="entry-feedback">{e.feedback}</div>
                </div>
                <div className="entry-score">
                  <div className="score-num" style={{ color: scoreColor(e.score) }}>{e.score}</div>
                  <div className="score-label">score</div>
                  <div className="score-bar-wrap">
                    <div className="score-bar" style={{ width: `${e.score}%`, background: scoreColor(e.score) }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
