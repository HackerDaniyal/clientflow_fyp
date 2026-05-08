"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { getInvoicesByWorkspace, Invoice } from "@/lib/mock/invoices";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Plus,
  Search,
  Eye,
  Download,
  Send,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export default function WorkspaceInvoices() {
  const params = useParams();
  const workspaceId = params.id as string;
  const [invoices, setInvoices] = useState(getInvoicesByWorkspace(workspaceId));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft" | "default"> = {
      draft: "draft",
      sent: "default",
      partially_paid: "warning",
      paid: "success",
      overdue: "error",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </Badge>
    );
  };

  const handleDelete = (id: string, number: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
    toast.success("Invoice deleted", {
      description: `Invoice ${number} has been removed`,
    });
  };

  const handleSend = (id: string, number: string) => {
    setInvoices(invoices.map(i => 
      i.id === id ? { ...i, status: "sent" as const } : i
    ));
    toast.success("Invoice sent!", {
      description: `Invoice ${number} has been sent to the client`,
    });
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(i => i.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(i => i.status === "sent" || i.status === "partially_paid").reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Invoices</h2>
          <p className="text-text-secondary mt-1">Track payments and billing</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total</p>
              <p className="text-2xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Paid</p>
              <p className="text-2xl font-bold text-slate-900">${paidAmount.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-slate-900">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">
                ${invoices.filter(i => i.status === "overdue").reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="p-6 hover:shadow-lg transition-all border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{invoice.invoice_number}</h3>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-sm text-text-secondary">Client: {invoice.client_name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-text-primary">${invoice.total.toLocaleString()}</p>
                <p className="text-xs text-text-secondary mt-1">Total Amount</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="text-sm font-semibold text-text-primary mb-3">Line Items</h4>
              <div className="space-y-2">
                {invoice.line_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{item.description}</p>
                      <p className="text-text-secondary text-xs">Qty: {item.quantity} × ${item.unit_price.toLocaleString()}</p>
                    </div>
                    <p className="font-semibold text-text-primary">${(item.quantity * item.unit_price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-text-secondary">Subtotal</p>
                  <p className="font-medium text-text-primary">${invoice.subtotal.toLocaleString()}</p>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-text-secondary">Discount</p>
                    <p className="font-medium text-red-600">-${invoice.discount.toLocaleString()}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <p className="text-text-secondary">Tax ({(invoice.tax_rate * 100).toFixed(0)}%)</p>
                  <p className="font-medium text-text-primary">${(invoice.subtotal * invoice.tax_rate).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="font-medium text-slate-900">{invoice.created_at}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className="font-medium text-slate-900">{invoice.due_date}</p>
                </div>
              </div>
              {invoice.paid_at && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-xs text-slate-500">Paid On</p>
                    <p className="font-medium text-emerald-600">{invoice.paid_at}</p>
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
              {invoice.status === "draft" && (
                <>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center gap-1 bg-primary hover:bg-orange-600"
                    onClick={() => handleSend(invoice.id, invoice.invoice_number)}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 ml-auto hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                onClick={() => handleDelete(invoice.id, invoice.invoice_number)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No invoices found</h3>
            <p className="text-text-secondary mb-4">
              Create your first invoice to bill the client.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
