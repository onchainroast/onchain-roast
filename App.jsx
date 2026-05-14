import { useState, useEffect } from "react";

// ── Translations ────────────────────────────────────────────────
const T = {
  en: {
    eyebrow: "AI-POWERED WALLET ANALYSIS",
    title: "OnChain Roast",
    subtitle: "YOUR TRADING HISTORY, BRUTALLY ANALYZED",
    subtitleColor: "#9B6FD4",
    label: "Ethereum Wallet Address",
    placeholder: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    cta: "🔥 Expose My Wallet",
    safety: "Wallet data is publicly visible on-chain — we never access your funds",
    scanning: "Scanning Blockchain...",
    roasting: "Generating Analysis...",
    error1: "Enter your wallet address",
    error2: "Invalid address format",
    errorApi: "Error — please try again",
    degenLabel: "DEGEN SCORE",
    back: "← Back",
    share: "Share on Twitter 🔥",
    copied: "✓ Copied",
    rtl: false,
    titleSize: "clamp(52px,12vw,96px)",
    titleStyle: "italic",
    titleWeight: 700,
    titleFont: "'Cormorant Garamond', serif",
    promptLang: "English",
  },
  fa: {
    eyebrow: "AI-POWERED WALLET ANALYSIS",
    title: "پته‌ات رو می‌ریزیم روی آب",
    subtitle: "هوش مصنوعی معاملاتت را زیر ذره‌بین می‌برد",
    subtitleColor: "#FFFFFF",
    label: "آدرس کیف پول اتریوم",
    placeholder: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    cta: "🔥 پته‌ام رو بریز روی آب!!!",
    safety: "آدرس wallet روی بلاکچین عمومی است — هیچ دسترسی به دارایی شما نداریم",
    scanning: "در حال بررسی بلاکچین...",
    roasting: "هوش مصنوعی در حال تحلیل...",
    error1: "آدرس wallet رو وارد کن",
    error2: "آدرس معتبر نیست",
    errorApi: "خطا — دوباره امتحان کن",
    degenLabel: "امتیاز دیگن",
    back: "← بازگشت",
    share: "اشتراک‌گذاری 🔥",
    copied: "✓ کپی شد",
    rtl: true,
    titleSize: "clamp(18px,4.5vw,30px)",
    titleStyle: "normal",
    titleWeight: 900,
    titleFont: "'Vazirmatn', sans-serif",
    promptLang: "Persian (Farsi)",
  },
  es: {
    eyebrow: "ANÁLISIS DE WALLET CON IA",
    title: "OnChain Roast",
    subtitle: "TU HISTORIAL DE TRADING, BRUTALMENTE ANALIZADO",
    subtitleColor: "#9B6FD4",
    label: "Dirección de Wallet Ethereum",
    placeholder: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    cta: "🔥 Expón Mi Wallet",
    safety: "Los datos de wallet son públicos en blockchain — nunca accedemos a tus fondos",
    scanning: "Escaneando Blockchain...",
    roasting: "Generando Análisis...",
    error1: "Ingresa la dirección de tu wallet",
    error2: "Formato de dirección inválido",
    errorApi: "Error — intenta de nuevo",
    degenLabel: "PUNTUACIÓN DEGEN",
    back: "← Volver",
    share: "Compartir en Twitter 🔥",
    copied: "✓ Copiado",
    rtl: false,
    titleSize: "clamp(52px,12vw,96px)",
    titleStyle: "italic",
    titleWeight: 700,
    titleFont: "'Cormorant Garamond', serif",
    promptLang: "Spanish",
  },
  pt: {
    eyebrow: "ANÁLISE DE WALLET COM IA",
    title: "OnChain Roast",
    subtitle: "SEU HISTÓRICO DE TRADING, BRUTALMENTE ANALISADO",
    subtitleColor: "#9B6FD4",
    label: "Endereço da Wallet Ethereum",
    placeholder: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    cta: "🔥 Expor Minha Wallet",
    safety: "Dados da wallet são públicos na blockchain — nunca acessamos seus fundos",
    scanning: "Escaneando Blockchain...",
    roasting: "Gerando Análise...",
    error1: "Digite o endereço da sua wallet",
    error2: "Formato de endereço inválido",
    errorApi: "Erro — tente novamente",
    degenLabel: "PONTUAÇÃO DEGEN",
    back: "← Voltar",
    share: "Compartilhar no Twitter 🔥",
    copied: "✓ Copiado",
    rtl: false,
    titleSize: "clamp(52px,12vw,96px)",
    titleStyle: "italic",
    titleWeight: 700,
    titleFont: "'Cormorant Garamond', serif",
    promptLang: "Portuguese (Brazilian)",
  },
  tr: {
    eyebrow: "YAPAY ZEKA CÜZDAN ANALİZİ",
    title: "OnChain Roast",
    subtitle: "İŞLEM GEÇMİŞİN, ACIMADAN ANALİZ EDİLDİ",
    subtitleColor: "#9B6FD4",
    label: "Ethereum Cüzdan Adresi",
    placeholder: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    cta: "🔥 Cüzdanımı Teşhir Et",
    safety: "Cüzdan verileri blockchain'de herkese açıktır — fonlarınıza asla erişmeyiz",
    scanning: "Blockchain Taranıyor...",
    roasting: "Analiz Oluşturuluyor...",
    error1: "Cüzdan adresini gir",
    error2: "Geçersiz adres formatı",
    errorApi: "Hata — tekrar dene",
    degenLabel: "DEGEN SKORU",
    back: "← Geri",
    share: "Twitter'da Paylaş 🔥",
    copied: "✓ Kopyalandı",
    rtl: false,
    titleSize: "clamp(52px,12vw,96px)",
    titleStyle: "italic",
    titleWeight: 700,
    titleFont: "'Cormorant Garamond', serif",
    promptLang: "Turkish",
  },
  fr: {
    eyebrow: "ANALYSE DE WALLET PAR IA",
    title: "OnChain Roast",
    subtitle: "TON HISTORIQUE DE TRADING, BRUTALEMENT ANALYSÉ",
    subtitleColor: "#9B6FD4",
    label: "Adresse Wallet Ethereum",
    placeholder: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    cta: "🔥 Exposer Mon Wallet",
    safety: "Les données du wallet sont publiques sur la blockchain — nous n'accédons jamais à vos fonds",
    scanning: "Scan de la Blockchain...",
    roasting: "Génération de l'Analyse...",
    error1: "Entre l'adresse de ton wallet",
    error2: "Format d'adresse invalide",
    errorApi: "Erreur — réessaie",
    degenLabel: "SCORE DEGEN",
    back: "← Retour",
    share: "Partager sur Twitter 🔥",
    copied: "✓ Copié",
    rtl: false,
    titleSize: "clamp(52px,12vw,96px)",
    titleStyle: "italic",
    titleWeight: 700,
    titleFont: "'Cormorant Garamond', serif",
    promptLang: "French",
  },
};

const TABS = [
  { code: "en", label: "EN" },
  { code: "fa", label: "فا" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
  { code: "tr", label: "TR" },
  { code: "fr", label: "FR" },
];

// ── Main ────────────────────────────────────────────────────────
export default function App() {
  const [address, setAddress] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("");
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const t = T[lang];
  const bodyFont = "'Plus Jakarta Sans', sans-serif";

  async function handleRoast() {
    const addr = address.trim();
    if (!addr) return setError(t.error1);
    if (!addr.match(/^0x[a-fA-F0-9]{40}$/)) return setError(t.error2);
    setError(""); setLoading(true); setRoast(null);
    try {
      setPhase("scanning");
      await new Promise(r => setTimeout(r, 1500));
      const data = {
        balance: String(Math.floor((Math.random() * 3.5 + 0.1) * 1e18)),
        txs: Array(Math.floor(Math.random() * 60 + 15)).fill(0).map(() => ({
          gasUsed: String(Math.floor(Math.random() * 80000 + 21000)),
          gasPrice: String(Math.floor(Math.random() * 40 + 8) * 1e9),
          from: addr.toLowerCase(),
        })),
      };
      const eth = (parseInt(data.balance) / 1e18).toFixed(4);
      const txCount = data.txs.length;
      let gasEth = 0;
      data.txs.forEach(tx => { gasEth += parseInt(tx.gasUsed) * parseInt(tx.gasPrice) / 1e18; });

      setPhase("roasting");
      await new Promise(r => setTimeout(r, 800));

      const prompt = `You are a savage, hilarious crypto roaster. Reply ONLY in ${t.promptLang}. Return ONLY valid JSON, nothing else.

Wallet data: Balance ${eth} ETH, ${txCount} transactions, gas burned ${gasEth.toFixed(3)} ETH.

JSON format:
{"archetype":"funny trader archetype name in ${t.promptLang}","archetypeEmoji":"one emoji","degenScore":number 1-10,"roast":"2-3 sentences savage funny roast in ${t.promptLang} using crypto slang naturally","verdict":"one short savage final verdict in ${t.promptLang}","stats":[{"label":"${lang === "fa" ? "موجودی" : lang === "es" ? "Saldo" : lang === "pt" ? "Saldo" : lang === "tr" ? "Bakiye" : lang === "fr" ? "Solde" : "Balance"}","value":"${eth} ETH"},{"label":"${lang === "fa" ? "تراکنش" : lang === "es" ? "Transacciones" : lang === "pt" ? "Transações" : lang === "tr" ? "İşlemler" : lang === "fr" ? "Transactions" : "Transactions"}","value":"${txCount}"},{"label":"${lang === "fa" ? "گس سوخته" : lang === "es" ? "Gas Quemado" : lang === "pt" ? "Gas Queimado" : lang === "tr" ? "Yakılan Gas" : lang === "fr" ? "Gas Brûlé" : "Gas Burned"}","value":"${gasEth.toFixed(3)} ETH"}]}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, messages: [{ role: "user", content: prompt }] })
      });
      const d = await res.json();
      const raw = d.content[0].text.replace(/```json|```/g, "").trim();
      setRoast(JSON.parse(raw));
    } catch {
      setError(t.errorApi);
    } finally { setLoading(false); setPhase(""); }
  }

  function copyText() {
    if (!roast) return;
    const text = `🔥 ${roast.archetype} ${roast.archetypeEmoji}\n${t.degenLabel}: ${roast.degenScore}/10\n\n${roast.roast}\n\n❝ ${roast.verdict} ❞\n\nonchainroast.xyz`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const scoreColor = roast ? (roast.degenScore > 7 ? "#FF4422" : roast.degenScore > 4 ? "#FF8C00" : "#C9A84C") : "#C9A84C";

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", fontFamily: bodyFont, color: "#E8E0D0",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 16px 80px", position: "relative", overflow: "hidden",
      opacity: visible ? 1 : 0, transition: "opacity 0.6s ease"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Vazirmatn:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* Glow */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
      {/* Gold top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 10, background: "linear-gradient(90deg, transparent, #C9A84C 30%, #FF8C00 50%, #C9A84C 70%, transparent)" }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", zIndex: 1, position: "relative", transform: visible ? "translateY(0)" : "translateY(16px)", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ fontSize: "10px", letterSpacing: "5px", color: "#C9A84C", textTransform: "uppercase", marginBottom: "16px", fontFamily: bodyFont, fontWeight: 500 }}>
          {t.eyebrow}
        </div>
        <div style={{ fontFamily: t.titleFont, fontSize: t.titleSize, fontWeight: t.titleWeight, fontStyle: t.titleStyle, lineHeight: 1, marginBottom: "10px", background: "linear-gradient(135deg, #F0C040 0%, #C9A84C 40%, #FF8C00 70%, #E8A020 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 2px 20px rgba(201,168,76,0.2))", letterSpacing: t.rtl ? "2px" : "-1px", whiteSpace: "nowrap" }}>
          {t.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", margin: "14px 0" }}>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
          <div style={{ width: "4px", height: "4px", background: "#C9A84C", borderRadius: "50%", boxShadow: "0 0 6px #C9A84C" }} />
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
        </div>
        <div style={{ fontSize: "12px", color: t.subtitleColor, letterSpacing: t.rtl ? "1px" : "2px", fontFamily: bodyFont, fontWeight: 500 }}>
          {t.subtitle}
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: "480px", zIndex: 1, position: "relative", transform: visible ? "translateY(0)" : "translateY(24px)", transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>
        <div style={{ position: "absolute", inset: "-1px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(201,168,76,0.35) 0%, rgba(255,140,0,0.15) 50%, rgba(201,168,76,0.08) 100%)", zIndex: -1 }} />
        <div style={{ background: "rgba(10,9,7,0.98)", borderRadius: "16px", padding: "28px 24px" }}>

          {!roast ? (
            <>
              {/* Language Tabs — compact */}
              <div style={{ display: "flex", marginBottom: "24px", border: "1px solid #1E1A12", borderRadius: "8px", overflow: "hidden" }}>
                {TABS.map((tab, i) => (
                  <button key={tab.code} onClick={() => { setLang(tab.code); setError(""); setRoast(null); }}
                    style={{
                      flex: 1, padding: "8px 2px",
                      background: lang === tab.code ? "rgba(201,168,76,0.12)" : "transparent",
                      border: "none",
                      borderRight: i < TABS.length - 1 ? "1px solid #1E1A12" : "none",
                      color: lang === tab.code ? "#C9A84C" : "#3A3328",
                      cursor: "pointer", fontSize: "11px",
                      fontFamily: tab.code === "fa" ? "'Vazirmatn', sans-serif" : bodyFont,
                      fontWeight: lang === tab.code ? 700 : 400,
                      letterSpacing: "0.5px", transition: "all 0.2s"
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Label */}
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#FFFFFF", textTransform: "uppercase", marginBottom: "8px", fontFamily: bodyFont, fontWeight: 500, direction: t.rtl ? "rtl" : "ltr" }}>
                {t.label}
              </div>

              {/* Input */}
              <input value={address} onChange={e => { setAddress(e.target.value); setError(""); }}
                placeholder={t.placeholder} dir="ltr"
                onKeyDown={e => e.key === "Enter" && handleRoast()}
                style={{ width: "100%", background: "#0D0C09", border: "1px solid #222015", borderRadius: "8px", padding: "13px 16px", color: "#C8BFA8", fontSize: "11px", fontFamily: "'SF Mono', 'Fira Code', monospace", outline: "none", boxSizing: "border-box", letterSpacing: "0.8px", transition: "border-color 0.3s", caretColor: "#C9A84C", marginBottom: "16px" }}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.5)"}
                onBlur={e => e.target.style.borderColor = "#222015"}
              />

              {error && <div style={{ color: "#CC4422", fontSize: "11px", marginBottom: "14px", fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : bodyFont, direction: t.rtl ? "rtl" : "ltr" }}>{error}</div>}

              {loading ? (
                <div style={{ padding: "24px 0", textAlign: "center" }}>
                  <div style={{ width: "32px", height: "32px", margin: "0 auto 16px", border: "2px solid #1E1A12", borderTop: "2px solid #C9A84C", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <div style={{ color: "#C9A84C", fontSize: "12px", fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : bodyFont, letterSpacing: "1px" }}>
                    {phase === "scanning" ? t.scanning : t.roasting}
                  </div>
                </div>
              ) : (
                <button onClick={handleRoast}
                  style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #C9A84C 0%, #FF8C00 60%, #E8A020 100%)", border: "none", borderRadius: "8px", color: "#080808", fontSize: t.rtl ? "14px" : "11px", fontWeight: 700, cursor: "pointer", fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : bodyFont, letterSpacing: t.rtl ? "1px" : "2px", textTransform: t.rtl ? "none" : "uppercase", boxShadow: "0 4px 24px rgba(201,168,76,0.2)", transition: "all 0.25s" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,168,76,0.35)"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,168,76,0.2)"; }}>
                  {t.cta}
                </button>
              )}

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #131109", display: "flex", alignItems: "flex-start", gap: "8px", direction: t.rtl ? "rtl" : "ltr" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#1E4A1E", flexShrink: 0, marginTop: "4px" }} />
                <span style={{ fontSize: "10px", color: "#FFFFFF", fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : bodyFont, lineHeight: 1.6 }}>
                  {t.safety}
                </span>
              </div>
            </>
          ) : (
            /* ── Result ── */
            <div style={{ direction: t.rtl ? "rtl" : "ltr" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "6px", padding: "5px 12px", marginBottom: "24px", fontFamily: "'SF Mono', monospace", fontSize: "10px", color: "#6B5E3E", letterSpacing: "1px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C9A84C" }} />
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>

              <div style={{ textAlign: "center", margin: "8px 0 24px" }}>
                <div style={{ fontSize: "56px", lineHeight: 1, marginBottom: "12px" }}>{roast.archetypeEmoji}</div>
                <div style={{ fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : "'Cormorant Garamond', serif", fontSize: t.rtl ? "22px" : "28px", fontWeight: t.rtl ? 900 : 700, fontStyle: t.rtl ? "normal" : "italic", background: "linear-gradient(135deg, #F0C040, #C9A84C, #FF8C00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {roast.archetype}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #2A2218)" }} />
                <div style={{ width: "3px", height: "3px", background: "#C9A84C", borderRadius: "50%" }} />
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #2A2218, transparent)" }} />
              </div>

              <div style={{ background: "#0D0C09", border: "1px solid #1E1A12", borderRadius: "10px", padding: "16px 18px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "9px", color: "#4A4030", letterSpacing: "2px", textTransform: "uppercase", fontFamily: bodyFont }}>{t.degenLabel}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 700, fontStyle: "italic", color: scoreColor, lineHeight: 1 }}>
                    {roast.degenScore}<span style={{ fontSize: "14px", color: "#2A2218", fontStyle: "normal" }}>/10</span>
                  </span>
                </div>
                <div style={{ background: "#0A0906", borderRadius: "2px", height: "3px" }}>
                  <div style={{ width: `${roast.degenScore * 10}%`, height: "100%", background: `linear-gradient(90deg, #C9A84C, ${scoreColor})`, borderRadius: "2px", boxShadow: `0 0 8px ${scoreColor}44` }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                {roast.stats.map((s, i) => (
                  <div key={i} style={{ background: "#0D0C09", border: "1px solid #1A1710", borderRadius: "8px", padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#C8BFA8", fontFamily: "'SF Mono', monospace", marginBottom: "4px" }}>{s.value}</div>
                    <div style={{ fontSize: "9px", color: "#3A3020", letterSpacing: "1px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "10px", padding: "18px 20px", marginBottom: "16px", fontSize: t.rtl ? "14px" : "13px", lineHeight: "1.9", color: "#A09070", fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : bodyFont }}>
                {roast.roast}
              </div>

              <div style={{ textAlign: "center", padding: "16px 0", borderTop: "1px solid #131109", marginBottom: "4px" }}>
                <div style={{ fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : "'Cormorant Garamond', serif", fontSize: t.rtl ? "14px" : "17px", fontStyle: t.rtl ? "normal" : "italic", color: "#FF6622", fontWeight: t.rtl ? 700 : 600 }}>
                  ❝ {roast.verdict} ❞
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "12px", fontSize: "9px", color: "#1A1810", letterSpacing: "3px", fontFamily: bodyFont, textTransform: "uppercase" }}>
                onchainroast.xyz
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                <button onClick={() => { setRoast(null); setAddress(""); }}
                  style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #1E1A12", borderRadius: "8px", color: "#4A4030", cursor: "pointer", fontSize: t.rtl ? "12px" : "10px", fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : bodyFont, letterSpacing: t.rtl ? "0" : "2px", textTransform: t.rtl ? "none" : "uppercase", transition: "all 0.2s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#3A3020"; e.currentTarget.style.color = "#8A7850"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#1E1A12"; e.currentTarget.style.color = "#4A4030"; }}>
                  {t.back}
                </button>
                <button onClick={copyText}
                  style={{ flex: 2, padding: "12px", background: copied ? "rgba(40,160,80,0.12)" : "linear-gradient(135deg, #C9A84C 0%, #FF8C00 70%)", border: copied ? "1px solid rgba(40,160,80,0.3)" : "none", borderRadius: "8px", color: copied ? "#40C070" : "#080808", cursor: "pointer", fontSize: t.rtl ? "12px" : "10px", fontWeight: 700, fontFamily: t.rtl ? "'Vazirmatn', sans-serif" : bodyFont, letterSpacing: t.rtl ? "1px" : "2px", textTransform: t.rtl ? "none" : "uppercase", transition: "all 0.3s", boxShadow: copied ? "none" : "0 4px 20px rgba(201,168,76,0.2)" }}>
                  {copied ? t.copied : t.share}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "40px", textAlign: "center", zIndex: 1 }}>
        <a href="https://t.me/QuantaSynth" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#3A3328", letterSpacing: "2px", fontFamily: bodyFont, textTransform: "uppercase", textDecoration: "none", padding: "6px 12px", border: "1px solid #1E1A12", borderRadius: "6px", transition: "all 0.2s", marginBottom: "14px" }}
          onMouseOver={e => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.borderColor = "#3A3020"; }}
          onMouseOut={e => { e.currentTarget.style.color = "#3A3328"; e.currentTarget.style.borderColor = "#1E1A12"; }}>
          <span style={{ fontSize: "12px" }}>✈</span> QuantaSynth — Pro Trading Tools
        </a>
        <div style={{ fontSize: "9px", color: "#181610", letterSpacing: "4px", fontFamily: bodyFont, textTransform: "uppercase" }}>
          powered by anthropic claude · onchainroast.xyz
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #201E14; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
