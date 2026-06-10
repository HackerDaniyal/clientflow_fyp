"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import {
  IconInbox,
  IconCheck,
  IconX,
  IconEye,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { acceptRequest, rejectRequest, requestInfo } from "./actions";
import { RequestDetailModal, RejectModal, RequestInfoModal } from "./request-modals";
import type { ProjectRequestRow } from "./types";

type FilterStatus = "all" | "pending" | "accepted" | "rejected" | "info_needed";

interface RequestsClientProps {
  requests: ProjectRequestRow[];
  fetchError: string | null;
  initialFilter: FilterStatus;
  freelancerId: string;
}

export default function RequestsClient({
  requests: initialRequests,
  fetchError,
  initialFilter,
  freelancerId,
}: RequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<FilterStatus>(initialFilter);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequestRow | null>(null);
  const [rejectMessage, setRejectMessage] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  // Sync initial requests when prop changes (after server revalidation)
  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  // Sync filter from URL
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  // Fetch requests for realtime refresh
  const fetchRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from("project_requests")
      .select(
        `
        *,
        client:profiles!project_requests_client_id_fkey(full_name)
      `
      )
      .eq("freelancer_id", freelancerId)
      .order("submitted_at", { ascending: false });

    if (!error && data) {
      const mapped: ProjectRequestRow[] = data.map((row: Record<string, unknown>) => {
        const client = row.client as
          | { full_name: string | null }
          | { full_name: string | null }[]
          | null;
        const clientObj = Array.isArray(client) ? client[0] ?? null : client;
        return {
          id: row.id as string,
          client_id: row.client_id as string,
          freelancer_id: row.freelancer_id as string,
          status: row.status as string,
          form_data: row.form_data as ProjectRequestRow["form_data"],
          submitted_at: row.submitted_at as string,
          responded_at: (row.responded_at as string) || null,
          client: clientObj,
        };
      });
      setRequests(mapped);
    }
  }, [supabase, freelancerId]);

  // Realtime subscription for project_requests
  useEffect(() => {
    const channel = supabase
      .channel("project-requests-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_requests",
          filter: `freelancer_id=eq.${freelancerId}`,
        },
        () => {
          fetchRequests();
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, freelancerId, fetchRequests, router]);

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const clientName = (request: ProjectRequestRow) =>
    request.client?.full_name || "Unknown Client";

  const handleAccept = (requestId: string) => {
    startTransition(async () => {
      try {
        await acceptRequest(requestId);
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: "accepted" } : r))
        );
        setSelectedRequest(null);
        setActionMessage({ type: "success", text: "Project accepted. Workspace created." });
        router.refresh();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setActionMessage({ type: "error", text: `Failed to accept: ${message}` });
      }
    });
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    startTransition(async () => {
      try {
        await rejectRequest(selectedRequest.id, rejectMessage);
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id ? { ...r, status: "rejected" } : r
          )
        );
        setSelectedRequest(null);
        setShowRejectModal(false);
        setRejectMessage("");
        setActionMessage({ type: "success", text: "Project request rejected." });
        router.refresh();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setActionMessage({ type: "error", text: `Failed to reject: ${message}` });
      }
    });
  };

  const handleRequestInfo = () => {
    if (!selectedRequest || !infoMessage.trim()) return;
    startTransition(async () => {
      try {
        await requestInfo(selectedRequest.id, infoMessage);
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id ? { ...r, status: "info_needed" } : r
          )
        );
        setSelectedRequest(null);
        setShowInfoModal(false);
        setInfoMessage("");
        setActionMessage({ type: "success", text: "Info request sent to client." });
        router.refresh();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        setActionMessage({ type: "error", text: `Failed to send: ${message}` });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "accepted":
        return <span className="badge badge-success">Accepted</span>;
      case "rejected":
        return <span className="badge badge-danger">Rejected</span>;
      case "info_needed":
        return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[11px] font-medium">Info Requested</span>;
      default:
        return null;
    }
  };

  const filterTabs: FilterStatus[] = ["all", "pending", "accepted", "rejected", "info_needed"];
  const filterLabel = (s: FilterStatus) => {
    if (s === "all") return "All";
    if (s === "info_needed") return "Info Needed";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium text-brand-dark">Project Requests</h1>
        <p className="text-sm text-text-secondary">
          Review and manage incoming client project requests.
        </p>
      </header>

      {fetchError && (
        <div className="card border-status-danger/30 bg-red-50 text-status-danger text-sm">
          <strong>Could not load requests:</strong> {fetchError}
        </div>
      )}

      {actionMessage && (
        <div
          className={`card text-sm ${
            actionMessage.type === "success"
              ? "bg-brand-tint text-brand-dark"
              : "bg-red-50 text-status-danger"
          }`}
        >
          {actionMessage.text}
          <button
            type="button"
            className="ml-3 underline text-[12px]"
            onClick={() => setActionMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/freelancer/requests" : `/freelancer/requests?status=${s}`}
            className={`px-3 py-1.5 rounded-medium text-[12px] font-medium transition-colors ${
              filter === s
                ? "bg-brand-dark text-white"
                : "bg-brand-surface text-text-secondary hover:bg-brand-tint"
            }`}
          >
            {filterLabel(s)}
            {s !== "all" && (
              <span className="ml-1 opacity-70">
                ({requests.filter((r) => r.status === s).length})
              </span>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-2">
          <IconInbox size={64} stroke={1.5} className="mx-auto text-text-tertiary mb-4 opacity-20" />
          <p className="text-text-secondary text-lg">
            {filter === "pending" ? "No pending requests" : "No project requests yet"}
          </p>
          <p className="text-text-tertiary text-sm mt-2">
            When clients submit projects, they appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((request) => (
            <div key={request.id} className="card bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[15px] font-medium text-brand-dark">
                      {request.form_data?.project_name || "Untitled Project"}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-[13px] text-text-secondary mb-1">
                    <strong>Client:</strong> {clientName(request)}
                  </p>
                  <p className="text-[12px] text-text-tertiary">
                    <strong>Type:</strong> {request.form_data?.project_type || "Not specified"} ·
                    <strong className="ml-2">Budget:</strong>{" "}
                    {request.form_data?.budget_range || "Not specified"} ·
                    <strong className="ml-2">Submitted:</strong>{" "}
                    {new Date(request.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {(request.status === "pending" || request.status === "info_needed") && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(request)}
                        className="pill-btn-outline text-[12px] px-3 py-1.5"
                      >
                        <IconEye size={16} />
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(request.id)}
                        disabled={isPending}
                        className="pill-btn bg-brand-mid hover:bg-brand-green text-white text-[12px] px-3 py-1.5 disabled:opacity-50"
                      >
                        <IconCheck size={16} />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowInfoModal(true);
                        }}
                        disabled={isPending}
                        className="pill-btn bg-amber-500 hover:bg-amber-600 text-white text-[12px] px-3 py-1.5 disabled:opacity-50"
                      >
                        <IconMessageCircle size={16} />
                        Info
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        disabled={isPending}
                        className="pill-btn bg-status-danger hover:opacity-90 text-white text-[12px] px-3 py-1.5 disabled:opacity-50"
                      >
                        <IconX size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === "accepted" && (
                    <span className="text-[11px] text-text-tertiary">Workspace created</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && !showRejectModal && !showInfoModal && (
        <RequestDetailModal
          request={selectedRequest}
          clientName={clientName(selectedRequest)}
          isPending={isPending}
          onClose={() => setSelectedRequest(null)}
          onAccept={() => handleAccept(selectedRequest.id)}
          onReject={() => setShowRejectModal(true)}
          onRequestInfo={() => setShowInfoModal(true)}
        />
      )}

      {showRejectModal && selectedRequest && (
        <RejectModal
          rejectMessage={rejectMessage}
          isPending={isPending}
          onChangeMessage={setRejectMessage}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectMessage("");
          }}
          onConfirm={handleReject}
        />
      )}

      {showInfoModal && selectedRequest && (
        <RequestInfoModal
          infoMessage={infoMessage}
          isPending={isPending}
          onChangeMessage={setInfoMessage}
          onCancel={() => {
            setShowInfoModal(false);
            setInfoMessage("");
          }}
          onConfirm={handleRequestInfo}
        />
      )}
    </div>
  );
}
