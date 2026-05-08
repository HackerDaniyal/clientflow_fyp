"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Plus,
  Search,
  Play,
  Square,
  Trash2,
  Calendar,
  Timer,
  DollarSign,
  Flag
} from "lucide-react";
import { toast } from "sonner";

interface TimeEntry {
  id: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  hourlyRate: number;
  total: number;
  task?: string;
  billable: boolean;
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    description: "Homepage design and wireframing",
    date: "2024-02-01",
    startTime: "09:00",
    endTime: "12:30",
    duration: 210,
    hourlyRate: 75,
    total: 262.50,
    task: "Homepage Design",
    billable: true
  },
  {
    id: "2",
    description: "Implementing responsive navigation",
    date: "2024-02-01",
    startTime: "13:30",
    endTime: "17:00",
    duration: 210,
    hourlyRate: 75,
    total: 262.50,
    task: "Development",
    billable: true
  },
  {
    id: "3",
    description: "Client meeting and requirements review",
    date: "2024-02-02",
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    hourlyRate: 75,
    total: 75.00,
    task: "Meeting",
    billable: true
  },
  {
    id: "4",
    description: "CSS styling and animations",
    date: "2024-02-02",
    startTime: "11:30",
    endTime: "16:30",
    duration: 300,
    hourlyRate: 75,
    total: 375.00,
    task: "Development",
    billable: true
  },
  {
    id: "5",
    description: "Code refactoring and optimization",
    date: "2024-02-03",
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    hourlyRate: 75,
    total: 225.00,
    task: "Development",
    billable: false
  }
];

export default function WorkspaceTimeLog() {
  const params = useParams();
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    description: "",
    task: "",
    billable: true
  });

  const filteredEntries = timeEntries.filter((entry) =>
    entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.task && entry.task.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleDelete = (id: string, description: string) => {
    setTimeEntries(timeEntries.filter(e => e.id !== id));
    toast.success("Time entry deleted", {
      description: `"${description}" has been removed`,
    });
  };

  const handleStartTracking = () => {
    if (!currentEntry.description.trim()) {
      toast.error("Description required", {
        description: "Please enter a description for the time entry",
      });
      return;
    }
    setIsTracking(true);
    toast.info("Timer started", {
      description: "Tracking your time...",
    });
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    toast.success("Timer stopped", {
      description: "Time entry has been logged",
    });
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const billableHours = timeEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.duration, 0);
  const totalEarnings = timeEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Time Log</h2>
          <p className="text-text-secondary mt-1">Track and manage your time</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Manual Entry
        </Button>
      </div>

      {/* Timer */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary mb-3">
              {isTracking ? "Timer Running" : "Start Timer"}
            </h3>
            <div className="space-y-3">
              <Input
                placeholder="What are you working on?"
                value={currentEntry.description}
                onChange={(e) => setCurrentEntry({ ...currentEntry, description: e.target.value })}
                disabled={isTracking}
              />
              <div className="flex gap-3">
                <Input
                  placeholder="Task (optional)"
                  value={currentEntry.task}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, task: e.target.value })}
                  disabled={isTracking}
                />
                <select
                  className="px-4 py-2 border border-border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isTracking}
                >
                  <option value="75">$75/hr</option>
                  <option value="100">$100/hr</option>
                  <option value="125">$125/hr</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl font-bold text-text-primary font-mono">
              {isTracking ? "02:34:15" : "00:00:00"}
            </div>
            <Button
              onClick={isTracking ? handleStopTracking : handleStartTracking}
              className={`flex items-center gap-2 ${
                isTracking ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-orange-600"
              }`}
            >
              {isTracking ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTracking ? "Stop" : "Start"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0">
              <Timer className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total Hours</p>
              <p className="text-2xl font-bold text-slate-900">{formatDuration(totalHours)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Billable Hours</p>
              <p className="text-2xl font-bold text-slate-900">{formatDuration(billableHours)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 flex-shrink-0">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total Earnings</p>
              <p className="text-2xl font-bold text-slate-900">${totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 flex-shrink-0">
              <Flag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Entries</p>
              <p className="text-2xl font-bold text-slate-900">{timeEntries.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search time entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Time Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="p-6 hover:shadow-lg transition-all border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{entry.description}</h3>
                  {entry.billable ? (
                    <Badge variant="success">Billable</Badge>
                  ) : (
                    <Badge variant="draft">Non-Billable</Badge>
                  )}
                </div>
                {entry.task && (
                  <p className="text-sm text-text-secondary">Task: {entry.task}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary">${entry.total.toFixed(2)}</p>
                <p className="text-xs text-text-secondary mt-1">{formatDuration(entry.duration)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-medium text-slate-900">{entry.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="font-medium text-slate-900">{entry.startTime} - {entry.endTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Rate</p>
                  <p className="font-medium text-slate-900">${entry.hourlyRate}/hr</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Timer className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="font-medium text-slate-900">{formatDuration(entry.duration)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                onClick={() => handleDelete(entry.id, entry.description)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No time entries found</h3>
            <p className="text-text-secondary mb-4">
              Start tracking your time or add a manual entry.
            </p>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
