"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import gsap from "gsap";
import { ChatbotQuickPick, extractPicker } from "./chatbot-quick-pick";

const QUICK_REPLIES = [
  { label: "What services do you offer?", text: "What services do you offer?" },
  { label: "How is pricing calculated?", text: "How is pricing calculated?" },
  { label: "Get a quick estimate", text: "I'd like a quick estimate. What info do you need?" },
  { label: "School discounts?", text: "Do you offer school discounts?" },
];

const GREETING =
  "Hey there! 🍦 I'm Frosty. Ask about our services, pricing, or get a quick estimate for your event!";

// Walk through chat messages and pull out everything we know about the user
// from tool inputs/outputs (zip, service type, qty, hours, contact info).
// AI SDK v6 stores tool parts as { type: "tool-<toolName>", input, output }.
function deriveQuoteContext(messages) {
  const ctx = {};
  for (const m of messages || []) {
    if (!Array.isArray(m.parts)) continue;
    for (const p of m.parts) {
      if (p.type === "tool-get_travel_time_from_zip") {
        if (p.output?.zipCode) ctx.zip = p.output.zipCode;
        if (p.input?.streetAddress) ctx.address = p.input.streetAddress;
      }
      if (p.type === "tool-calculate_estimate") {
        const inp = p.input || {};
        if (inp.serviceType) ctx.interest = inp.serviceType;
        if (inp.quantity) ctx.people = String(inp.quantity);
        if (inp.hours) ctx.hours = String(inp.hours);
        if (p.output?.total) ctx.total = String(p.output.total);
      }
      if (p.type === "tool-submit_booking_request") {
        const inp = p.input || {};
        if (inp.fullName) {
          const parts = inp.fullName.trim().split(/\s+/);
          ctx.firstName = parts[0];
          ctx.lastName = parts.slice(1).join(" ");
        }
        if (inp.email) ctx.email = inp.email;
        if (inp.phone) ctx.phone = inp.phone;
      }
    }
  }
  return ctx;
}

function buildContactHref(href, ctx) {
  if (!href) return href;
  // Only enrich internal /contact links when we have something to add
  if (!/^\/contact($|\?)/.test(href)) return href;
  if (!ctx || Object.keys(ctx).length === 0) return href;
  const [path, existing] = href.split("?");
  const params = new URLSearchParams(existing || "");
  Object.entries(ctx).forEach(([k, v]) => {
    if (v && !params.has(k)) params.set(k, String(v));
  });
  return `${path}?${params.toString()}`;
}

// Markdown renderer factory. Closes over quoteContext to enrich /contact links.
function buildMarkdownComponents(quoteContext) {
  return {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-snug">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-black/5 text-[0.85em] font-mono">{children}</code>
  ),
  h1: ({ children }) => <h3 className="font-bold text-base mb-1">{children}</h3>,
  h2: ({ children }) => <h3 className="font-bold text-base mb-1">{children}</h3>,
  h3: ({ children }) => <h3 className="font-bold text-sm mb-1">{children}</h3>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="text-xs border-collapse w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-current/20 px-2 py-1 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-current/10 px-2 py-1">{children}</td>,
  a: ({ href, children }) => {
    const isExternal = /^https?:/.test(href || "");
    const finalHref = buildContactHref(href, quoteContext);
    return (
      <a
        href={finalHref}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="underline font-semibold"
        style={{ color: "var(--secound-heading)" }}
      >
        {children}
      </a>
    );
  },
  hr: () => <hr className="my-2 border-current/15" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-current/30 pl-2 italic my-1">{children}</blockquote>
  ),
  };
}

// Extract displayable text from UIMessage parts (AI SDK v6 format).
function messageText(message) {
  if (typeof message.content === "string") return message.content;
  if (!Array.isArray(message.parts)) return "";
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasUserMessaged, setHasUserMessaged] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const greetedRef = useRef(false);

  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);
  const bubbleRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, sendMessage, status, error, stop, setMessages } = useChat({
    api: "/api/chat",
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Track everything the user has shared so /contact links can be prefilled
  const quoteContext = useMemo(() => deriveQuoteContext(messages), [messages]);
  const markdownComponents = useMemo(
    () => buildMarkdownComponents(quoteContext),
    [quoteContext]
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // GSAP bubble entrance animation with cleanup
  useEffect(() => {
    if (!bubbleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bubbleRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 1 }
      );
    });
    return () => ctx.revert();
  }, []);

  // GSAP open/close animation with cleanup
  useEffect(() => {
    if (!chatWindowRef.current || !isOpen) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chatWindowRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );
    });
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      ctx.revert();
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  // Toggle chat and inject greeting on first open
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && !greetedRef.current) {
        greetedRef.current = true;
        setHasOpenedOnce(true);
        setMessages([
          {
            id: "greeting",
            role: "assistant",
            parts: [{ type: "text", text: GREETING }],
          },
        ]);
      }
      return next;
    });
  }, [setMessages]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleQuickReply = useCallback(
    (reply) => {
      setHasUserMessaged(true);
      sendMessage({ text: reply.text });
    },
    [sendMessage]
  );

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setHasUserMessaged(true);
    setInputValue("");
    sendMessage({ text });
  }, [inputValue, isLoading, sendMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <>
      {/* Callout label — visible until user opens chat the first time */}
      {!isOpen && !hasOpenedOnce && (
        <button
          onClick={handleToggle}
          className="fixed bottom-8 right-24 z-50 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full shadow-lg cursor-pointer chat-callout-pulse"
          style={{
            backgroundColor: "white",
            color: "var(--primary-heading)",
            border: "1px solid var(--secound-heading)",
          }}
          aria-label="Ask Frosty about pricing"
        >
          <span className="text-sm font-archivo font-semibold whitespace-nowrap">
            Ask Frosty about pricing
          </span>
          <span aria-hidden="true" style={{ color: "var(--secound-heading)" }}>
            →
          </span>
        </button>
      )}

      {/* Chat bubble button */}
      <button
        ref={bubbleRef}
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer chat-bubble-pulse"
        style={{ backgroundColor: "var(--secound-heading)" }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <span className="text-3xl leading-none" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}>
            🍦
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          role="complementary"
          aria-label="Chat with Frosty"
          className={
            "fixed inset-0 z-50 flex flex-col shadow-2xl border-white/20 overflow-hidden sm:inset-auto sm:bottom-24 sm:right-4 sm:rounded-2xl sm:border " +
            (isExpanded
              ? "sm:w-[32rem] sm:h-[calc(100vh-8rem)] sm:max-h-[44rem]"
              : "sm:w-80 sm:h-[28rem]")
          }
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            transformOrigin: "bottom right",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ backgroundColor: "var(--primary-heading)" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              🍦
            </div>
            <div className="flex-1">
              <p className="text-white font-bold font-architect text-sm">Frosty</p>
              <p className="text-white/70 text-xs">Windy City Ice Cream</p>
            </div>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="hidden sm:inline-flex text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label={isExpanded ? "Shrink chat" : "Expand chat"}
              title={isExpanded ? "Shrink" : "Expand"}
            >
              {isExpanded ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, idx) => {
              const rawText = messageText(msg);
              if (!rawText) return null;
              const isUser = msg.role === "user";
              const isLastAssistant = !isUser && idx === messages.length - 1 && !isLoading;
              const { cleanText, kind } = isUser
                ? { cleanText: rawText, kind: null }
                : extractPicker(rawText);
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm font-archivo leading-relaxed ${
                      isUser ? "text-white rounded-br-sm whitespace-pre-wrap" : "rounded-bl-sm chatbot-md"
                    }`}
                    style={
                      isUser
                        ? { backgroundColor: "var(--secound-heading)" }
                        : { backgroundColor: "rgba(87,206,247,0.15)", color: "var(--primary-heading)" }
                    }
                  >
                    {isUser ? (
                      cleanText
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {cleanText}
                      </ReactMarkdown>
                    )}
                  </div>
                  {isLastAssistant && kind && (
                    <ChatbotQuickPick
                      kind={kind}
                      disabled={isLoading}
                      onPick={(value) => {
                        setHasUserMessaged(true);
                        sendMessage({ text: value });
                      }}
                    />
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-2xl text-sm font-archivo rounded-bl-sm"
                  style={{ backgroundColor: "rgba(87,206,247,0.15)", color: "var(--primary-heading)" }}
                >
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>.</span>
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-600 text-center font-archivo">
                Could not reach assistant. Please try again.
              </div>
            )}

            {/* Quick replies — shown until user sends a message */}
            {!hasUserMessaged && messages.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.label}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 rounded-full text-xs font-archivo border cursor-pointer chat-quick-reply"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="shrink-0 border-t border-gray-200 px-3 py-2 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={2000}
              placeholder="Ask about pricing, ZIP, events..."
              className="flex-1 text-sm font-archivo px-3 py-2 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-[#CE598C]/30"
              aria-label="Type a message"
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                onClick={stop}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "var(--primary-heading)" }}
                aria-label="Stop generating"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-40"
                style={{ backgroundColor: "var(--secound-heading)" }}
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
