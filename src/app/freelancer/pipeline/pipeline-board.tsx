"use client";

import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArrowRight,
  IconArrowsMove,
  IconBriefcase,
  IconChevronDown,
  IconLayoutKanban,
  IconList,
  IconSearch,
} from "@tabler/icons-react";
import { updateWorkspaceStage } from "./actions";
import {
  DEFAULT_PIPELINE_STAGE,
  PIPELINE_STAGES,
  STAGE_META,
  type PipelineStage,
} from "./constants";

export type PipelineWorkspace = {
  id: string;
  name: string;
  project_type: string | null;
  pipeline_stage: string | null;
  status: string;
  client: { full_name: string | null } | null;
};

type ViewMode = "list" | "board";

function getStage(workspace: PipelineWorkspace): PipelineStage {
  const stage = workspace.pipeline_stage || DEFAULT_PIPELINE_STAGE;
  return PIPELINE_STAGES.includes(stage as PipelineStage)
    ? (stage as PipelineStage)
    : DEFAULT_PIPELINE_STAGE;
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "active":
      return "badge-success";
    case "completed":
      return "badge-info";
    case "paused":
      return "badge-warning";
    default:
      return "bg-gray-100 text-text-secondary";
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function MoveStageMenu({
  currentStage,
  disabled,
  onMove,
  align = "left",
}: {
  currentStage: PipelineStage;
  disabled: boolean;
  onMove: (stage: PipelineStage) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const targets = PIPELINE_STAGES.filter((s) => s !== currentStage);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-medium border border-brand-light/80 bg-white px-2.5 py-1.5 text-[12px] font-medium text-brand-dark transition-colors hover:bg-brand-surface disabled:opacity-50"
      >
        <IconArrowsMove size={14} stroke={2} />
        Move
        <IconChevronDown
          size={14}
          stroke={2}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-30 mt-1 w-48 max-h-56 overflow-y-auto rounded-large border border-[rgba(0,0,0,0.08)] bg-white py-1 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {targets.map((stage) => {
            const meta = STAGE_META[stage];
            return (
              <button
                key={stage}
                type="button"
                role="menuitem"
                onClick={() => {
                  onMove(stage);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-text-primary hover:bg-brand-surface"
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                {stage}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PipelineCard({
  workspace,
  isPending,
  onMove,
  variant = "board",
}: {
  workspace: PipelineWorkspace;
  isPending: boolean;
  onMove: (workspaceId: string, stage: PipelineStage) => void;
  variant?: "board" | "list";
}) {
  const stage = getStage(workspace);
  const clientName = workspace.client?.full_name || "Unknown client";

  if (variant === "list") {
    return (
      <article className="flex flex-col gap-3 rounded-large border border-[rgba(0,0,0,0.08)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[12px] font-medium text-brand-dark">
            {getInitials(clientName)}
          </div>
          <div className="min-w-0">
            <Link
              href={`/workspace/${workspace.id}`}
              className="block truncate text-[14px] font-medium text-brand-dark hover:text-brand-mid"
            >
              {workspace.name}
            </Link>
            <p className="truncate text-[12px] text-text-secondary">{clientName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {workspace.project_type && (
            <span className="text-[11px] text-text-tertiary">{workspace.project_type}</span>
          )}
          <span className={`badge text-[10px] ${statusBadgeClass(workspace.status)}`}>
            {formatStatus(workspace.status)}
          </span>
          <Link
            href={`/workspace/${workspace.id}`}
            className="pill-btn-outline py-1.5 text-[12px]"
          >
            Open
          </Link>
          <MoveStageMenu
            currentStage={stage}
            disabled={isPending}
            align="right"
            onMove={(next) => onMove(workspace.id, next)}
          />
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-large border border-[rgba(0,0,0,0.08)] bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[11px] font-medium text-brand-dark">
          {getInitials(clientName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-text-secondary">{clientName}</p>
          <Link
            href={`/workspace/${workspace.id}`}
            className="line-clamp-2 text-[13px] font-medium leading-snug text-brand-dark hover:text-brand-mid"
          >
            {workspace.name}
          </Link>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className={`badge text-[10px] ${statusBadgeClass(workspace.status)}`}>
          {formatStatus(workspace.status)}
        </span>
        {workspace.project_type && (
          <span className="rounded-badge bg-brand-surface px-1.5 py-0.5 text-[10px] text-text-secondary">
            {workspace.project_type}
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <Link
          href={`/workspace/${workspace.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-medium bg-brand-dark py-1.5 text-[11px] font-medium text-white hover:bg-brand-mid"
        >
          Open
          <IconArrowRight size={12} stroke={2} />
        </Link>
        <MoveStageMenu
          currentStage={stage}
          disabled={isPending}
          onMove={(next) => onMove(workspace.id, next)}
        />
      </div>
    </article>
  );
}

function StageHeader({ stage, count }: { stage: PipelineStage; count: number }) {
  const meta = STAGE_META[stage];
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
      <h3 className="text-[13px] font-medium text-brand-dark">{stage}</h3>
      <span className="rounded-pill bg-brand-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary">
        {count}
      </span>
    </div>
  );
}

export default function PipelineBoard({ workspaces }: { workspaces: PipelineWorkspace[] }) {
  const router = useRouter();
  const [items, setItems] = useState(workspaces);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [hideEmpty, setHideEmpty] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(workspaces);
  }, [workspaces]);

  useEffect(() => {
    if (!feedback || feedback.type !== "success") return;
    const t = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(t);
  }, [feedback]);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return items;
    return items.filter((w) => {
      const client = w.client?.full_name?.toLowerCase() ?? "";
      const name = w.name.toLowerCase();
      const type = w.project_type?.toLowerCase() ?? "";
      return (
        name.includes(normalizedQuery) ||
        client.includes(normalizedQuery) ||
        type.includes(normalizedQuery)
      );
    });
  }, [items, normalizedQuery]);

  const byStage = (stage: PipelineStage) =>
    filtered.filter((w) => getStage(w) === stage);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((w) => {
      const s = getStage(w);
      return s === "In Progress" || s === "Review";
    }).length;
    const leads = items.filter((w) => getStage(w) === "Lead").length;
    const completed = items.filter((w) => getStage(w) === "Completed").length;
    return { total, active, leads, completed };
  }, [items]);

  const visibleStages = useMemo(() => {
    if (!hideEmpty) return PIPELINE_STAGES;
    return PIPELINE_STAGES.filter(
      (stage) => filtered.filter((w) => getStage(w) === stage).length > 0
    );
  }, [hideEmpty, filtered]);

  const move = (workspaceId: string, stage: PipelineStage) => {
    const previous = items;
    setItems((prev) =>
      prev.map((w) => (w.id === workspaceId ? { ...w, pipeline_stage: stage } : w))
    );
    setFeedback(null);

    startTransition(async () => {
      try {
        await updateWorkspaceStage(workspaceId, stage);
        setFeedback({ type: "success", text: `Moved to ${stage}` });
        router.refresh();
      } catch (err) {
        setItems(previous);
        const message = err instanceof Error ? err.message : "Could not update stage";
        setFeedback({ type: "error", text: message });
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
            Total
          </p>
          <p className="mt-0.5 text-xl font-medium text-brand-dark">{stats.total}</p>
        </div>
        <div className="card py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
            Active
          </p>
          <p className="mt-0.5 text-xl font-medium text-brand-dark">{stats.active}</p>
        </div>
        <div className="card py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
            Leads
          </p>
          <p className="mt-0.5 text-xl font-medium text-brand-dark">{stats.leads}</p>
        </div>
        <div className="card py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-secondary">
            Completed
          </p>
          <p className="mt-0.5 text-xl font-medium text-brand-dark">{stats.completed}</p>
        </div>
      </div>

      <div className="card flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <IconSearch
            size={18}
            stroke={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients or projects…"
            className="w-full rounded-medium border border-brand-light/80 bg-brand-surface/50 py-2 pl-10 pr-4 text-[14px] focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex rounded-medium border border-brand-light/80 p-0.5 bg-brand-surface/50"
            role="tablist"
            aria-label="Pipeline view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-text-secondary hover:text-brand-dark"
              }`}
            >
              <IconList size={15} stroke={2} />
              List
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "board"}
              onClick={() => setViewMode("board")}
              className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                viewMode === "board"
                  ? "bg-white text-brand-dark shadow-sm"
                  : "text-text-secondary hover:text-brand-dark"
              }`}
            >
              <IconLayoutKanban size={15} stroke={2} />
              Board
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-text-secondary">
            <input
              type="checkbox"
              checked={hideEmpty}
              onChange={(e) => setHideEmpty(e.target.checked)}
              className="h-4 w-4 rounded border-brand-light text-brand-mid"
            />
            Hide empty stages
          </label>
        </div>
      </div>

      {feedback && (
        <p
          role="status"
          className={`rounded-large px-4 py-2 text-[13px] ${
            feedback.type === "success"
              ? "bg-brand-tint text-brand-dark"
              : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <IconBriefcase size={36} stroke={1.5} className="mb-2 text-text-tertiary" />
          <p className="text-[15px] font-medium text-brand-dark">
            {items.length === 0 ? "No workspaces yet" : "No matches"}
          </p>
          {items.length === 0 && (
            <Link href="/freelancer/requests" className="pill-btn mt-4">
              View requests
              <IconArrowRight size={16} stroke={2} />
            </Link>
          )}
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-8">
          {visibleStages.length === 0 ? (
            <p className="text-[13px] text-text-secondary">
              All stages are empty. Uncheck &quot;Hide empty stages&quot; to see the full pipeline.
            </p>
          ) : (
            visibleStages.map((stage) => {
              const cards = byStage(stage);
              const meta = STAGE_META[stage];
              return (
                <section key={stage}>
                  <div className="mb-3 border-b border-[rgba(0,0,0,0.06)] pb-2">
                    <StageHeader stage={stage} count={cards.length} />
                    <p className="mt-1 text-[12px] text-text-tertiary">{meta.description}</p>
                  </div>
                  <div className="space-y-2">
                    {cards.map((ws) => (
                      <PipelineCard
                        key={ws.id}
                        workspace={ws}
                        isPending={isPending}
                        variant="list"
                        onMove={move}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <p className="border-b border-[rgba(0,0,0,0.06)] px-4 py-2 text-[12px] text-text-tertiary">
            Scroll horizontally between stages. Each column scrolls on its own if it has many
            projects.
          </p>
          <div
            className="overflow-x-auto overflow-y-hidden"
            style={{ height: "min(520px, calc(100vh - 22rem))" }}
          >
            <div className="flex h-full items-stretch gap-4 p-4 min-w-max">
              {visibleStages.length === 0 ? (
                <p className="p-4 text-[13px] text-text-secondary">
                  No stages with clients. Turn off &quot;Hide empty stages&quot; to show all columns.
                </p>
              ) : (
                visibleStages.map((stage) => {
                  const meta = STAGE_META[stage];
                  const cards = byStage(stage);
                  return (
                    <section
                      key={stage}
                      className={`flex h-full w-[260px] shrink-0 flex-col overflow-hidden rounded-large border ${meta.column}`}
                    >
                      <header className="shrink-0 border-b border-[rgba(0,0,0,0.06)] px-3 py-3">
                        <StageHeader stage={stage} count={cards.length} />
                      </header>

                      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
                        {cards.length === 0 ? (
                          <p className="px-2 py-3 text-center text-[11px] text-text-tertiary">
                            Empty
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {cards.map((ws) => (
                              <PipelineCard
                                key={ws.id}
                                workspace={ws}
                                isPending={isPending}
                                variant="board"
                                onMove={move}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
