"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileSignature,
  Plus,
  Search,
  Eye,
  Download,
  Send,
  Edit,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface Contract {
  id: string;
  title: string;
  clientName: string;
  status: "draft" | "sent" | "signed" | "expired" | "terminated";
  value: number;
  startDate: string;
  endDate: string;
  signedAt?: string;
  createdAt: string;
}

const mockContracts: Contract[] = [
  {
    id: "1",
    title: "Website Redesign Service Agreement",
    clientName: "Sarah Miller",
    status: "signed",
    value: 15000,
    startDate: "2024-01-20",
    endDate: "2024-04-15",
    signedAt: "2024-01-22",
    createdAt: "2024-01-21"
  },
  {
    id: "2",
    title: "Mobile App Development Contract",
    clientName: "Michael Chen",
    status: "signed",
    value: 22000,
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    signedAt: "2024-02-28",
    createdAt: "2024-02-27"
  }
];

export default function WorkspaceContracts() {
  const params = useParams();
  const [contracts, setContracts] = useState(mockContracts);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContracts = contracts.filter((contract) =>
    contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Contract["status"]) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft" | "default"> = {
      draft: "draft",
      sent: "default",
      signed: "success",
      expired: "error",
      terminated: "draft",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleDelete = (id: string, title: string) => {
    setContracts(contracts.filter(c => c.id !== id));
    toast.success("Contract deleted", {
      description: `"${title}" has been removed`,
    });
  };

  const handleSend = (id: string, title: string) => {
    setContracts(contracts.map(c => 
      c.id === id ? { ...c, status: "sent" as const } : c
    ));
    toast.success("Contract sent!", {
      description: `"${title}" has been sent for signature`,
    });
  };

  const handleSign = (id: string, title: string) => {
    setContracts(contracts.map(c => 
      c.id === id ? { ...c, status: "signed" as const, signedAt: new Date().toISOString().split("T")[0] } : c
    ));
    toast.success("Contract signed!", {
      description: `"${title}" has been executed`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Contracts</h2>
          <p className="text-text-secondary mt-1">Manage legal agreements and signatures</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0">
              <FileSignature className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total Contracts</p>
              <p className="text-2xl font-bold text-slate-900">{contracts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Signed</p>
              <p className="text-2xl font-bold text-slate-900">{contracts.filter(c => c.status === "signed").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{contracts.filter(c => c.status === "sent").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 flex-shrink-0">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">${contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="p-6 hover:shadow-lg transition-all border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{contract.title}</h3>
                  {getStatusBadge(contract.status)}
                </div>
                <p className="text-sm text-text-secondary">Client: {contract.clientName}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary">${contract.value.toLocaleString()}</p>
                <p className="text-xs text-text-secondary mt-1">Contract Value</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Start Date</p>
                  <p className="font-medium text-slate-900">{contract.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">End Date</p>
                  <p className="font-medium text-slate-900">{contract.endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="font-medium text-slate-900">{contract.createdAt}</p>
                </div>
              </div>
              {contract.signedAt && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-xs text-slate-500">Signed</p>
                    <p className="font-medium text-emerald-600">{contract.signedAt}</p>
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
              {contract.status === "draft" && (
                <>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center gap-1 bg-primary hover:bg-orange-600"
                    onClick={() => handleSend(contract.id, contract.title)}
                  >
                    <Send className="w-4 h-4" />
                    Send for Signature
                  </Button>
                </>
              )}
              {contract.status === "sent" && (
                <Button
                  size="sm"
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleSign(contract.id, contract.title)}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Signed
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 ml-auto hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                onClick={() => handleDelete(contract.id, contract.title)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredContracts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileSignature className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No contracts found</h3>
            <p className="text-text-secondary mb-4">
              Create a contract to formalize the project agreement.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Contract
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
