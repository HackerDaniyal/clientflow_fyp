"use client";

import React, { useState } from "react";
import { mockLeads, Lead } from "@/lib/mock/leads";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  MoreHorizontal,
  ExternalLink,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const COLUMNS = [
  { id: "lead", title: "Lead", color: "bg-blue-500" },
  { id: "contacted", title: "Contacted", color: "bg-yellow-500" },
  { id: "proposal_sent", title: "Proposal Sent", color: "bg-purple-500" },
  { id: "negotiating", title: "Negotiating", color: "bg-orange-500" },
  { id: "won", title: "Won", color: "bg-green-500" },
  { id: "lost", title: "Lost", color: "bg-red-500" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLeadsByStatus = (status: Lead["status"]) =>
    filteredLeads.filter((lead) => lead.status === status);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedLeads = leads.map((lead) => {
      if (lead.id === draggableId) {
        return {
          ...lead,
          status: destination.droppableId as Lead["status"],
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
  };

  const getStatusIcon = (status: Lead["status"]) => {
    switch (status) {
      case "lead":
        return <AlertCircle className="w-4 h-4" />;
      case "contacted":
        return <MessageSquare className="w-4 h-4" />;
      case "proposal_sent":
        return <FileText className="w-4 h-4" />;
      case "negotiating":
        return <MoreHorizontal className="w-4 h-4" />;
      case "won":
        return <CheckCircle className="w-4 h-4" />;
      case "lost":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      Referral: "bg-green-100 text-green-700",
      LinkedIn: "bg-blue-100 text-blue-700",
      Website: "bg-purple-100 text-purple-700",
      "Cold Email": "bg-yellow-100 text-yellow-700",
      Networking: "bg-orange-100 text-orange-700",
    };
    return colors[source] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Leads Pipeline</h1>
          <p className="text-text-secondary mt-1">Track and manage your sales pipeline</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Lead
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search leads by name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {COLUMNS.map((column) => {
            const columnLeads = getLeadsByStatus(column.id as Lead["status"]);

            return (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${column.color}`} />
                      <h3 className="font-semibold text-text-primary">
                        {column.title}
                      </h3>
                    </div>
                    <Badge variant="default">{columnLeads.length}</Badge>
                  </div>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[200px] rounded-lg p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : "bg-gray-50/50"
                      }`}
                    >
                      {columnLeads.map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                {/* Lead Name & Company */}
                                <div className="mb-3">
                                  <h4 className="font-semibold text-text-primary text-sm mb-1">
                                    {lead.name}
                                  </h4>
                                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                                    <Building className="w-3 h-3" />
                                    {lead.company}
                                  </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-1 mb-3 text-xs text-text-secondary">
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{lead.email}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {lead.phone}
                                  </div>
                                </div>

                                {/* Source Badge */}
                                <Badge
                                  variant="default"
                                  className={`text-xs mb-2 ${getSourceColor(lead.source)}`}
                                >
                                  {lead.source}
                                </Badge>

                                {/* Follow-up Date */}
                                {lead.follow_up_date && (
                                  <div className="flex items-center gap-1 text-xs text-text-secondary mt-2 pt-2 border-t border-border">
                                    <Calendar className="w-3 h-3" />
                                    <span>Follow up: {lead.follow_up_date}</span>
                                  </div>
                                )}

                                {/* Status Icon */}
                                <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                                    {getStatusIcon(lead.status)}
                                    <span>{column.title}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No leads found</h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search to find what you're looking for.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
