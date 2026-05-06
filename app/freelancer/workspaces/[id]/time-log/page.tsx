"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, StopCircle, Plus, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

interface TimeEntry {
  id: string;
  task: string;
  date: string;
  duration: number; // in seconds
  description: string;
}

const mockTimeEntries: TimeEntry[] = [
  { id: "1", task: "Homepage Design", date: "2024-03-15", duration: 7200, description: "Created wireframes and mockups" },
  { id: "2", task: "API Integration", date: "2024-03-14", duration: 5400, description: "Integrated payment gateway" },
  { id: "3", task: "Testing & QA", date: "2024-03-13", duration: 3600, description: "Cross-browser testing" },
];

export default function TimeLogPage() {
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleStart = () => {
    if (!currentTask.trim()) {
      toast.error("Please enter a task name", {
        description: "You need to specify what you're working on.",
      });
      return;
    }
    setIsRunning(true);
    setElapsedTime(0);
    toast.info("Timer started", {
      description: `Tracking time for: ${currentTask}`,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    
    if (elapsedTime > 0) {
      const newEntry: TimeEntry = {
        id: String(timeEntries.length + 1),
        task: currentTask,
        date: new Date().toISOString().split("T")[0],
        duration: elapsedTime,
        description: currentDescription,
      };
      setTimeEntries([newEntry, ...timeEntries]);
      toast.success("Time entry saved!", {
        description: `Logged ${formatDuration(elapsedTime)}`,
      });
    }
    
    setElapsedTime(0);
    setCurrentTask("");
    setCurrentDescription("");
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Time Log</h2>
        <p className="text-text-secondary mt-1">Track time spent on project tasks</p>
      </div>

      {/* Timer */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Task Name *
              </label>
              <Input
                placeholder="e.g., Homepage Design"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description (optional)
              </label>
              <Input
                placeholder="What are you working on?"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-5xl font-mono font-bold text-text-primary">
              {formatTime(elapsedTime)}
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <Button className="flex items-center gap-2" onClick={handleStart}>
                  <Play className="w-5 h-5" />
                  Start Timer
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={handleStop}
                >
                  <StopCircle className="w-5 h-5" />
                  Stop & Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Hours</p>
              <p className="text-2xl font-bold text-text-primary">
                {totalHours.toFixed(1)}h
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Entries</p>
              <p className="text-2xl font-bold text-text-primary">
                {timeEntries.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Avg per Entry</p>
              <p className="text-2xl font-bold text-text-primary">
                {timeEntries.length > 0 ? formatDuration(Math.round((totalHours * 3600) / timeEntries.length)) : "0h 0m"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Time Entries List */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Time Entries</h3>
        <div className="space-y-3">
          {timeEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary">{entry.task}</h4>
                {entry.description && (
                  <p className="text-sm text-text-secondary mt-1">{entry.description}</p>
                )}
                <p className="text-xs text-text-secondary mt-1">{entry.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-text-primary">
                  {formatDuration(entry.duration)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty State */}
      {timeEntries.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No time entries yet</h3>
            <p className="text-text-secondary mb-4">
              Start the timer above to track your work time.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
