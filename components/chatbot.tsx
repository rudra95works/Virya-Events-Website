"use client";

import { useEffect, useRef, useState } from "react";
import "./chatbot.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Lead = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guests: string;
  venue: string;
  budget: string;
  services: string[];
  requirements: string;
  conversationSummary: string;
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

const [lead, setLead] = useState<Lead>({
  name: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  guests: "",
  venue: "",
  budget: "",
  services: [],
  requirements: "",
  conversationSummary: "",
});

const lastSubmittedLead = useRef("");

function isLeadComplete(lead: Lead) {
  return Boolean(
    lead.name &&
    lead.phone &&
    lead.eventType &&
    lead.eventDate &&
    lead.guests
  );
}

const [leadSubmitted, setLeadSubmitted] = useState(false);

const [leadId] = useState(() => {
  const existing = localStorage.getItem("viryaLeadId");

  if (existing) return existing;

  const id = crypto.randomUUID();

  localStorage.setItem("viryaLeadId", id);

  return id;
});

  const [showPrompt, setShowPrompt] = useState(false);
const [promptDismissed, setPromptDismissed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, loading]);

useEffect(() => {
  if (!isLeadComplete(lead)) return;

  const current = JSON.stringify(lead);

  if (current === lastSubmittedLead.current) return;

  const timer = setTimeout(() => {
    lastSubmittedLead.current = current;
    submitLead();
  }, 1000);

  return () => clearTimeout(timer);
}, [lead]);

useEffect(() => {
  if (isOpen || promptDismissed) return;

  const timer = setTimeout(() => {
    setShowPrompt(true);
  }, 5000);

  return () => clearTimeout(timer);
}, [isOpen, promptDismissed]);

function quickSend(text: string) {
  setMessage("");

  setTimeout(() => {
    sendMessage(text);
  }, 50);
}

  async function typeMessage(text: string) {
    let current = "";

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
      },
    ]);

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

      setLead((prev) => {
  const updated = {
    ...prev,
    ...data.leadUpdate,
    conversationSummary:
      data.conversationSummary ||
      prev.conversationSummary,
  };

  console.log("Updated Lead:", updated);

  return updated;
});

      setLoading(false);

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

      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

 async function submitLead() {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  leadId,
  ...lead,
  conversationSummary: lead.conversationSummary,
}),
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      console.error(data);
      return;
    }

    

    console.log("Lead submitted successfully.");
  } catch (error) {
    console.error(error);
  }
}

  if (!isOpen) {
  return (
    <>
      {showPrompt && (
        <div className="chat-invite">

          <button
            className="chat-invite-close"
            onClick={() => {
              setShowPrompt(false);
              setPromptDismissed(true);
            }}
          >
            ✕
          </button>

          <h4>Need help planning your event?</h4>

          <p>
           Tell us about the celebration you have in mind. We'll help bring it to life.
          </p>

          <button
            className="chat-invite-button"
            onClick={() => {
              setShowPrompt(false);
              setIsOpen(true);
            }}
          >
            Chat with Virya AI
          </button>

        </div>
      )}

      <button
        className="chat-launcher"
        onClick={() => setIsOpen(true)}
      >
        <img
          src="/virya-ai-orb.png"
          alt="Virya AI"
          className="chat-launcher-logo"
        />
      </button>
    </>
  );
}

  return (    <div className="chatbot-container">

      <div className="chat-header">

        <div className="chat-header-left">

          <img
            src="/virya-ai-orb.png"
            alt="Virya AI"
            className="chat-header-avatar"
          />

          <div className="chat-header-info">

            <h3>
              Virya <span>AI</span>
            </h3>

            <div className="chat-subtitle">
              Your Event Planning Assistant
            </div>

            <div className="chat-divider"></div>

            <div className="chat-status">

              <span className="status-dot"></span>

              <span className="status-online">
                Online
              </span>

              <span className="status-separator">
                •
              </span>

              <span className="status-text">
                Typically replies instantly
              </span>

            </div>

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

        {messages.map((msg, index) =>

          msg.role === "assistant" ? (

            <div
              key={index}
              className="assistant-row"
            >

              <img
                src="/virya-ai-orb.png"
                alt="Virya AI"
                className="assistant-avatar"
              />

              <div className="assistant-message">
                {msg.content}
              </div>

            </div>

          ) : (

            <div
              key={index}
              className="user-message"
            >
              {msg.content}
            </div>

          )

        )}

        {loading && (

          <div className="assistant-row">

            <img
              src="/virya-ai-orb.png"
              alt="Virya AI"
              className="assistant-avatar"
            />

            <div className="assistant-message typing">
              Planning your event...
            </div>

          </div>

        )}

        <div ref={messagesEndRef} />

      </div>

      {messages.length === 1 && (

        <div className="quick-actions-wrapper">

          <div className="quick-title">
            Quick Start
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

