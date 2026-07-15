export type ConversationMemory = {
  summary: string;

  lead: {
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
  };
};

export const EMPTY_MEMORY: ConversationMemory = {
  summary: "",

  lead: {
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
  },
};