"use client";

import React, { useState } from "react";
import { mockRequests, ClientRequest } from "@/lib/mock/requests";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Search,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Eye,
  FolderPlus
} from "lucide-react";

export default function RequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAccept = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "accepted" as const } : req))
    );
    toast.success("Request accepted!", {
      description: "The client has been notified of your acceptance.",
    });
    setSelectedRequest(null);
  };

  const handleDecline = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "declined" as const } : req))
    );
    toast.error("Request declined", {
      description: "The client has been notified.",
    });
    setSelectedRequest(null);
  };

  const handleRequestInfo = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "info_requested" as const } : req))
    );
    toast.info("Information requested", {
      description: "Client will receive a message with your questions.",
    });
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: ClientRequest["status"]) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft"> = {
      pending: "warning",
      accepted: "success",
      declined: "error",
      info_requested: "draft",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Request Inbox</h1>
          <p className="text-text-secondary mt-1">Review and respond to client project requests</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                placeholder="Search by client name, project, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="info_requested">Info Requested</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Pending</p>
              <p className="text-2xl font-bold text-text-primary">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Accepted</p>
              <p className="text-2xl font-bold text-text-primary">
                {requests.filter((r) => r.status === "accepted").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Declined</p>
              <p className="text-2xl font-bold text-text-primary">
                {requests.filter((r) => r.status === "declined").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Info Requested</p>
              <p className="text-2xl font-bold text-text-primary">
                {requests.filter((r) => r.status === "info_requested").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  {request.project_name}
                </h3>
                <p className="text-sm text-text-secondary">{request.project_type}</p>
              </div>
              {getStatusBadge(request.status)}
            </div>

            <p className="text-sm text-text-secondary mb-4 line-clamp-2">
              {request.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="w-4 h-4" />
                <span>{request.client_name} ({request.client_email})</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <DollarSign className="w-4 h-4" />
                  <span>{request.budget_range}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {request.deadline}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedRequest(request)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              {request.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRequestInfo(request.id)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Request Info
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDecline(request.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAccept(request.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                </>
              )}
              {request.status === "accepted" && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    toast.success("Creating workspace...", {
                      description: `Setting up workspace for ${request.project_name}`,
                    });
                  }}
                >
                  <FolderPlus className="w-4 h-4 mr-1" />
                  Create Workspace
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">
                  {selectedRequest.project_name}
                </h2>
                <p className="text-text-secondary">{selectedRequest.project_type}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRequest(null)}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Client Information</h3>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p><strong>Name:</strong> {selectedRequest.client_name}</p>
                  <p><strong>Email:</strong> {selectedRequest.client_email}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-2">Project Description</h3>
                <p className="text-sm text-text-secondary">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Budget</h3>
                  <p className="text-lg font-bold text-text-primary">{selectedRequest.budget_range}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Deadline</h3>
                  <p className="text-lg font-bold text-text-primary">{selectedRequest.deadline}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-2">Status</h3>
                {getStatusBadge(selectedRequest.status)}
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleRequestInfo(selectedRequest.id)}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Request Info
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDecline(selectedRequest.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleAccept(selectedRequest.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No requests found</h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
