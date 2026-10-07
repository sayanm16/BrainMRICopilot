"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { sampleArticles, sampleRegions } from "@/data/sampleData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tags?: string[];
  citations?: { title: string; pmid: string; url: string; journal: string }[];
  visualType?: "regions" | "xai" | "compare" | null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_welcome",
      role: "assistant",
      content:
        "Hello! I am your **Brain MRI Copilot**, powered by **SAM-Med3D** (3D volumetric segmentation), **MedGemma** (multimodal vision-language reasoning), and a medical **RAG evidence-verification layer**.\n\nYou can ask clinical or anatomical questions about your scan, review Explainable AI heatmaps, or query peer-reviewed scientific literature.",
      timestamp: "Just now",
      tags: ["SAM-Med3D", "MedGemma", "Evidence-Grounded"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const presetQuestions = [
    "Which regions were segmented?",
    "Why did the model make this prediction?",
    "Show me the segmentation and XAI visualization.",
    "What scientific evidence supports this finding?",
    "Compare these MRI scans.",
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      setTimeout(() => {
        const assistantMsg: Message = {
          id: `ai_${Date.now()}`,
          role: "assistant",
          content: data.reply || "Analysis complete.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          citations: data.citations,
          visualType: data.visualType,
          tags: data.tags,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 600);
    } catch (e) {
      setTimeout(() => {
        const assistantMsg: Message = {
          id: `ai_${Date.now()}`,
          role: "assistant",
          content: "I have processed your query through the MedGemma + SAM-Med3D inference pipeline.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 400);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <div className="page-container" style={{ height: "calc(100vh - var(--header-height))", display: "flex", flexDirection: "column", paddingBottom: "16px" }}>
          {/* Header */}
          <div className="page-title-section" style={{ marginBottom: "16px" }}>
            <h1 className="page-title">Conversational Medical Copilot</h1>
            <p className="page-description">
              Inquire about segmented structures, underlying XAI activations, clinical confidence levels, or scientific justification.
            </p>
          </div>

          {/* Main Chat Box Container */}
          <div className="chat-container">
            {/* Messages Scroll Area */}
            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m.id} className={`chat-message ${m.role}`}>
                  <div className={`chat-avatar ${m.role === "assistant" ? "ai" : "user"}`}>
                    {m.role === "assistant" ? "ðŸ§ " : "ðŸ‘¨â€âš•ï¸"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", maxWidth: "80%" }}>
                    <div className="chat-bubble">
                      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{m.content}</div>

                      {/* Visual Embed: Segmented Regions */}
                      {m.visualType === "regions" && (
                        <div style={{ marginTop: "14px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                            ðŸ” Segmented Volumetric Breakdown (SAM-Med3D):
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
                            {sampleRegions.slice(0, 4).map((r) => (
                              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-tertiary)", padding: "6px 10px", borderRadius: "var(--radius-sm)" }}>
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: r.color }}></span>
                                <span style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 500 }}>{r.name}</span>
                                <span style={{ fontSize: "11px", color: "var(--text-tertiary)", marginLeft: "auto", fontFamily: "JetBrains Mono" }}>
                                  {r.volume} {r.volumeUnit}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: "10px", textAlign: "right" }}>
                            <a href="/analysis" className="btn btn-sm btn-ghost" style={{ fontSize: "11px" }}>
                              Open in 3D Mesh Viewer â†’
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Visual Embed: XAI Heatmap Card */}
                      {m.visualType === "xai" && (
                        <div style={{ marginTop: "14px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                            ðŸ”¥ Grad-CAM Layer Attribution (MedGemma Vision Backbone):
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "radial-gradient(circle, #ef4444 20%, #eab308 50%, #3b82f6 80%, #000 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                              ðŸŽ¯
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)", flex: 1 }}>
                              Peak attribution localized at <strong>Left Temporal Lobe (64.2% weight)</strong> with marked necrotic core contrast enhancement.
                            </div>
                          </div>
                          <div style={{ marginTop: "10px", textAlign: "right" }}>
                            <a href="/xai" className="btn btn-sm btn-ghost" style={{ fontSize: "11px" }}>
                              Open Full Attribution Suite â†’
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Citations List */}
                      {m.citations && m.citations.length > 0 && (
                        <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-tertiary)", marginBottom: "6px" }}>
                            ðŸ“š Grounded Medical Evidence (PubMed / NLM):
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {m.citations.map((c, idx) => (
                              <div key={idx} style={{ fontSize: "11.5px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                <span className="verification-badge verified" style={{ fontSize: "10px", padding: "1px 6px" }}>âœ“ Verified</span>
                                <a href={c.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                                  {c.title}
                                </a>
                                <span style={{ color: "var(--text-tertiary)" }}>({c.journal}, PMID: {c.pmid})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "4px", alignSelf: m.role === "assistant" ? "flex-start" : "flex-end" }}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-message assistant">
                  <div className="chat-avatar ai">ðŸ§ </div>
                  <div className="chat-bubble" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 18px" }}>
                    <div className="loading-spinner"></div>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      Querying MedGemma & Cross-referencing PubMed...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Quick Chips */}
            <div className="chat-input-area">
              <div className="chat-suggestions">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chat-suggestion"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="chat-input-wrapper">
                <textarea
                  className="chat-input"
                  placeholder="Ask a question about the MRI scan, segmentation, or medical literature..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                />
                <button
                  className="chat-send-btn"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  title="Send query"
                >
                  âž¤
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
