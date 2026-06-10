"use client";

import React, { useState } from "react";
import {
  IconTag,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconCopy,
  IconPower,
  IconDotsVertical,
} from "@tabler/icons-react";
import { useTransition } from "react";
import {
  updateCodeLabel,
  deleteReferralCode,
  toggleCodeStatus,
} from "./actions";

type ReferralCode = {
  id: string;
  code: string;
  label: string | null;
  is_active: boolean;
  use_count: number;
  max_uses: number;
  created_at: string;
};

type CampaignStats = {
  label: string;
  codeCount: number;
  totalUses: number;
  activeCodes: number;
};

export default function CampaignCodeList({
  codes,
  campaigns,
}: {
  codes: ReferralCode[];
  campaigns: CampaignStats[];
}) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const labels = campaigns.map((c) => c.label);
  const hasUnlabeled = codes.some((c) => !c.label);

  const filteredCodes =
    activeFilter === "all"
      ? codes
      : activeFilter === "unlabeled"
        ? codes.filter((c) => !c.label)
        : codes.filter((c) => c.label === activeFilter);

  function handleCopy(code: string, id: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleSaveLabel(id: string) {
    startTransition(async () => {
      await updateCodeLabel(id, editValue);
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteReferralCode(id);
    });
  }

  function handleToggleStatus(id: string, isActive: boolean) {
    startTransition(async () => {
      await toggleCodeStatus(id, !isActive);
      setMenuOpenId(null);
    });
  }

  return (
    <div className="space-y-4">
      {/* Campaign filter tabs */}
      {campaigns.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
              activeFilter === "all"
                ? "bg-brand-dark text-white"
                : "bg-brand-surface text-text-secondary hover:bg-brand-light/30"
            }`}
          >
            All ({codes.length})
          </button>
          {labels.map((label) => {
            const camp = campaigns.find((c) => c.label === label)!;
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === label
                    ? "bg-brand-accent text-white"
                    : "bg-brand-surface text-text-secondary hover:bg-brand-light/30"
                }`}
              >
                <IconTag size={12} />
                {label}
                <span
                  className={`text-[10px] ${
                    activeFilter === label ? "text-white/70" : "text-text-tertiary"
                  }`}
                >
                  {camp.codeCount}
                </span>
              </button>
            );
          })}
          {hasUnlabeled && (
            <button
              onClick={() => setActiveFilter("unlabeled")}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                activeFilter === "unlabeled"
                  ? "bg-gray-500 text-white"
                  : "bg-brand-surface text-text-secondary hover:bg-brand-light/30"
              }`}
            >
              Unlabeled ({codes.filter((c) => !c.label).length})
            </button>
          )}
        </div>
      )}

      {/* Code list */}
      {filteredCodes.length > 0 ? (
        <div className="space-y-3">
          {filteredCodes.map((code) => {
            const usagePercent =
              code.max_uses > 0 ? (code.use_count / code.max_uses) * 100 : 0;
            const isFull = usagePercent >= 100;
            const isEditing = editingId === code.id;
            const isMenuOpen = menuOpenId === code.id;

            return (
              <div
                key={code.id}
                className="card bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`border border-brand-light rounded-lg px-4 py-2 font-mono text-[15px] font-medium ${
                      isFull
                        ? "bg-red-50 text-red-600"
                        : "bg-brand-surface text-brand-dark"
                    }`}
                  >
                    {code.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          code.is_active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <p className="text-[13px] font-medium text-brand-dark">
                        {code.is_active ? "Active" : "Inactive"}
                      </p>
                      {/* Label display / edit */}
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-28 bg-brand-surface border border-brand-light rounded px-2 py-0.5 text-[12px] outline-none focus:border-brand-accent"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveLabel(code.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveLabel(code.id)}
                            className="p-0.5 text-brand-accent hover:bg-brand-accent/10 rounded"
                            disabled={isPending}
                          >
                            <IconCheck size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-0.5 text-text-tertiary hover:bg-gray-100 rounded"
                          >
                            <IconX size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          {code.label && (
                            <span className="text-[10px] bg-brand-surface text-brand-mid px-2 py-0.5 rounded-full flex items-center gap-1">
                              <IconTag size={10} />
                              {code.label}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-text-tertiary">
                      Created {new Date(code.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Usage */}
                  <div className="text-right">
                    <p className="text-[11px] text-text-tertiary uppercase tracking-wider">
                      Usage
                    </p>
                    <p
                      className={`text-[14px] font-medium ${
                        isFull ? "text-red-600" : "text-brand-dark"
                      }`}
                    >
                      {code.use_count} / {code.max_uses}
                    </p>
                    <div className="w-20 h-1.5 bg-brand-surface rounded-full mt-1 ml-auto overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isFull
                            ? "bg-red-500"
                            : usagePercent > 75
                              ? "bg-amber-500"
                              : "bg-brand-accent"
                        }`}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(code.code, code.id)}
                    className="p-2 text-text-secondary hover:text-brand-dark hover:bg-brand-surface rounded-lg transition-all"
                    title={copiedId === code.id ? "Copied!" : "Copy code"}
                  >
                    {copiedId === code.id ? (
                      <IconCheck size={18} className="text-brand-accent" />
                    ) : (
                      <IconCopy size={18} />
                    )}
                  </button>

                  {/* Actions menu */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpenId(isMenuOpen ? null : code.id)
                      }
                      className="p-2 text-text-tertiary hover:text-brand-dark hover:bg-brand-surface rounded-lg transition-all"
                    >
                      <IconDotsVertical size={18} />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 top-10 z-20 w-44 bg-white border border-brand-light rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-1">
                        <button
                          onClick={() => {
                            setEditingId(code.id);
                            setEditValue(code.label || "");
                            setMenuOpenId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-secondary hover:bg-brand-surface"
                        >
                          <IconEdit size={15} />
                          {code.label ? "Edit label" : "Add label"}
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(code.id, code.is_active)
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-text-secondary hover:bg-brand-surface"
                          disabled={isPending}
                        >
                          <IconPower size={15} />
                          {code.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <div className="border-t border-brand-light/30 my-1" />
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete referral code ${code.code}? This cannot be undone.`
                              )
                            )
                              handleDelete(code.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
                          disabled={isPending}
                        >
                          <IconTrash size={15} />
                          Delete code
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[13px] text-text-tertiary text-center py-6">
          No codes match this filter.
        </p>
      )}

      {/* Close menu on outside click */}
      {menuOpenId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setMenuOpenId(null)}
        />
      )}
    </div>
  );
}
