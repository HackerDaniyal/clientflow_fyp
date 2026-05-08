"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMessagesByWorkspace, Message } from "@/lib/mock/messages";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Paperclip,
  Image,
  Mic,
  FileText,
  Download,
  Calendar,
  User
} from "lucide-react";

export default function WorkspaceChat() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [messages, setMessages] = useState(getMessagesByWorkspace(workspaceId));
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: String(messages.length + 1),
      workspace_id: workspaceId,
      sender_id: "1",
      sender_name: "Alex Johnson",
      content: newMessage,
      message_type: "text",
      is_internal: false,
      created_at: new Date().toLocaleString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageTypeIcon = (type: Message["message_type"]) => {
    switch (type) {
      case "file":
        return <FileText className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "voice":
        return <Mic className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isCurrentUser = (senderId: string) => senderId === "1";

  return (
    <div className="flex flex-col h-[calc(100vh-340px)]">
      {/* Chat Header */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Project Chat</h2>
            <p className="text-sm text-text-secondary mt-1">
              {messages.length} messages • Communicate with your client
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Call
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 overflow-y-auto p-6 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isCurrentUser(message.sender_id) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${
                  isCurrentUser(message.sender_id) ? "order-2" : "order-1"
                }`}
              >
                {/* Sender Info */}
                {!isCurrentUser(message.sender_id) && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-text-secondary">
                      {message.sender_name}
                    </span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl ${
                    isCurrentUser(message.sender_id)
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-gray-100 text-text-primary rounded-bl-sm"
                  }`}
                >
                  {message.message_type !== "text" && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-current/20">
                      {getMessageTypeIcon(message.message_type)}
                      <span className="text-sm font-medium">
                        {message.message_type.charAt(0).toUpperCase() + message.message_type.slice(1)}
                      </span>
                      {message.file_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 ml-auto ${
                            isCurrentUser(message.sender_id)
                              ? "text-white hover:bg-white/20"
                              : "text-text-secondary hover:bg-gray-200"
                          }`}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  <div
                    className={`text-xs mt-2 ${
                      isCurrentUser(message.sender_id)
                        ? "text-white/70"
                        : "text-text-secondary"
                    }`}
                  >
                    {message.created_at}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No messages yet</h3>
              <p className="text-text-secondary">Start the conversation with your client</p>
            </div>
          </div>
        )}
      </Card>

      {/* Message Input */}
      <Card className="p-4">
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Paperclip className="w-5 h-5 text-text-secondary" />
            </Button>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Image className="w-5 h-5 text-text-secondary" />
            </Button>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <Mic className="w-5 h-5 text-text-secondary" />
            </Button>
          </div>

          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[44px] max-h-[120px]"
              rows={1}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="h-10 px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
