"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProposals, Proposal, getProposalsByWorkspace } from "@/lib/mock/proposals";
import { Plus, Eye, Send, Edit, Trash2, DollarSign, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState(mockProposals);
  const [showBuilder, setShowBuilder] = useState(false);

  const getStatusBadge = (status: Proposal["status"]) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft" | "accepted"> = {
      draft: "draft",
      sent: "warning",
      viewed: "warning",
      accepted: "accepted",
      declined: "error",
      expired: "error",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleSend = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "sent" as const } : p))
    );
    toast.success("Proposal sent!", {
      description: "The client has received your proposal.",
    });
  };

  const handleDelete = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    toast.info("Proposal deleted");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Proposals</h2>
          <p className="text-text-secondary mt-1">Create and manage project proposals</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4" />
          New Proposal
        </Button>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-text-primary">
                    {proposal.title}
                  </h3>
                  {getStatusBadge(proposal.status)}
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Client: {proposal.client_name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <DollarSign className="w-4 h-4" />
                <span>Total: ${proposal.total.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>Expires: {proposal.expires_at || "N/A"}</span>
              </div>
              <div className="text-sm text-text-secondary">
                Created: {proposal.created_at}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                View
              </Button>
              {proposal.status === "draft" && (
                <>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleSend(proposal.id)}
                  >
                    <Send className="w-4 h-4" />
                    Send to Client
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-500"
                    onClick={() => handleDelete(proposal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Proposal Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Create Proposal</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowBuilder(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Proposal Title
                </label>
                <Input placeholder="e.g., Website Redesign Proposal" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Brief description of the proposal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Line Items
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">
                      <Input placeholder="Description" />
                    </div>
                    <div className="col-span-3">
                      <Input placeholder="Amount" type="number" />
                    </div>
                    <div className="col-span-3">
                      <Button variant="outline" className="w-full">Remove</Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Line Item
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Valid Until
                </label>
                <Input type="date" />
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={() => setShowBuilder(false)}>
                  Save as Draft
                </Button>
                <Button className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Client
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {proposals.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No proposals yet</h3>
            <p className="text-text-secondary mb-4">
              Create your first proposal to send to the client.
            </p>
            <Button onClick={() => setShowBuilder(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
