"use client";

import React from "react";
import { IconCheck, IconX, IconAlertCircle, IconPhoto, IconFile } from "@tabler/icons-react";
import type { ProjectRequestRow } from "./types";

export function RequestDetailModal({
  request,
  clientName,
  isPending,
  onClose,
  onAccept,
  onReject,
}: {
  request: ProjectRequestRow;
  clientName: string;
  isPending: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const fd = request.form_data;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-brand-dark">Project Request Details</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-brand-light/30 rounded-lg">
            <IconX size={20} />
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          <strong>Client:</strong> {clientName}
        </p>
        <div className="space-y-6">
          <section>
            <h3 className="section-title">Project Information</h3>
            <div className="bg-brand-surface rounded-lg p-4 space-y-2 text-[13px]">
              <p><strong>Name:</strong> {fd?.project_name}</p>
              <p><strong>Type:</strong> {fd?.project_type}</p>
              <p><strong>Budget:</strong> {fd?.budget_range}</p>
              <p>
                <strong>Timeline:</strong> {fd?.timeline_start || "Not set"} →{" "}
                {fd?.timeline_end || "Not set"}
              </p>
              <p><strong>Description:</strong> {fd?.description}</p>
            </div>
          </section>
          <section>
            <h3 className="section-title">Business Information</h3>
            <div className="bg-brand-surface rounded-lg p-4 space-y-2 text-[13px]">
              <p><strong>Business Name:</strong> {fd?.business_name}</p>
              <p><strong>Industry:</strong> {fd?.industry}</p>
              <p><strong>Target Audience:</strong> {fd?.target_audience}</p>
            </div>
          </section>
          {fd?.platforms && fd.platforms.length > 0 && (
            <section>
              <h3 className="section-title">Technical Requirements</h3>
              <div className="bg-brand-surface rounded-lg p-4 text-[13px]">
                <p><strong>Platforms:</strong> {fd.platforms.join(", ")}</p>
                {fd.technology_preferences && (
                  <p className="mt-2">
                    <strong>Technology:</strong> {fd.technology_preferences}
                  </p>
                )}
              </div>
            </section>
          )}
          {fd?.assets && (
            <section>
              <h3 className="section-title">Uploaded Assets</h3>
              <div className="bg-brand-surface rounded-lg p-4 space-y-3">
                {fd.assets.logo && (
                  <div>
                    <p className="text-[12px] font-medium text-brand-dark mb-2">Logo</p>
                    <a
                      href={fd.assets.logo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-brand-light rounded-lg text-[12px]"
                    >
                      <IconPhoto size={16} className="text-brand-mid" />
                      {fd.assets.logo.name}
                    </a>
                  </div>
                )}
                {fd.assets.references && fd.assets.references.length > 0 && (
                  <div>
                    <p className="text-[12px] font-medium text-brand-dark mb-2">
                      Reference Images ({fd.assets.references.length})
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {fd.assets.references.map((ref, i) => (
                        <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={ref.url}
                            alt={ref.name}
                            className="w-full h-16 object-cover rounded-lg border border-brand-light"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {fd.assets.documents && fd.assets.documents.length > 0 && (
                  <div>
                    <p className="text-[12px] font-medium text-brand-dark mb-2">
                      Documents ({fd.assets.documents.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fd.assets.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-brand-light rounded-lg text-[12px]"
                        >
                          <IconFile size={16} className="text-brand-mid" />
                          {doc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
          {request.status === "pending" && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onAccept}
                disabled={isPending}
                className="flex-1 pill-btn bg-brand-mid hover:bg-brand-green text-white disabled:opacity-50"
              >
                <IconCheck size={18} />
                Accept & Create Workspace
              </button>
              <button
                type="button"
                onClick={onReject}
                disabled={isPending}
                className="flex-1 pill-btn bg-status-danger text-white disabled:opacity-50"
              >
                <IconX size={18} />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RejectModal({
  rejectMessage,
  isPending,
  onChangeMessage,
  onCancel,
  onConfirm,
}: {
  rejectMessage: string;
  isPending: boolean;
  onChangeMessage: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <IconAlertCircle size={24} className="text-status-danger" />
          </div>
          <h2 className="text-lg font-medium text-brand-dark">Reject Request</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          The client will be notified of this decision.
        </p>
        <div className="space-y-1 mb-4">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            Reason (optional)
          </label>
          <textarea
            value={rejectMessage}
            onChange={(e) => onChangeMessage(e.target.value)}
            placeholder="Provide a reason for rejection..."
            rows={3}
            className="w-full bg-brand-surface border border-brand-light rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-brand-accent resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 pill-btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 pill-btn bg-status-danger text-white disabled:opacity-50"
          >
            {isPending ? "Rejecting..." : "Reject Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
