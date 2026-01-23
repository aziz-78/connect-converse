export interface ChatMessage {
  id: number;
  conversationId: number;
  sender_type: "agent" | "human";
  sender_id: string | null;
  content: string;
  parsed_payload: Record<string, unknown> | null;
  created_at: string;
}

export interface GetMessagesResponse {
  message: string;
  data: ChatMessage[];
}

export interface SendMessagePayload {
  from_phone: string;
  message_body: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  label?: string;
}
