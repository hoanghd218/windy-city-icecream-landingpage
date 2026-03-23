"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const QUICK_REPLIES = [
  { label: "Our Flavors", key: "flavors" },
  { label: "Upcoming Events", key: "events" },
  { label: "Pricing", key: "pricing" },
  { label: "Contact Us", key: "contact" },
];

const BOT_RESPONSES = {
  greeting:
    "Hey there! 🍦 Welcome to Windy City Ice Cream! How can I help you today?",
  flavors:
    "We have amazing flavors like Strawberry Bliss, Mango Tango, and Blue Moon! Check out our menu for the full list.",
  events:
    "We have exciting events coming up! Visit our Events page for catering, parties, and pop-up schedules.",
  pricing:
    "Our pricing starts at $4 for a single scoop. Check our Pricing page for packages and catering rates!",
  contact:
    "You can reach us through our Contact page, or email us at info@windycityicecream.com. We'd love to hear from you!",
  default:
    "Thanks for reaching out! For more details, feel free to explore our website or visit our Contact page.",
};

let msgId = 0;
const createMsg = (text, sender) => ({ text, sender, id: ++msgId });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasUserMessaged, setHasUserMessaged] = useState(false);
  const greetedRef = useRef(false);

  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);
  const bubbleRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Toggle chat and show greeting on first open
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && !greetedRef.current) {
        greetedRef.current = true;
        setMessages([createMsg(BOT_RESPONSES.greeting, "bot")]);
      }
      return next;
    });
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const botTimerRef = useRef(null);
  const addBotResponse = useCallback((key) => {
    clearTimeout(botTimerRef.current);
    botTimerRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        createMsg(BOT_RESPONSES[key] || BOT_RESPONSES.default, "bot"),
      ]);
    }, 500);
  }, []);

  // Cleanup bot response timer on unmount
  useEffect(() => {
    return () => clearTimeout(botTimerRef.current);
  }, []);

  const handleQuickReply = useCallback(
    (reply) => {
      setMessages((prev) => [...prev, createMsg(reply.label, "user")]);
      setHasUserMessaged(true);
      addBotResponse(reply.key);
    },
    [addBotResponse]
  );

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    setMessages((prev) => [...prev, createMsg(text, "user")]);
    setHasUserMessaged(true);
    setInputValue("");
    addBotResponse("default");
  }, [inputValue, addBotResponse]);

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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          role="complementary"
          aria-label="Chat with Scoopy"
          className="fixed bottom-24 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] h-[28rem] flex flex-col rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
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
              <p className="text-white font-bold font-architect text-sm">
                Scoopy
              </p>
              <p className="text-white/70 text-xs">Windy City Ice Cream</p>
            </div>
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-archivo leading-relaxed ${
                    msg.sender === "user"
                      ? "text-white rounded-br-sm"
                      : "rounded-bl-sm"
                  }`}
                  style={
                    msg.sender === "user"
                      ? { backgroundColor: "var(--secound-heading)" }
                      : { backgroundColor: "rgba(87,206,247,0.15)", color: "var(--primary-heading)" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick replies - shown until user sends a message */}
            {!hasUserMessaged && messages.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.key}
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
              placeholder="Type a message..."
              className="flex-1 text-sm font-archivo px-3 py-2 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-[#CE598C]/30"
              aria-label="Type a message"
            />
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
          </div>
        </div>
      )}
    </>
  );
}
