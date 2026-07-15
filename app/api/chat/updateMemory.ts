import { ConversationMemory } from "./memory";

export function updateMemory(
  memory: ConversationMemory,
  leadUpdate: any
): ConversationMemory {

  return {
    ...memory,

    lead: {
      name: leadUpdate.name || memory.lead.name,
      phone: leadUpdate.phone || memory.lead.phone,
      email: leadUpdate.email || memory.lead.email,
      eventType: leadUpdate.eventType || memory.lead.eventType,
      eventDate: leadUpdate.eventDate || memory.lead.eventDate,
      guests: leadUpdate.guests || memory.lead.guests,
      venue: leadUpdate.venue || memory.lead.venue,
      budget: leadUpdate.budget || memory.lead.budget,

      services:
        leadUpdate.services?.length
          ? leadUpdate.services
          : memory.lead.services,

      requirements:
        leadUpdate.requirements ||
        memory.lead.requirements,
    },
  };
}