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
  { id: "lead", title: "New Lead", color: "bg-blue-500", border: "border-blue-200", light: "bg-blue-50" },
  { id: "contacted", title: "Contacted", color: "bg-amber-500", border: "border-amber-200", light: "bg-amber-50" },
  { id: "proposal_sent", title: "Proposal Sent", color: "bg-purple-500", border: "border-purple-200", light: "bg-purple-50" },
  { id: "negotiating", title: "Negotiating", color: "bg-orange-500", border: "border-orange-200", light: "bg-orange-50" },
  { id: "won", title: "Won", color: "bg-emerald-500", border: "border-emerald-200", light: "bg-emerald-50" },
  { id: "lost", title: "Lost", color: "bg-rose-500", border: "border-rose-200", light: "bg-rose-50" },
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
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads Pipeline</h1>
          <p className="text-slate-500 mt-1.5 text-[15px]">Manage your sales funnel and track opportunities</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-primary/20"
            />
          </div>
          <Button className="h-11 px-5 bg-primary hover:bg-orange-600 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board Container with Horizontal Scroll */}
      <div className="relative -mx-6 px-6 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-slate-200">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 min-w-max pb-4">
            {COLUMNS.map((column) => {
              const columnLeads = getLeadsByStatus(column.id as Lead["status"]);

              return (
                <div key={column.id} className="flex flex-col w-[320px]">
                  {/* Column Header */}
                  <div className="mb-4 px-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3 h-3 rounded-full ${column.color} shadow-sm`} />
                        <h3 className="font-bold text-slate-800 text-[15px] tracking-tight">
                          {column.title}
                        </h3>
                      </div>
                      <Badge className="bg-slate-100 text-slate-600 border-none font-bold px-2 py-0.5 rounded-lg text-[12px]">
                        {columnLeads.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[calc(100vh-320px)] rounded-2xl p-3 transition-all duration-200 border-2 border-dashed ${
                          snapshot.isDraggingOver 
                            ? "bg-slate-100 border-primary/20 ring-4 ring-primary/5" 
                            : "bg-slate-50/50 border-slate-200/50"
                        }`}
                      >
                        <div className="space-y-4">
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
                                  className={`group transition-all duration-200 ${
                                    snapshot.isDragging ? "scale-105 rotate-2 z-50" : ""
                                  }`}
                                >
                                  <Card className={`p-4 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing rounded-xl bg-white ${
                                    snapshot.isDragging ? "shadow-2xl ring-2 ring-primary/20" : ""
                                  }`}>
                                    {/* Lead Header */}
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="min-w-0 pr-2">
                                        <h4 className="font-bold text-slate-900 text-[14px] leading-snug truncate group-hover:text-primary transition-colors">
                                          {lead.name}
                                        </h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <Building className="w-3 h-3 text-slate-400" />
                                          <span className="text-[12px] font-medium text-slate-500 truncate">{lead.company}</span>
                                        </div>
                                      </div>
                                      <Badge
                                        className={`text-[10px] px-2 py-0 border-none font-bold uppercase tracking-wider ${getSourceColor(lead.source)}`}
                                      >
                                        {lead.source}
                                      </Badge>
                                    </div>

                                    {/* Contact Quick Links */}
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                      <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="truncate">Email</span>
                                      </div>
                                      <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="truncate">Call</span>
                                      </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                                      <div className="flex items-center gap-2">
                                        {lead.follow_up_date && (
                                          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-md border border-amber-100/50">
                                            <Calendar className="w-3 h-3 text-amber-600" />
                                            <span className="text-[10px] font-bold text-amber-700">{lead.follow_up_date}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors">
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

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
