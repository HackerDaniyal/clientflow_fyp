"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconMessageCircle, IconPaperclip, IconSend } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase";
import { sendMessage } from "@/app/workspace/[id]/actions";

export type ChatMessage = {
  id: string;
  workspace_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  file_url?: string | null;
  file_name?: string | null;
  sender?: {
    full_name: string | null;
    avatar_url?: string | null;
  } | null;
};

type WorkspaceChatProps = {
  workspaceId: string;
  initialMessages: ChatMessage[];
  canSend: boolean;
  onMessagesUpdated?: (messages: ChatMessage[]) => void;
};

export default function WorkspaceChat({
  workspaceId,
  initialMessages,
  canSend,
  onMessagesUpdated,
}: WorkspaceChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState("You");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        workspace_id,
        sender_id,
        content,
        created_at,
        file_url,
        file_name,
        sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
      `
      )
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) {
      console.error("fetchMessages:", error);
      return;
    }

    if (data) {
      const mapped = data.map((row) => {
        const sender = row.sender as ChatMessage["sender"] | ChatMessage["sender"][];
        return {
          ...row,
          sender: Array.isArray(sender) ? sender[0] ?? null : sender,
        };
      }) as ChatMessage[];
      setMessages(mapped);
      onMessagesUpdated?.(mapped);
    }
  }, [supabase, workspaceId, onMessagesUpdated]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (profile?.full_name) setCurrentUserName(profile.full_name);
    };
    void init();
  }, [supabase]);

  useEffect(() => {
    scrollToBottom(messages.length <= initialMessages.length ? "auto" : "smooth");
  }, [messages, scrollToBottom, initialMessages.length]);

  useEffect(() => {
    const channel = supabase
      .channel(`workspace-messages-${workspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => {
          void fetchMessages();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void fetchMessages();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, supabase, fetchMessages]);

  const handleSendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !currentUserId || sending) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      workspace_id: workspaceId,
      sender_id: currentUserId,
      content: text,
      created_at: new Date().toISOString(),
      sender: { full_name: currentUserName },
    };

    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
    setSending(true);
    scrollToBottom();

    try {
      await sendMessage(workspaceId, text);
      await fetchMessages();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setNewMessage(text);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="card bg-white flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 300px)", minHeight: "420px" }}
    >
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <IconMessageCircle size={48} className="mx-auto text-text-tertiary opacity-20 mb-3" />
            <p className="text-text-secondary">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[min(85%,420px)] flex-col gap-1 ${
                      isOwn ? "items-end" : "items-start"
                    }`}
                  >
                    {!isOwn && (
                      <span className="text-[11px] font-medium text-text-tertiary px-1">
                        {message.sender?.full_name || "Unknown"}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                        isOwn
                          ? "bg-brand-dark text-white rounded-br-md"
                          : "bg-brand-surface text-brand-dark border border-brand-light rounded-bl-md"
                      } ${message.id.startsWith("temp-") ? "opacity-80" : ""}`}
                    >
                      {message.content}
                    </div>
                    <span
                      className={`text-[10px] text-text-tertiary px-1 ${
                        isOwn ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {canSend ? (
        <div className="border-t border-brand-light/50 p-4 bg-white">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="p-2.5 hover:bg-brand-light/30 rounded-lg transition-colors shrink-0"
              aria-label="Attach file"
            >
              <IconPaperclip size={20} className="text-text-secondary" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-brand-surface border border-brand-light rounded-full px-4 py-2.5 text-[14px] outline-none focus:border-brand-accent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSendMessage();
                }
              }}
              disabled={sending}
            />
            <button
              type="button"
              onClick={() => void handleSendMessage()}
              disabled={sending || !newMessage.trim()}
              className="pill-btn bg-brand-mid hover:bg-brand-green text-white rounded-full w-11 h-11 p-0 flex items-center justify-center shrink-0 disabled:opacity-50"
              aria-label="Send message"
            >
              <IconSend size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-brand-light/50 p-4 text-center text-[13px] text-text-secondary">
          You have read-only access to this chat.
        </div>
      )}
    </div>
  );
}
