"use client";

import { useEffect, useRef, useState } from "react";
import "./chatbot.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to Virya Events.\n\nI'm your personal event planning assistant.\n\nChoose an event below or ask me anything to get started.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function quickSend(text: string) {
    setMessage("");

    setTimeout(() => {
      sendMessage(text);
    }, 50);
  }

  async function typeMessage(text: string) {
    let current = "";

    // Create an empty assistant message
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
      },
    ]);

    // Type the response character by character
    for (let i = 0; i < text.length; i++) {
      current += text[i];

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "assistant",
          content: current,
        };

        return updated;
      });

      await new Promise((resolve) =>
        setTimeout(resolve, 8)
      );
    }
  }

  async function sendMessage(customMessage?: string) {
    const userMessage = customMessage ?? message;

    if (!userMessage.trim()) return;

    const conversation: Message[] = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(conversation);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation,
        }),
      });

      const data = await res.json();

      await typeMessage(
        data.reply ??
          "Sorry, I couldn't generate a response."
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong.",
        },
      ]);
    }

    setLoading(false);
  }
  function handleKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>
) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

if (!isOpen) {
  return (
    <button
      className="chat-launcher"
      onClick={() => setIsOpen(true)}
    >
      <img
        src="/virya-logo.png"
        alt="Virya"
        className="chat-launcher-logo"
      />

      <span className="chat-launcher-pulse"></span>
    </button>
  );
}

return (
  <div className="chatbot-container">
    <div className="chat-header">
      <div>
      <h3>
  <span className="online-dot"></span>
  Virya <span>AI</span>
</h3>

<div className="chat-subtitle">
  Your Event Planning Assistant
</div>

<div className="chat-divider"></div>

<div className="chat-status">
  <span className="status-dot"></span>
  <span className="status-online">Online</span>

  <span className="status-separator">•</span>

  <span className="status-text">
    Typically replies instantly
  </span>
</div>
      </div>

      <button
        className="close-btn"
        onClick={() => setIsOpen(false)}
      >
        ✕
      </button>
    </div>

    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={
            msg.role === "user"
              ? "user-message"
              : "assistant-message"
          }
        >
          {msg.content}
        </div>
      ))}

      {loading && messages.length === 1 && (
        <div className="assistant-message typing">
          Thinking...
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>

    {messages.length === 1 && (
  <div className="quick-actions-wrapper">
    <div className="quick-title">
      Popular Events
    </div>

    <div className="quick-actions">
      <button
        onClick={() => quickSend("Birthday Party")}
      >
        🎂 Birthday
      </button>

      <button
        onClick={() => quickSend("Wedding")}
      >
        💍 Wedding
      </button>

      <button
        onClick={() => quickSend("Corporate Event")}
      >
        🏢 Corporate
      </button>

      <button
        onClick={() => quickSend("Housewarming")}
      >
        🏡 Housewarming
      </button>
    </div>
  </div>
)}

    <div className="chat-input">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your event..."
      />

      <button
        onClick={() => sendMessage()}
        disabled={loading}
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  </div>
);
}