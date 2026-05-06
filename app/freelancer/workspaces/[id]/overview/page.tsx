"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Mail, Phone } from "lucide-react";

export default function WorkspaceOverview() {
  const projectBrief = {
    description: "Complete redesign and development of the company website with modern UI/UX, mobile responsiveness, and improved performance. The project includes brand identity refresh, custom animations, and CMS integration.",
    objectives: [
      "Modernize the visual design and user experience",
      "Improve mobile responsiveness and performance",
      "Integrate content management system",
      "Implement SEO best practices",
      "Add e-commerce functionality for product sales"
    ],
    timeline: "12 weeks",
    budget: "$15,000 - $20,000",
    startDate: "2024-01-20",
    expectedCompletion: "2024-04-15"
  };

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Freelancer (You)",
      email: "alex@clientflow.com",
      phone: "+1 555-0101",
      initials: "AJ"
    },
    {
      name: "Sarah Miller",
      role: "Client",
      email: "sarah@techcorp.com",
      phone: "+1 555-0102",
      initials: "SM"
    }
  ];

  const milestones = [
    { name: "Discovery & Planning", status: "completed", date: "2024-01-20" },
    { name: "Design Phase", status: "completed", date: "2024-02-15" },
    { name: "Development", status: "in-progress", date: "2024-03-15" },
    { name: "Testing & QA", status: "pending", date: "2024-04-01" },
    { name: "Launch", status: "pending", date: "2024-04-15" }
  ];

  const recentActivity = [
    { type: "message", description: "New message from Sarah Miller", time: "2 hours ago" },
    { type: "task", description: "Task 'Homepage Design' completed", time: "5 hours ago" },
    { type: "document", description: "Document uploaded: Brand Guidelines.pdf", time: "1 day ago" },
    { type: "invoice", description: "Invoice #2 sent - $5,000", time: "2 days ago" },
    { type: "task", description: "Task 'API Integration' started", time: "3 days ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Project Brief */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Project Brief</h2>
        <p className="text-text-secondary mb-6">{projectBrief.description}</p>

        <div className="mb-6">
          <h3 className="font-semibold text-text-primary mb-3">Objectives</h3>
          <ul className="space-y-2">
            {projectBrief.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-primary mt-1">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-text-secondary mb-1">Timeline</p>
            <p className="font-semibold text-text-primary">{projectBrief.timeline}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Budget</p>
            <p className="font-semibold text-text-primary">{projectBrief.budget}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Start Date</p>
            <p className="font-semibold text-text-primary">{projectBrief.startDate}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Expected Completion</p>
            <p className="font-semibold text-text-primary">{projectBrief.expectedCompletion}</p>
          </div>
        </div>
      </Card>

      {/* Milestones */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Project Milestones</h2>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {milestone.status === "completed" ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                ) : milestone.status === "in-progress" ? (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">●</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-sm">○</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{milestone.name}</p>
                <p className="text-sm text-text-secondary">Target: {milestone.date}</p>
              </div>
              <Badge variant={milestone.status === "completed" ? "success" : milestone.status === "in-progress" ? "default" : "draft"}>
                {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1).replace("-", " ")}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Members */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Team Members</h2>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{member.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{member.name}</p>
                  <p className="text-sm text-text-secondary">{member.role}</p>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Mail className="w-3 h-3" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Phone className="w-3 h-3" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm text-text-primary">{activity.description}</p>
                <p className="text-xs text-text-secondary mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
