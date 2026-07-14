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

  async function sendMessage(customMessage?: string) {
    const userMessage = customMessage ?? message;

    if (!userMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ??
            "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
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
          <h3>Virya Events AI</h3>
          <span>Typically replies instantly</span>
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

        {loading && (
          <div className="assistant-message typing">
            Thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your event..."
        />

        <button onClick={() => sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
}