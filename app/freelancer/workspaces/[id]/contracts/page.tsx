"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileSignature, Eye, Send, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { toast } from "sonner";

interface Contract {
  id: string;
  title: string;
  status: "draft" | "sent" | "signed" | "expired";
  created_at: string;
  sent_at?: string;
  signed_at?: string;
  expires_at: string;
  client_name: string;
}

const mockContracts: Contract[] = [
  { id: "1", title: "Website Development Contract", status: "signed", created_at: "2024-01-20", sent_at: "2024-01-21", signed_at: "2024-01-22", expires_at: "2024-07-20", client_name: "Sarah Miller" },
  { id: "2", title: "Mobile App Development Agreement", status: "signed", created_at: "2024-02-25", sent_at: "2024-02-26", signed_at: "2024-02-28", expires_at: "2024-08-25", client_name: "Michael Chen" },
  { id: "3", title: "Fitness Platform Contract", status: "sent", created_at: "2024-03-01", sent_at: "2024-03-02", expires_at: "2024-09-01", client_name: "Lisa Thompson" },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState(mockContracts);

  const getStatusBadge = (status: Contract["status"]) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft"> = {
      draft: "draft",
      sent: "warning",
      signed: "success",
      expired: "error",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleSend = (id: string) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "sent" as const, sent_at: new Date().toISOString().split("T")[0] } : c
      )
    );
    toast.success("Contract sent for signature!", {
      description: "The client will receive an email to sign.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Contracts</h2>
          <p className="text-text-secondary mt-1">Manage contracts and e-signatures</p>
        </div>
        <Button className="flex items-center gap-2">
          <FileSignature className="w-4 h-4" />
          New Contract
        </Button>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.map((contract) => (
          <Card key={contract.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    {contract.title}
                  </h3>
                  {getStatusBadge(contract.status)}
                </div>
                <p className="text-sm text-text-secondary">
                  Client: {contract.client_name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-border text-sm">
              <div className="text-text-secondary">
                <p className="text-xs mb-1">Created</p>
                <p className="font-medium text-text-primary">{contract.created_at}</p>
              </div>
              <div className="text-text-secondary">
                <p className="text-xs mb-1">Sent</p>
                <p className="font-medium text-text-primary">{contract.sent_at || "Not sent"}</p>
              </div>
              <div className="text-text-secondary">
                <p className="text-xs mb-1">Signed</p>
                <p className="font-medium text-text-primary">{contract.signed_at || "Pending"}</p>
              </div>
              <div className="text-text-secondary">
                <p className="text-xs mb-1">Expires</p>
                <p className="font-medium text-text-primary">{contract.expires_at}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ["sent", "signed"].includes(contract.status) ? "bg-green-100" : "bg-gray-200"
                }`}>
                  <Send className={`w-4 h-4 ${["sent", "signed"].includes(contract.status) ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  contract.status === "signed" ? "bg-green-100" : "bg-gray-200"
                }`}>
                  <CheckCircle className={`w-4 h-4 ${contract.status === "signed" ? "text-green-600" : "text-gray-400"}`} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                View Contract
              </Button>
              {contract.status === "draft" && (
                <Button
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleSend(contract.id)}
                >
                  <Send className="w-4 h-4" />
                  Send for Signature
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {contracts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileSignature className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No contracts yet</h3>
            <p className="text-text-secondary mb-4">
              Create your first contract to formalize the project agreement.
            </p>
            <Button>
              <FileSignature className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
