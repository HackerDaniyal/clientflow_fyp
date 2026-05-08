"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Upload,
  Download,
  Trash2,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Calendar,
  HardDrive
} from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image" | "spreadsheet" | "document" | "other";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  folder?: string;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Brand Guidelines.pdf", type: "pdf", size: "2.4 MB", uploadedBy: "Sarah Miller", uploadedAt: "2024-02-02", folder: "Brand Assets" },
  { id: "2", name: "Homepage Mockup.png", type: "image", size: "3.1 MB", uploadedBy: "Alex Johnson", uploadedAt: "2024-02-01", folder: "Designs" },
  { id: "3", name: "Project Timeline.xlsx", type: "spreadsheet", size: "450 KB", uploadedBy: "Alex Johnson", uploadedAt: "2024-01-25", folder: "Planning" },
  { id: "4", name: "Requirements Document.docx", type: "document", size: "1.2 MB", uploadedBy: "Sarah Miller", uploadedAt: "2024-01-22", folder: "Planning" },
  { id: "5", name: "Logo Draft v1.png", type: "image", size: "1.8 MB", uploadedBy: "Alex Johnson", uploadedAt: "2024-01-28", folder: "Brand Assets" },
  { id: "6", name: "Contract Draft.pdf", type: "pdf", size: "890 KB", uploadedBy: "Alex Johnson", uploadedAt: "2024-01-23", folder: "Legal" },
  { id: "7", name: "Style Guide.pdf", type: "pdf", size: "3.5 MB", uploadedBy: "Alex Johnson", uploadedAt: "2024-02-05", folder: "Designs" },
  { id: "8", name: "Meeting Notes.docx", type: "document", size: "320 KB", uploadedBy: "Sarah Miller", uploadedAt: "2024-02-08", folder: "Meeting Notes" },
];

export default function WorkspaceDocuments() {
  const params = useParams();
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");

  const folders = ["all", ...Array.from(new Set(documents.map(d => d.folder).filter(Boolean)))];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === "all" || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const getFileIcon = (type: Document["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "image":
        return <Image className="w-8 h-8 text-blue-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      case "document":
        return <FileText className="w-8 h-8 text-blue-600" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    toast.success("Document deleted", {
      description: `${name} has been removed`,
    });
  };

  const handleDownload = (name: string) => {
    toast.info("Downloading...", {
      description: `${name} is being downloaded`,
    });
  };

  const totalSize = "14.2 MB";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Documents</h2>
          <p className="text-text-secondary mt-1">Manage project files and documents</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>

      {/* Storage Info */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Storage Used</p>
              <p className="text-xs text-text-secondary">{totalSize} of 10 GB</p>
            </div>
          </div>
          <div className="w-48">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "0.14%" }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder === "all" ? "All Folders" : folder}
                </option>
              ))}
            </select>

            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-text-secondary"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-text-secondary"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-text-secondary">
        Showing {filteredDocuments.length} of {documents.length} documents
      </div>

      {/* Documents List/Grid */}
      {viewMode === "list" ? (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Folder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <span className="text-sm font-medium text-text-primary">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">{doc.folder}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">{doc.size}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">{doc.uploadedBy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <Calendar className="w-3 h-3" />
                      {doc.uploadedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id, doc.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                {getFileIcon(doc.type)}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-text-primary text-sm mb-2 truncate">{doc.name}</h3>
              <div className="space-y-1 text-xs text-text-secondary mb-3">
                <p>Size: {doc.size}</p>
                <p>By: {doc.uploadedBy}</p>
                <p>{doc.uploadedAt}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(doc.name)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(doc.id, doc.name)}
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No documents found</h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search or upload new files.
            </p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
