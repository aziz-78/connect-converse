import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { PhoneSelector } from "@/components/PhoneSelector";
import { useChat } from "@/hooks/useChat";
import { usePhoneNumbers } from "@/hooks/usePhoneNumbers";
import { Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { phones, selectedPhone, setSelectedPhone, addPhone, removePhone } =
    usePhoneNumbers();
  const { messages, isLoading, isSending, error, send, refresh } =
    useChat(selectedPhone);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">Real Estate Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <PhoneSelector
            phones={phones}
            selectedPhone={selectedPhone}
            onSelect={setSelectedPhone}
            onAdd={addPhone}
            onRemove={removePhone}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            disabled={!selectedPhone || isLoading}
            title="Refresh messages"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {!selectedPhone ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No phone selected</p>
            <p className="text-sm">Select a phone number to view messages</p>
          </div>
        ) : isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
            {error}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <ChatInput
        onSend={send}
        isSending={isSending}
        disabled={!selectedPhone}
      />
    </div>
  );
};

export default Index;
