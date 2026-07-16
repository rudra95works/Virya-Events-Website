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

  const [messages, setMessages] = useState<Message[]>([]);

 const [loading, setLoading] = useState(false);
const [isOpen, setIsOpen] = useState(false);

const [showLeadForm, setShowLeadForm] = useState(true);

const [leadId, setLeadId] = useState("");



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


const [chatMode, setChatMode] = useState<"chat" | "question">("chat");

const [currentQuestion, setCurrentQuestion] = useState("");
const [currentField, setCurrentField] = useState("");

const [options, setOptions] = useState<string[]>([]);
const [selectedOption, setSelectedOption] = useState("");
const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [showPrompt, setShowPrompt] = useState(false);
const [promptDismissed, setPromptDismissed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, loading]);



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

  const isSystemRequest =
  customMessage === "__SYSTEM_START__";

  const userMessage = customMessage ?? message;

  if (!isSystemRequest && !userMessage.trim()) return;

    const conversation: Message[] = isSystemRequest
  ? [...messages]
  : [
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
  leadId,
  lead,
  messages: conversation,
  field: currentField,
}),
      });

      const data = await res.json();

setChatMode(data.mode ?? "chat");
setCurrentQuestion(data.reply ?? "");
setCurrentField(data.field ?? "");
setOptions(data.options ?? []);
setSelectedOption("");

const updatedLead = {
  ...lead,
  ...data.leadUpdate,
  conversationSummary:
    data.conversationSummary ??
    lead.conversationSummary,
};

setLead(updatedLead);
if (leadId) {
  await fetch("/api/lead", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      leadId,
      ...updatedLead,
    }),
  });
}


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
        ...lead,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return false;
    }

    setLeadId(data.leadId);

    console.log("Lead Created:", data.leadId);

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}
async function startConversation() {

  if (!lead.name.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!lead.phone.trim()) {
    alert("Please enter your phone number.");
    return;
  }


  const success = await submitLead();

if (!success) return;

setShowLeadForm(false);

sendMessage("__SYSTEM_START__");
}

  if (!isOpen) {
  return (
    <>
      {!showLeadForm && chatMode !== "question" && (

<div className="chat-input">

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

  return (
  <div className="chatbot-container">

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
            <div className="whatsapp-banner">

  <div className="whatsapp-text">

    <strong>Prefer talking to a person?</strong>

    <span>
      Chat directly with a Virya Event Planner.
    </span>

  </div>

  <a
  href="https://wa.me/91YOURNUMBER"
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-button"
>
  WhatsApp
</a>

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

  {showLeadForm ? (

    <div className="lead-form">

     <h3>Let's start planning</h3>

<p>
  We'll guide you through your event in just a few simple steps.
</p>

<div className="lead-progress">
  Step 1 of 6
</div>

<div className="lead-progress-bar">
  <div className="lead-progress-fill"></div>
</div>

      

<input
  placeholder="Your Name *"
        value={lead.name}
        onChange={(e) =>
          setLead({
            ...lead,
            name: e.target.value,
          })
        }
      />

      

<input
  placeholder="Phone Number *"
        value={lead.phone}
        onChange={(e) =>
          setLead({
            ...lead,
            phone: e.target.value,
          })
        }
      />

      

<input
  placeholder="Email (Optional)"
        value={lead.email}
        onChange={(e) =>
          setLead({
            ...lead,
            email: e.target.value,
          })
        }
      />

      <button
        onClick={startConversation}
      >
        Continue →
      </button>

    </div>

  ) : (

    <>

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
      {!showLeadForm &&
chatMode === "question" &&
currentField !== "requirements" ? (

  currentField === "requirements" ? (

    <div className="requirements-box">

      <h3>
        Anything else you'd like us to know about your event?
      </h3>

      <p>
        This helps us personalise our recommendations.
      </p>

    </div>

  ) : options.length > 0 ? (

    <div className="guided-flow">

      <div className="guided-options">

        {options.map((option) => (

          <button
            key={option}
            className={`guided-option ${
              currentField === "services"
                ? selectedServices.includes(option)
                  ? "selected"
                  : ""
                : selectedOption === option
                  ? "selected"
                  : ""
            }`}
            onClick={() => {

              if (currentField === "services") {

                setSelectedServices((prev) =>
                  prev.includes(option)
                    ? prev.filter((item) => item !== option)
                    : [...prev, option]
                );

              } else {

                setSelectedOption(option);
                sendMessage(option);

              }

            }}
          >
            {option}
          </button>

        ))}

        {currentField === "services" && (
          <button
            className="continue-services"
            disabled={selectedServices.length === 0}
            onClick={() => {
              sendMessage(selectedServices.join(", "));
              setSelectedServices([]);
            }}
          >
            Continue
          </button>
        )}

      </div>

    </div>

  ) : null

) : null}

    </>

  )}

</div>

{!showLeadForm && (

  <div className="chat-footer">

    {chatMode === "question" &&
      currentField === "requirements" && (

      <div className="requirements-box">

  <p>
    Tell us anything else about your event and press Send.
  </p>

</div>

    )}

    <div className="chat-input">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          currentField === "requirements"
            ? "Tell us anything else about your event..."
            : "Ask Virya AI anything..."
        }
      />

      <button
        onClick={() => sendMessage()}
        disabled={loading}
      >
        Send
      </button>

    </div>

  </div>

)}

</div>

);
}


