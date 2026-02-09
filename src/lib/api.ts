import { GetMessagesResponse, SendMessagePayload } from "@/types/chat";

// API Configuration
export const API_CONFIG = {
  sendMessage: "http://127.0.0.1:8000/api/v1/chat-webhook",
  getMessages: "http://localhost:3000/api/chat/getTwilioMessageLogs",
};

export async function sendMessage(payload: SendMessagePayload): Promise<void> {
  const response = await fetch(API_CONFIG.sendMessage, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
}

export async function getMessages(phone: string): Promise<GetMessagesResponse> {
  // Remove +1 prefix if present for the API call
  const cleanPhone = phone.replace(/^\+1/, "");
  
  const response = await fetch(API_CONFIG.getMessages, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: cleanPhone }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }

  return response.json();
}
