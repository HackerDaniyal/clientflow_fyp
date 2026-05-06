"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockInvoices, Invoice, getInvoicesByWorkspace } from "@/lib/mock/invoices";
import { Plus, Eye, Send, DollarSign, Calendar, Download, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft"> = {
      draft: "draft",
      sent: "warning",
      paid: "success",
      overdue: "error",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleSend = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "sent" as const } : inv))
    );
    toast.success("Invoice sent!", {
      description: "The client has received the invoice.",
    });
  };

  const handleMarkPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" as const } : inv))
    );
    toast.success("Invoice marked as paid!", {
      description: "Payment has been recorded.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Invoices</h2>
          <p className="text-text-secondary mt-1">Manage billing and payments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Billed</p>
              <p className="text-2xl font-bold text-text-primary">
                ${invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Paid</p>
              <p className="text-2xl font-bold text-text-primary">
                ${invoices.filter((i) => i.status === "paid").reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Pending</p>
              <p className="text-2xl font-bold text-text-primary">
                ${invoices.filter((i) => i.status === "sent").reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Overdue</p>
              <p className="text-2xl font-bold text-text-primary">
                ${invoices.filter((i) => i.status === "overdue").reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-text-primary">
                    Invoice #{invoice.id.padStart(3, "0")}
                  </h3>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-sm text-text-secondary">
                  Client: {invoice.client_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-text-primary">
                  ${invoice.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-border text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>Created: {invoice.created_at}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>Due: {invoice.due_date}</span>
              </div>
              {invoice.paid_at && (
                <div className="text-text-secondary">
                  Paid: {invoice.paid_at}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                Download
              </Button>
              {invoice.status === "draft" && (
                <Button
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleSend(invoice.id)}
                >
                  <Send className="w-4 h-4" />
                  Send to Client
                </Button>
              )}
              {(invoice.status === "sent" || invoice.status === "overdue") && (
                <Button
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleMarkPaid(invoice.id)}
                >
                  <CreditCard className="w-4 h-4" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No invoices yet</h3>
            <p className="text-text-secondary mb-4">
              Create your first invoice to bill the client.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
