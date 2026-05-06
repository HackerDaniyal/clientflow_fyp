"use client";

import React, { useState } from "react";
import { Bot, X, Sparkles, Send } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

export function AISidebar() {
  const { aiSidebarOpen, toggleAISidebar } = useAppStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { role: "ai", content: "Hi! I'm your AI assistant. I can help you draft proposals, summarize chats, generate invoices, and more. How can I help you today?" }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { role: "user", content: message }]);
    setMessage("");
    
    // Simulate AI response (mock)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "This is a mock AI response. In the full implementation, this will connect to the Gemini API." 
      }]);
    }, 1000);
  };

  const quickActions = [
    "Draft a proposal",
    "Summarize recent messages",
    "Generate invoice items",
    "Suggest contract clauses",
  ];

  if (!aiSidebarOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-background-card border-l border-border shadow-modal z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text-primary">AI Assistant</h3>
          <Sparkles className="w-4 h-4 text-primary-mid" />
        </div>
        <button
          onClick={toggleAISidebar}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-card p-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-primary"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border">
        <p className="text-xs text-text-secondary mb-2">Quick Actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => setMessage(action)}
              className="px-2 py-1 text-xs bg-primary-light text-primary rounded-button hover:bg-primary-light/70 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-primary text-white rounded-button hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
