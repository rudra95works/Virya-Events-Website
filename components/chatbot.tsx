"use client";

import { useEffect, useRef, useState } from "react";
import "./chatbot.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  images?: string[];
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

  conversation: Message[];

  notificationSent: boolean;
};
export default function ChatBot() {

  const STORAGE_KEY = "virya-chat";

  const [message, setMessage] = useState("");

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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

  conversation: [],

  notificationSent: false,
});


const [chatMode, setChatMode] = useState<"chat" | "question" | "completed">("chat");

const [currentQuestion, setCurrentQuestion] = useState("");
const [currentField, setCurrentField] = useState("");
const answeredQuestions = [
  lead.eventType,
  lead.guests,
  lead.budget,
  lead.eventDate,
  lead.venue,
  lead.services.length > 0,
].filter(Boolean).length;

const totalQuestions = 6;

const currentStep = Math.min(answeredQuestions + 1, totalQuestions);

const progressPercent =
  (answeredQuestions / totalQuestions) * 100;

const [options, setOptions] = useState<string[]>([]);
const [selectedOption, setSelectedOption] = useState("");
const [selectedServices, setSelectedServices] = useState<string[]>([]);

 const [showPrompt, setShowPrompt] = useState(false);
const [startingChat, setStartingChat] = useState(false);
const [promptDismissed, setPromptDismissed] = useState(false);

const [showMenu, setShowMenu] = useState(false);

console.log({
  showPrompt,
  showLeadForm,
  isOpen,
  promptDismissed,
  chatMode,
});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, loading]);

useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return;

  try {
    const data = JSON.parse(saved);

    if (data.lead) setLead(data.lead);
    if (data.messages) setMessages(data.messages);
    if (data.leadId) setLeadId(data.leadId);

    setChatMode(data.chatMode ?? "chat");

setCurrentField(data.currentField ?? "");
setCurrentQuestion(data.currentQuestion ?? "");
setOptions(data.options ?? []);

setShowLeadForm(data.showLeadForm ?? true);

setSelectedServices(data.selectedServices ?? []);

setPromptDismissed(data.promptDismissed ?? false);

setIsOpen(data.isOpen ?? false);

  } catch (err) {
    console.error("Failed to restore chat:", err);
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
  lead,
  messages,
  leadId,
  chatMode,

  currentField,
  currentQuestion,
  options,

  showLeadForm,
  selectedServices,
  promptDismissed,
  isOpen,
})
  );
}, [
  lead,
  messages,
  leadId,
  chatMode,
  showLeadForm,
  selectedServices,
  promptDismissed,
  isOpen,
]);



useEffect(() => {
  if (isOpen || promptDismissed) return;

  const timer = setTimeout(() => {
    setShowPrompt(true);
  }, 5000);

  return () => clearTimeout(timer);
}, [isOpen, promptDismissed]);

useEffect(() => {

  function closeMenu() {
    setShowMenu(false);
  }

  if (showMenu) {
    document.addEventListener("click", closeMenu);
  }

  return () =>
    document.removeEventListener(
      "click",
      closeMenu
    );

}, [showMenu]);


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
  timestamp: new Date().toISOString(),
},
    ]);

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      setMessages((prev) => {
        const updated = [...prev];

       updated[updated.length - 1] = {
  ...updated[updated.length - 1],
  content: current,
};

        return updated;
      });

      await new Promise((resolve) =>
        setTimeout(resolve, 8)
      );
    }
  }

  async function uploadImages() {
  if (selectedImages.length === 0) return [];

  const formData = new FormData();

  selectedImages.forEach((image) => {
    formData.append("images", image);
  });

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
  const text = await res.text();
  console.error("Upload API response:", text);
  throw new Error(`Image upload failed (${res.status})`);
}

  const data = await res.json();

  return data.images;
}

async function sendMessage(
  customMessage?: string,
  leadOverride?: Lead
) {
  const isSystemRequest =
    customMessage === "__SYSTEM_START__";

  const userMessage = customMessage ?? message;
  const imagePreviews = selectedImages.map((file) =>
  URL.createObjectURL(file)
);


  if (!isSystemRequest && !userMessage.trim() && selectedImages.length === 0)
    return;

  const conversation: Message[] = isSystemRequest
  ? [...messages]
  : [
      ...messages,
     {
  role: "user",
  content: userMessage,
  timestamp: new Date().toISOString(),
  images: imagePreviews,
},
    ];

  setMessages(conversation);

  setMessage("");
  setLoading(true);

  try {
    
const uploadedImages = await uploadImages();

// Upload completed successfully.
// Clear the selection immediately.
setSelectedImages([]);

const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadId,
        lead: leadOverride ?? lead,
        messages: conversation,
        field: currentField,
        uploadedImages,
      }),
    });

    const data = await res.json();

    setChatMode(data.mode ?? "chat");

    if (data.mode === "completed") {
      setCurrentField("");
    }

    setCurrentQuestion(data.reply ?? "");

    if (data.mode === "question") {
      setCurrentField(data.field || "");
    } else {
      setCurrentField("");
    }

    setOptions(
      data.mode === "question"
        ? data.options || []
        : []
    );

    setSelectedOption("");

    setLoading(false);

    await typeMessage(
      data.reply ??
        "Sorry, I couldn't generate a response."
    );

    const updatedLead = {
      ...lead,
      ...data.leadUpdate,

      conversationSummary:
        data.conversationSummary ??
        lead.conversationSummary,

      conversation:
        data.mode === "chat"
          ? [
              ...(lead.conversation ?? []),
              
                {
  role: "user",
  content: userMessage,
  timestamp: new Date().toISOString(),
  images: imagePreviews,
},
              {
                role: "assistant",
                content:
                  data.reply ??
                  "Sorry, I couldn't generate a response.",
                timestamp: new Date().toISOString(),
              },
            ]
          : lead.conversation,
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
          uploadedImages,
        }),
      });
    }

    setSelectedImages([]);

 } catch (error) {

  console.error("SEND MESSAGE ERROR:", error);

  if (error instanceof Error) {
    console.error(error.stack);
  }

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content:
        error instanceof Error
          ? `Error: ${error.message}`
          : "Sorry, something went wrong.",
      timestamp: new Date().toISOString(),
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

 function handleImageUpload(
  e: React.ChangeEvent<HTMLInputElement>
) {
  console.log("🔥 handleImageUpload fired");

  const files = e.target.files;

  console.log("Files:", files);

  if (!files || files.length === 0) {
    console.log("No files selected");
    return;
  }

  const newFiles = Array.from(files);

  console.log("Adding:", newFiles);

  setSelectedImages((prev) => {
    const updated = [...prev, ...newFiles];
    console.log("Updated selectedImages:", updated);
    return updated;
  });

  e.target.value = "";
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

  setStartingChat(true);

  if (!lead.name.trim()) {
    alert("Please enter your name.");
    setStartingChat(false);
    return;
  }

  if (!/^\d{10}$/.test(lead.phone)) {
    alert("Please enter a valid 10-digit phone number.");
    setStartingChat(false);
    return;
  }

  const success = await submitLead();

  if (!success) {
    setStartingChat(false);
    return;
  }

  setShowLeadForm(false);

  await sendMessage("__SYSTEM_START__");

  setStartingChat(false);
}

function resetConversation() {
  localStorage.removeItem(STORAGE_KEY);

  setMessage("");
  setMessages([]);

  setLeadId("");

  setLead({
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
    conversation: [],
    notificationSent: false,
  });

  setChatMode("chat");

  setCurrentQuestion("");
  setCurrentField("");

  setOptions([]);
  setSelectedOption("");
  setSelectedServices([]);

  setShowLeadForm(true);
}

  if (!isOpen) {
  return (
    <>
      {showPrompt && !isOpen && !promptDismissed && (

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

<div className="chat-header-actions">

  <button
    className={`menu-btn ${showMenu ? "active" : ""}`}
    onClick={(e) => {
  e.stopPropagation();
  setShowMenu(!showMenu);
}}
  >
    ⋮
  </button>

  <button
    className="close-btn"
    onClick={() => {
      setShowMenu(false);
      setIsOpen(false);
    }}
  >
    ✕
  </button>

  {showMenu && (
    <div className="chat-menu">

      <button
        className="chat-menu-item"
        onClick={() => {
          setShowMenu(false);
          resetConversation();
        }}
      >
        <strong>Planning another event?</strong>

        <span>
          Start fresh and plan a new celebration.
        </span>

      </button>

    </div>
  )}

</div>

</div>

{chatMode === "question" && currentStep <= 6 && (
  <div className="chat-progress-wrapper">
    <div className="chat-progress-text">
      Step {currentStep} of 6 • {Math.round(progressPercent)}% Complete
    </div>

    <div className="chat-progress-bar">
      <div
        className="chat-progress-fill"
        style={{
          width: `${progressPercent}%`,
        }}
      />
    </div>
  </div>
)}

<div className="chat-messages">

  {showLeadForm ? (

    <div className="lead-form">

     <h3>Let's start planning</h3>

<p>
  We'll guide you through your event in just a few simple steps.
</p>


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
  type="tel"
  inputMode="numeric"
  maxLength={10}
  placeholder="Phone Number *"
  value={lead.phone}
  onChange={(e) =>
    setLead({
      ...lead,
      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
    })
  }
/>
      

<input
  placeholder="Email for Event Updates (Optional)"
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
  disabled={startingChat}
>
  {startingChat
  ? "Starting your planning session..."
  : "Continue →"}
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

  {msg.content.split("Requirements Analyzed").map((part, index, array) => (
    <span key={index}>
      {part}
      {index < array.length - 1 && (
        <div className="ai-status">
          Requirements Analyzed
        </div>
      )}
    </span>
  ))}

  {msg.timestamp && (
    <div className="message-time">
      {new Date(msg.timestamp).toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
})}
    </div>
  )}

</div>

          </div>

        ) : (

          <div
  key={index}
  className="user-message"
>

  {msg.images?.length ? (
    <div className="chat-image-grid">
      {msg.images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="chat-image"
        />
      ))}
    </div>
  ) : null}

  {msg.content}

  {msg.timestamp && (
    <div className="message-time">
      {new Date(msg.timestamp).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    </div>
  )}

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
options.length > 0 && (

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

    const updatedLead = {
  ...lead,
  services: selectedServices,
};

setLead(updatedLead);

sendMessage(
  selectedServices.join(", "),
  updatedLead
);

setSelectedServices([]);
  }}
>
  Continue
</button>
        )}

      </div>

    </div>

  )}

    </>

  )}

</div>
{!showLeadForm &&
(chatMode === "chat" || chatMode === "completed") && (

  <div className="chat-footer">

    <p className="chat-helper">
      Ask anything about your event or tell us any additional requirements so we can provide the most suitable recommendations.
    </p>

<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  multiple
  style={{ display: "none" }}
  onChange={handleImageUpload}
/>

{selectedImages.length > 0 && (
  <>
    <div className="image-count">
      {selectedImages.length}{" "}
      {selectedImages.length === 1
        ? "inspiration image selected"
        : "inspiration images selected"}
    </div>

    <div className="image-preview-row">
      {selectedImages.map((file, index) => (
        <div className="image-preview-wrapper" key={index}>

          <button
            className="remove-image"
            onClick={() =>
              setSelectedImages((prev) =>
                prev.filter((_, i) => i !== index)
              )
            }
          >
            ×
          </button>

          <img
            src={URL.createObjectURL(file as Blob)}
onError={(e) => console.error("Image preview failed", e)}
            alt={file.name}
            className="image-preview"
          />

        </div>
      ))}
    </div>
  </>
)}

   <div className="chat-input">

  <div className="input-wrapper">

    <button
      type="button"
      className="upload-btn"
      onClick={() => fileInputRef.current?.click()}
    >
      +
    </button>

    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Tell us more about the event..."
    />

  </div>

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