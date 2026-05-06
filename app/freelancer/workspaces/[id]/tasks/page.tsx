"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { mockTasks, Task, getTasksByWorkspace } from "@/lib/mock/tasks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";
import {
  Plus,
  Calendar,
  User,
  Flag,
  MoreHorizontal
} from "lucide-react";

const COLUMNS = [
  { id: "backlog", title: "Backlog", color: "bg-gray-500" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { id: "review", title: "Review", color: "bg-purple-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

export default function TasksPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [tasks, setTasks] = useState(getTasksByWorkspace(workspaceId));

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        return {
          ...task,
          status: destination.droppableId as Task["status"],
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    const variants: Record<string, { color: string; label: string }> = {
      low: { color: "bg-gray-100 text-gray-700", label: "Low" },
      medium: { color: "bg-blue-100 text-blue-700", label: "Medium" },
      high: { color: "bg-orange-100 text-orange-700", label: "High" },
      urgent: { color: "bg-red-100 text-red-700", label: "Urgent" },
    };

    const variant = variants[priority];
    return <Badge className={`text-xs ${variant.color}`}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Task Board</h2>
          <p className="text-text-secondary mt-1">Manage and track project tasks</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);

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
                    <Badge variant="default">{columnTasks.length}</Badge>
                  </div>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[200px] rounded-lg p-3 transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : "bg-gray-50/50"
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <Card className="p-4 hover:shadow-md transition-shadow">
                                {/* Priority & Actions */}
                                <div className="flex items-center justify-between mb-3">
                                  {getPriorityBadge(task.priority)}
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Task Title & Description */}
                                <h4 className="font-semibold text-text-primary text-sm mb-2">
                                  {task.title}
                                </h4>
                                <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                                  {task.description}
                                </p>

                                {/* Assignee & Due Date */}
                                <div className="space-y-2 pt-3 border-t border-border">
                                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                                    <User className="w-3 h-3" />
                                    <span>{task.assignee_name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                                    <Calendar className="w-3 h-3" />
                                    <span>Due: {task.due_date}</span>
                                  </div>
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
      {tasks.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No tasks yet</h3>
            <p className="text-text-secondary mb-4">
              Create your first task to get started with project management.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
