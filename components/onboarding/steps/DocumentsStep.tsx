/**
 * Documents Step - Upload verification documents
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";

interface DocumentsStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

interface Document {
  type: string;
  file: File | null;
  name: string;
}

export function DocumentsStep({ data, onChange, onNext }: DocumentsStepProps) {
  const [documents, setDocuments] = useState<Document[]>(
    data.documents || [
      { type: "id", file: null, name: "Government ID" },
      { type: "license", file: null, name: "Driver's License (for drivers)" },
      { type: "registration", file: null, name: "Business Registration" },
    ]
  );

  const handleFileSelect = (index: number, file: File) => {
    const newDocuments = [...documents];
    newDocuments[index].file = file;
    setDocuments(newDocuments);
  };

  const handleRemoveFile = (index: number) => {
    const newDocuments = [...documents];
    newDocuments[index].file = null;
    setDocuments(newDocuments);
  };

  const handleSubmit = () => {
    onChange({ documents });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-slate-700" />
        </div>
        <h2 className="text-2xl font-bold">Upload Documents</h2>
        <p className="text-muted-foreground">
          Upload verification documents (optional - you can do this later)
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={doc.type} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{doc.name}</span>
              </div>
              {doc.file && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>

            {doc.file ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-slate-600 flex-shrink-0" />
                  <span className="text-sm truncate">{doc.file.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    ({(doc.file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-slate-400 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  PDF, PNG, JPG up to 5MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size must be less than 5MB");
                        return;
                      }
                      handleFileSelect(index, file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Document verification may take 1-2 business days.
          You can start using the platform while your documents are being reviewed.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onChange({ documents: [] });
            onNext();
          }}
        >
          Skip for Now
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}
