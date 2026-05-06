"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building,
  Bell,
  CreditCard,
  Users,
  Save,
  Plus,
  Trash2,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business Info", icon: Building },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@clientflow.com",
    phone: "+1 555-0101",
    bio: "Full-stack developer & UI/UX designer specializing in modern web applications.",
    avatar: "AJ"
  });

  const [business, setBusiness] = useState({
    companyName: "Alex Johnson Freelancing",
    taxId: "12-3456789",
    address: "123 Main St, San Francisco, CA 94102",
    website: "https://alexjohnson.dev"
  });

  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Alex Johnson", role: "Owner", email: "alex@clientflow.com", status: "active" },
  ]);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newRequests: true,
    proposalUpdates: true,
    invoicePayments: true,
    taskReminders: true,
    weeklyReport: false,
  });

  const handleSaveProfile = () => {
    toast.success("Profile saved!", {
      description: "Your changes have been saved successfully.",
    });
  };

  const handleSaveBusiness = () => {
    toast.success("Business info saved!", {
      description: "Your business information has been updated.",
    });
  };

  const handleAddTeamMember = () => {
    toast.info("Invite sent!", {
      description: "Team member invitation has been sent.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <Card className="p-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary">Profile Settings</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{profile.avatar}</span>
              </div>
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-xs text-text-secondary mt-1">JPG, PNG or GIF. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Bio
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <Button className="flex items-center gap-2" onClick={handleSaveProfile}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}

        {/* Business Info Tab */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary">Business Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Company Name
                </label>
                <Input
                  value={business.companyName}
                  onChange={(e) => setBusiness({ ...business, companyName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tax ID / EIN
                </label>
                <Input
                  value={business.taxId}
                  onChange={(e) => setBusiness({ ...business, taxId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Website
                </label>
                <Input
                  value={business.website}
                  onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Business Address
                </label>
                <Input
                  value={business.address}
                  onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                />
              </div>
            </div>

            <Button className="flex items-center gap-2" onClick={handleSaveBusiness}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">Team Members</h2>
              <Button className="flex items-center gap-2" onClick={handleAddTeamMember}>
                <Plus className="w-4 h-4" />
                Invite Member
              </Button>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{member.name}</p>
                      <p className="text-sm text-text-secondary">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">{member.status}</Badge>
                    <p className="text-sm text-text-secondary">{member.role}</p>
                    {member.role !== "Owner" && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary">Notification Preferences</h2>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-text-primary">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Receive notifications for {key.toLowerCase().replace(/([A-Z])/g, " $1")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({ ...notifications, [key]: !value })
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      value ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <Button className="flex items-center gap-2" onClick={() => {
              toast.success("Preferences saved!", {
                description: "Your notification settings have been updated.",
              });
            }}>
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-primary">Subscription & Billing</h2>

            <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Pro Plan</h3>
                  <p className="text-text-secondary">Currently active</p>
                </div>
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-text-primary font-semibold">$29/month</p>
                <p className="text-text-secondary">Next billing date: April 15, 2024</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">Upgrade Plan</Button>
                <Button variant="outline" size="sm">Cancel Subscription</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-primary mb-4">Plan Features</h3>
              <ul className="space-y-2">
                {[
                  "Unlimited clients and workspaces",
                  "Advanced analytics and reporting",
                  "Priority email support",
                  "Custom branding",
                  "API access",
                  "Team collaboration (up to 5 members)"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-primary mb-4">Payment Method</h3>
              <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-text-secondary" />
                  <div>
                    <p className="font-semibold text-text-primary">**** **** **** 4242</p>
                    <p className="text-sm text-text-secondary">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
