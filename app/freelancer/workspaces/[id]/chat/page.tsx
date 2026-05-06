"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockMessages, Message, getMessagesByWorkspace } from "@/lib/mock/messages";
import { Send, Paperclip, Smile, ToggleLeft, ToggleRight } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showInternal, setShowInternal] = useState(false);
  const currentUserId = "1"; // Mock current user ID

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Chat</h2>
          <p className="text-text-secondary mt-1">Communicate with your client</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">
            {showInternal ? "Internal Team" : "Client Thread"}
          </span>
          <button onClick={() => setShowInternal(!showInternal)}>
            {showInternal ? (
              <ToggleRight className="w-6 h-6 text-primary" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="p-6 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages
            .filter((msg) => msg.is_internal === showInternal)
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.sender_id === currentUserId
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-primary"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold">
                      {message.sender_id === currentUserId ? "You" : message.sender_name}
                    </span>
                    <span className="text-xs opacity-75">{message.created_at}</span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  {message.file_url && (
                    <div className="mt-2 flex items-center gap-2 text-xs opacity-75">
                      <Paperclip className="w-3 h-3" />
                      {message.file_url.split("/").pop()}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Paperclip className="w-5 h-5 text-text-secondary" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Smile className="w-5 h-5 text-text-secondary" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newMessage.trim()) {
                  const newMsg: Message = {
                    id: String(messages.length + 1),
                    workspace_id: "1",
                    sender_id: currentUserId,
                    sender_name: "Alex Johnson",
                    content: newMessage,
                    message_type: "text",
                    is_internal: showInternal,
                    created_at: new Date().toLocaleString(),
                  };
                  setMessages([...messages, newMsg]);
                  setNewMessage("");
                }
              }}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => {
                if (newMessage.trim()) {
                  const newMsg: Message = {
                    id: String(messages.length + 1),
                    workspace_id: "1",
                    sender_id: currentUserId,
                    sender_name: "Alex Johnson",
                    content: newMessage,
                    message_type: "text",
                    is_internal: showInternal,
                    created_at: new Date().toLocaleString(),
                  };
                  setMessages([...messages, newMsg]);
                  setNewMessage("");
                }
              }}
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
