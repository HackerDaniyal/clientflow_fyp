"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  FileText,
  FileImage,
  FileSpreadsheet,
  Folder,
  Search,
  MoreVertical,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "spreadsheet" | "document" | "other";
  folder: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Brand Guidelines.pdf", type: "pdf", folder: "Branding", size: "2.4 MB", uploadedAt: "2024-02-01", uploadedBy: "Sarah Miller" },
  { id: "2", name: "Logo Final.png", type: "image", folder: "Branding", size: "1.2 MB", uploadedAt: "2024-02-05", uploadedBy: "Alex Johnson" },
  { id: "3", name: "Homepage Mockup.png", type: "image", folder: "Assets", size: "3.5 MB", uploadedAt: "2024-02-10", uploadedBy: "Alex Johnson" },
  { id: "4", name: "Contract v1.pdf", type: "pdf", folder: "Contracts", size: "450 KB", uploadedAt: "2024-01-20", uploadedBy: "Alex Johnson" },
  { id: "5", name: "Invoice #1.pdf", type: "pdf", folder: "Invoices", size: "320 KB", uploadedAt: "2024-02-15", uploadedBy: "Alex Johnson" },
  { id: "6", name: "Content Spreadsheet.xlsx", type: "spreadsheet", folder: "Assets", size: "890 KB", uploadedAt: "2024-02-20", uploadedBy: "Sarah Miller" },
  { id: "7", name: "Project Brief.docx", type: "document", folder: "Misc", size: "567 KB", uploadedAt: "2024-01-18", uploadedBy: "Sarah Miller" },
];

const FOLDERS = ["All", "Branding", "Assets", "Contracts", "Invoices", "Misc"];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    const matchesFolder = selectedFolder === "All" || doc.folder === selectedFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFileIcon = (type: Document["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "image":
        return <FileImage className="w-8 h-8 text-blue-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Document Vault</h2>
          <p className="text-text-secondary mt-1">Manage project files and documents</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      {/* Search & Folders */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Folder Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {FOLDERS.map((folder) => (
              <Button
                key={folder}
                variant={selectedFolder === folder ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFolder(folder)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Folder className="w-4 h-4" />
                {folder}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              {getFileIcon(doc.type)}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <h3 className="font-semibold text-text-primary text-sm mb-2 truncate">
              {doc.name}
            </h3>

            <div className="space-y-1 text-xs text-text-secondary mb-4">
              <p>Folder: {doc.folder}</p>
              <p>Size: {doc.size}</p>
              <p>Uploaded: {doc.uploadedAt}</p>
              <p>By: {doc.uploadedBy}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 flex items-center gap-1">
                <Download className="w-3 h-3" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="w-3 h-3 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No documents found</h3>
            <p className="text-text-secondary mb-4">
              Upload your first document to get started.
            </p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
