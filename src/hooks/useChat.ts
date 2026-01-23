import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import { getMessages, sendMessage } from "@/lib/api";

const POLL_INTERVAL = 4000; // 4 seconds

export function useChat(phoneNumber: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const filterMessages = (msgs: ChatMessage[]): ChatMessage[] => {
    return msgs.filter((msg) => {
      // Hide tool call messages
      if (msg.content.startsWith("[TOOL_CALL]")) return false;
      if (msg.content.startsWith("[Guardrail]")) return false;
      return true;
    });
  };

  const fetchMessages = useCallback(async () => {
    if (!phoneNumber) return;

    try {
      const response = await getMessages(phoneNumber);
      const filtered = filterMessages(response.data);
      setMessages(filtered);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    }
  }, [phoneNumber]);

  const send = useCallback(
    async (messageBody: string) => {
      if (!phoneNumber || !messageBody.trim()) return;

      setIsSending(true);
      try {
        // Format phone with +1 prefix if not present
        const formattedPhone = phoneNumber.startsWith("+1")
          ? phoneNumber
          : `+1${phoneNumber}`;

        await sendMessage({
          from_phone: formattedPhone,
          message_body: messageBody,
        });

        // Fetch messages immediately after sending
        await fetchMessages();
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [phoneNumber, fetchMessages]
  );

  // Initial fetch and polling setup
  useEffect(() => {
    if (!phoneNumber) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));

    // Start polling
    pollIntervalRef.current = setInterval(fetchMessages, POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [phoneNumber, fetchMessages]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    send,
    refresh: fetchMessages,
  };
}
