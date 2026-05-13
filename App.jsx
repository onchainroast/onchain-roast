import { useState } from "react";

// ─── Wallet Data ────────────────────────────────────────────────
async function getWalletData(addr) {
  try {
    const [b, t] = await Promise.all([
      fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest`).then(r => r.json()),
      fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc`).then(r => r.json())
    ]);
    if (b.status !== "1") throw new Error("API error");
    return { balance: b.result, txs: Array.isArray(t.result) ? t.result : [], real: true };
  } catch {
    // Fallback demo data
    return {
      balance: String(Math.floor((Math.random() * 3.5 + 0.1) * 1e18)),
      txs: Array(Math.floor(Math.random() * 60 + 15)).fill(0).map(() => ({
        gasUsed: String(Math.floor(Math.random() * 80000 + 21000)),
        gasPrice: String(Math.floor(Math.random() * 40 + 8) * 1e9),
        from: addr.toLowerCase(),
        value: String(Math.floor(Math.random() * 1e17))
      })),
      real: false
    };
  }
}

// ─── Roast Generator ─────────────────────────────────────────────
async function generateRoast(addr, data, lang) {
  const eth = (parseInt(data.balance || "0") / 1e18).toFixed(4);
  const txCount = data.txs.length;
  let gasEth = 0, outgoing = 0;
  data.txs.forEach(tx => {
    if (tx.gasUsed && tx.gasPrice) gasEth += parseInt(tx.gasUsed) * parseInt(tx.gasPrice) / 1e18;
    if (tx.from?.toLowerCase() === addr.toLowerCase()) outgoing++;
  });
  const incoming = txCount - outgoing;

  const prompt = lang === "fa" ?
    `تو یه روستر کریپتو خنده‌دار و بی‌رحمی. فقط JSON برگردون، هیچ چیز اضافه‌ای نفرست.

داده‌های wallet:
- موجودی: ${eth} ETH
- تعداد تراکنش: ${txCount}
- ارسالی: ${outgoing} | دریافتی: ${incoming}
- گس سوخته: ${gasEth.toFixed(4)} ETH
${!data.real ? "- داده‌های دمو (برای تست)" : ""}

JSON:
{
  "archetype": "نوع تریدر خنده‌دار به فارسی (مثل: آقای FOMO، استاد کف‌خری، شاه هولد، مافیای گس)",
  "archetypeEmoji": "یه ایموجی",
  "degenScore": عدد 1 تا 10,
  "roast": "2-3 جمله روست فارسی بی‌رحم و خنده‌دار - از کلمات هولد، دامپ، پامپ، فومو، لیکویید، rug استفاده کن",
  "verdict": "حکم نهایی - 1 جمله کوتاه تیکه‌دار به فارسی",
  "stats": [
    {"label": "موجودی", "value": "${eth} ETH"},
    {"label": "تراکنش", "value": "${txCount} تا"},
    {"label": "گس سوخته", "value": "${gasEth.toFixed(3)} ETH"}
  ]
}` :
    `You're a savage, hilarious crypto roaster. Return ONLY valid JSON, nothing else.

Wallet data:
- Balance: ${eth} ETH
- Transactions: ${txCount}
- Outgoing: ${outgoing} | Incoming: ${incoming}
- Gas burned: ${gasEth.toFixed(4)} ETH
${!data.real ? "- Demo data" : ""}

JSON:
{
  "archetype": "The [Funny Archetype]",
  "archetypeEmoji": "one emoji",
  "degenScore": number 1-10,
  "roast": "2-3 sentences savage funny roast with crypto slang",
  "verdict": "one short savage final verdict",
  "stats": [
    {"label": "Balance", "value": "${eth} ETH"},
    {"label": "Transactions", "value": "${txCount}"},
    {"label": "Gas Burned", "value": "${gasEth.toFixed(3)} ETH"}
  ]
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const d = await res.json();
  if (!d.content?.[0]?.text) throw new Error("No response");
  const raw = d.content[0].text.replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

// ─── Main Component ───────────────────────────────────────────────
export default function App() {
  const [address, setAddress] = useState("");
  const [lang, setLang] = useState("fa");
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("");
  const [copied, setCopied] = useState(false);

  const fa = lang === "fa";
  const fontMain = fa ? "'Vazirmatn', sans-serif" : "'Space Mono', monospace";

  async function handleRoast() {
    const addr = address.trim();
    if (!addr) return setError(fa ? "آدرس wallet رو وارد کن داداش 🙄" : "Enter your wallet address 🙄");
    if (!addr.match(/^0x[a-fA-F0-9]{40}$/)) return setError(fa ? "آدرس معتبر نیست (0x + 40 کاراکتر)" : "Invalid format (0x + 40 chars)");

    setError(""); setLoading(true); setRoast(null);
    try {
      setPhase("scanning");
      await new Promise(r => setTimeout(r, 1400));
      const data = await getWalletData(addr);

      setPhase("roasting");
      await new Promise(r => setTimeout(r, 700));
      const result = await generateRoast(addr, data, lang);

      setRoast(result);
    } catch {
      setError(fa ? "خطا. دوباره امتحان کن 🔥" : "Error. Try again 🔥");
    } finally {
      setLoading(false); setPhase("");
    }
  }

  function copyToClipboard() {
    if (!roast) return;
    const text = fa
      ? `🔥 ${roast.archetype} ${roast.archetypeEmoji}\nامتیاز دیگن: ${roast.degenScore}/10\n\n${roast.roast}\n\n❝ ${roast.verdict} ❞\n\n━━━━━━━━━━━\nonchainroast.xyz`
      : `🔥 ${roast.archetype} ${roast.archetypeEmoji}\nDegen Score: ${roast.degenScore}/10\n\n${roast.roast}\n\n❝ ${roast.verdict} ❞\n\n━━━━━━━━━━━\nonchainroast.xyz`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const sc = roast
    ? roast.degenScore > 7 ? "#ff2200" : roast.degenScore > 4 ? "#ff6600" : "#ffcc00"
    : "#ff6600";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060606",
      fontFamily: fontMain,
      color: "#f0ede6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "28px 16px 60px",
      position: "relative",
      overflowX: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=Vazirmatn:wght@400;500;700;900&display=swap" rel="stylesheet" />

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "500px",
        background: "radial-gradient(ellipse, rgba(255,70,0,0.05) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px", zIndex: 1, position: "relative" }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(52px, 12vw, 88px)",
          letterSpacing: "6px",
          background: "linear-gradient(135deg, #ff9500 0%, #ff4400 50%, #ff6600 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          marginBottom: "6px",
          filter: "drop-shadow(0 0 30px rgba(255,80,0,0.3))"
        }}>🔥 OnChain Roast</div>
        <div style={{
          fontSize: "12px", color: "#555", letterSpacing: "3px",
          textTransform: "uppercase",
          fontFamily: fa ? "'Vazirmatn', sans-serif" : "'Space Mono', monospace"
        }}>
          {fa ? "کیف پولت رو بده — رسواییت رو ببر" : "AI ROASTS YOUR ENTIRE TRADING HISTORY"}
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "500px",
        background: "rgba(12,8,4,0.97)",
        border: "1px solid rgba(255,100,0,0.18)",
        borderRadius: "14px",
        padding: "28px 24px",
        boxShadow: "0 0 50px rgba(255,60,0,0.07), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,100,0,0.1)",
        position: "relative", zIndex: 1
      }}>

        {!roast ? (
          <>
            {/* Lang toggle */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "22px", justifyContent: "center" }}>
              {["fa", "en"].map(l => (
                <button key={l} onClick={() => { setLang(l); setError(""); }}
                  style={{
                    padding: "7px 22px", borderRadius: "7px",
                    border: lang === l ? "1px solid rgba(255,100,0,0.6)" : "1px solid #222",
                    background: lang === l ? "rgba(255,90,0,0.12)" : "transparent",
                    color: lang === l ? "#ff7700" : "#555",
                    cursor: "pointer", fontSize: "13px",
                    fontFamily: l === "fa" ? "'Vazirmatn', sans-serif" : "'Space Mono', monospace",
                    fontWeight: lang === l ? "700" : "400",
                    transition: "all 0.2s"
                  }}>
                  {l === "fa" ? "فارسی 🇮🇷" : "English 🌍"}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{
                display: "block", fontSize: "10px", color: "#555",
                letterSpacing: "2px", marginBottom: "8px",
                textTransform: "uppercase", fontFamily: "'Space Mono', monospace"
              }}>
                {fa ? "آدرس Ethereum Wallet" : "Ethereum Wallet Address"}
              </label>
              <input
                value={address}
                onChange={e => { setAddress(e.target.value); setError(""); }}
                placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                dir="ltr"
                style={{
                  width: "100%", background: "#080808",
                  border: "1px solid #1e1e1e", borderRadius: "8px",
                  padding: "12px 14px", color: "#e8e5e0",
                  fontSize: "12px", fontFamily: "'Space Mono', monospace",
                  outline: "none", boxSizing: "border-box",
                  letterSpacing: "0.5px", transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(255,100,0,0.5)"}
                onBlur={e => e.target.style.borderColor = "#1e1e1e"}
                onKeyDown={e => e.key === "Enter" && handleRoast()}
              />
            </div>

            {error && (
              <div style={{
                color: "#ff4444", fontSize: "12px", marginBottom: "12px",
                fontFamily: fontMain, textAlign: fa ? "right" : "left",
                direction: fa ? "rtl" : "ltr"
              }}>{error}</div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "22px 0" }}>
                <div style={{ fontSize: "32px", marginBottom: "14px", display: "inline-block", animation: "flicker 0.8s ease-in-out infinite alternate" }}>🔥</div>
                <div style={{ color: "#ff7700", fontSize: "13px", fontFamily: fontMain }}>
                  {phase === "scanning"
                    ? (fa ? "در حال اسکن بلاکچین..." : "Scanning blockchain...")
                    : (fa ? "هوش مصنوعی داره رسواییت رو میکنه..." : "AI is cooking you alive...")}
                </div>
                <div style={{ color: "#333", fontSize: "11px", marginTop: "8px", fontFamily: "'Space Mono', monospace" }}>
                  {phase === "scanning" ? "reading onchain data..." : "generating roast..."}
                </div>
              </div>
            ) : (
              <button onClick={handleRoast}
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #ff6600 0%, #ff2200 100%)",
                  border: "none", borderRadius: "8px",
                  color: "#fff", fontSize: "15px", fontWeight: "700",
                  cursor: "pointer",
                  letterSpacing: fa ? "1px" : "2px",
                  fontFamily: fontMain,
                  textTransform: fa ? "none" : "uppercase",
                  boxShadow: "0 4px 20px rgba(255,60,0,0.3)",
                  transition: "all 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {fa ? "🔥 رسواییم کن!" : "🔥 ROAST MY WALLET"}
              </button>
            )}

            <p style={{
              textAlign: "center", fontSize: "11px", color: "#333",
              marginTop: "14px", fontFamily: fontMain,
              direction: fa ? "rtl" : "ltr", lineHeight: "1.7"
            }}>
              {fa
                ? "آدرس wallet روی بلاکچین عمومیه — ما هیچ دسترسی به funds نداریم"
                : "Wallet data is publicly visible on-chain — we never touch your funds"}
            </p>
          </>
        ) : (
          /* ── RESULT ── */
          <div style={{ direction: fa ? "rtl" : "ltr", fontFamily: fontMain }}>

            {/* Top strip */}
            <div style={{
              background: "rgba(255,60,0,0.08)", borderRadius: "8px",
              padding: "5px 12px", marginBottom: "20px", textAlign: "center"
            }}>
              <span style={{ fontSize: "10px", color: "#ff6600", letterSpacing: "2px", fontFamily: "'Space Mono', monospace" }}>
                ONCHAIN ROAST — {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>

            {/* Archetype */}
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <div style={{ fontSize: "52px", lineHeight: 1, marginBottom: "10px" }}>{roast.archetypeEmoji}</div>
              <div style={{
                fontSize: fa ? "20px" : "16px", fontWeight: "900", color: "#ff7700",
                letterSpacing: fa ? "1px" : "3px",
                textTransform: fa ? "none" : "uppercase",
                textShadow: "0 0 20px rgba(255,100,0,0.4)"
              }}>{roast.archetype}</div>
            </div>

            {/* Degen Score */}
            <div style={{
              background: "#090909", border: "1px solid #161616",
              borderRadius: "10px", padding: "14px 16px", marginBottom: "14px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", fontFamily: "'Space Mono', monospace" }}>
                  {fa ? "امتیاز دیگن" : "DEGEN SCORE"}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "26px", fontWeight: "700", color: sc }}>
                  {roast.degenScore}<span style={{ fontSize: "13px", color: "#333" }}>/10</span>
                </span>
              </div>
              <div style={{ background: "#111", borderRadius: "3px", height: "5px" }}>
                <div style={{
                  width: `${roast.degenScore * 10}%`, height: "100%",
                  background: `linear-gradient(90deg, #ff9900, ${sc})`,
                  borderRadius: "3px",
                  boxShadow: `0 0 8px ${sc}66`
                }} />
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
              {roast.stats.map((s, i) => (
                <div key={i} style={{
                  background: "#090909", border: "1px solid #161616",
                  borderRadius: "8px", padding: "10px 6px", textAlign: "center"
                }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#e8e5e0", fontFamily: "'Space Mono', monospace" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "9px", color: "#444", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Roast text */}
            <div style={{
              background: "rgba(255,50,0,0.05)",
              border: "1px solid rgba(255,80,0,0.12)",
              borderRadius: "8px", padding: "16px 18px", marginBottom: "14px",
              fontSize: fa ? "14px" : "12px", lineHeight: "1.8",
              color: "#ccc", textAlign: fa ? "right" : "left"
            }}>
              {roast.roast}
            </div>

            {/* Verdict */}
            <div style={{
              borderTop: "1px solid #161616", paddingTop: "14px",
              textAlign: "center",
              fontSize: fa ? "13px" : "11px",
              color: "#ff3300", fontWeight: "700",
              letterSpacing: fa ? "0px" : "1.5px"
            }}>
              ❝ {roast.verdict} ❞
            </div>

            <div style={{
              textAlign: "center", marginTop: "14px",
              fontSize: "10px", color: "#2a2a2a",
              fontFamily: "'Space Mono', monospace", letterSpacing: "2px"
            }}>
              onchainroast.xyz
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => { setRoast(null); setAddress(""); }}
                style={{
                  flex: 1, padding: "11px",
                  background: "transparent", border: "1px solid #222",
                  borderRadius: "7px", color: "#666",
                  cursor: "pointer", fontSize: "12px", fontFamily: fontMain,
                  transition: "border-color 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = "#444"}
                onMouseOut={e => e.currentTarget.style.borderColor = "#222"}
              >
                {fa ? "← برگشت" : "← Back"}
              </button>
              <button onClick={copyToClipboard}
                style={{
                  flex: 2, padding: "11px",
                  background: copied ? "rgba(50,200,50,0.15)" : "linear-gradient(135deg, #ff6600, #ff2200)",
                  border: copied ? "1px solid rgba(50,200,50,0.4)" : "none",
                  borderRadius: "7px", color: copied ? "#88ff88" : "#fff",
                  cursor: "pointer", fontSize: "12px", fontWeight: "700",
                  fontFamily: fontMain, letterSpacing: fa ? "1px" : "1.5px",
                  transition: "all 0.3s",
                  boxShadow: copied ? "none" : "0 4px 15px rgba(255,60,0,0.25)"
                }}>
                {copied
                  ? (fa ? "✅ کپی شد — بریزش توییتر!" : "✅ Copied — post it!")
                  : (fa ? "📋 کپی برای توییتر 🔥" : "📋 COPY FOR TWITTER 🔥")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{
        marginTop: "28px", textAlign: "center",
        fontSize: "11px", color: "#222",
        fontFamily: "'Space Mono', monospace", letterSpacing: "1px", zIndex: 1
      }}>
        powered by claude ai — onchainroast.xyz
      </div>

      <style>{`
        @keyframes flicker {
          from { transform: scale(1) rotate(-3deg); filter: brightness(1); }
          to   { transform: scale(1.1) rotate(3deg); filter: brightness(1.4); }
        }
        input::placeholder { color: #252525; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
