"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { getProposalsByWorkspace, Proposal } from "@/lib/mock/proposals";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Download,
  Send,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export default function WorkspaceProposals() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [proposals, setProposals] = useState(getProposalsByWorkspace(workspaceId));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProposals = proposals.filter((proposal) =>
    proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proposal.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Proposal["status"]) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft" | "default"> = {
      draft: "draft",
      sent: "default",
      viewed: "warning",
      accepted: "success",
      declined: "error",
      expired: "draft",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </Badge>
    );
  };

  const handleDelete = (id: string, title: string) => {
    setProposals(proposals.filter(p => p.id !== id));
    toast.success("Proposal deleted", {
      description: `${title} has been removed`,
    });
  };

  const handleSend = (id: string, title: string) => {
    setProposals(proposals.map(p => 
      p.id === id ? { ...p, status: "sent" as const, sent_at: new Date().toISOString().split("T")[0] } : p
    ));
    toast.success("Proposal sent!", {
      description: `${title} has been sent to the client`,
    });
  };

  const totalValue = proposals.reduce((sum, p) => sum + p.total, 0);
  const acceptedValue = proposals.filter(p => p.status === "accepted").reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Proposals</h2>
          <p className="text-text-secondary mt-1">Create and manage project proposals</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total Proposals</p>
              <p className="text-2xl font-bold text-slate-900">{proposals.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 flex-shrink-0">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Accepted Value</p>
              <p className="text-2xl font-bold text-slate-900">${acceptedValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <Card key={proposal.id} className="p-6 hover:shadow-lg transition-all border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{proposal.title}</h3>
                  {getStatusBadge(proposal.status)}
                </div>
                <p className="text-sm text-text-secondary">Client: {proposal.client_name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary">${proposal.total.toLocaleString()}</p>
                <p className="text-xs text-text-secondary mt-1">Total Amount</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="font-medium text-slate-900">{proposal.created_at}</p>
                </div>
              </div>
              {proposal.sent_at && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Send className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Sent</p>
                    <p className="font-medium text-slate-900">{proposal.sent_at}</p>
                  </div>
                </div>
              )}
              {proposal.expires_at && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Expires</p>
                    <p className="font-medium text-slate-900">{proposal.expires_at}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                Download
              </Button>
              {proposal.status === "draft" && (
                <>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center gap-1 bg-primary hover:bg-orange-600"
                    onClick={() => handleSend(proposal.id, proposal.title)}
                  >
                    <Send className="w-4 h-4" />
                    Send to Client
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 ml-auto hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                onClick={() => handleDelete(proposal.id, proposal.title)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProposals.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No proposals found</h3>
            <p className="text-text-secondary mb-4">
              Create your first proposal to send to the client.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Proposal
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
