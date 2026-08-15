import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAdminMedia, useUploadAdminMedia, useDeleteAdminMedia } from "@/hooks/useAdminMedia";
import { MediaType, AdminMediaResponse } from "@/types/adminMedia.types";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  Image as ImageIcon,
  Music,
  Video,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";

export function AdminMediaPage() {
  const [selectedType, setSelectedType] = useState<MediaType | undefined>(undefined);
  const [page, setPage] = useState(0);

  // Upload Form State
  const [uploadFileType, setUploadFileType] = useState<MediaType>("IMAGE");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteMediaTarget, setDeleteMediaTarget] = useState<AdminMediaResponse | null>(null);

  const { data: mediaPage, isLoading, isError, error, refetch } = useAdminMedia(selectedType, page, 16);
  const uploadMutation = useUploadAdminMedia();
  const deleteMutation = useDeleteAdminMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const { t } = useTranslation();

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", uploadFileType);
    if (title.trim()) {
      formData.append("title", title.trim());
    }

    setUploadProgress(0);
    uploadMutation.mutate(
      {
        formData,
        onUploadProgress: (percent) => setUploadProgress(percent),
      },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setTitle("");
          setUploadProgress(null);
          toast.success(t("adminMedia.uploadedSuccess"));
        },
        onError: (err: unknown) => {
          setUploadProgress(null);
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminMedia.actionError"));
        },
      }
    );
  };

  const handleCopyUrl = (media: AdminMediaResponse) => {
    navigator.clipboard.writeText(media.cloudinaryUrl);
    setCopiedId(media.id);
    toast.success(t("adminMedia.copiedToast"));
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteConfirm = () => {
    if (deleteMediaTarget) {
      deleteMutation.mutate(deleteMediaTarget.id, {
        onSuccess: () => {
          setDeleteMediaTarget(null);
          toast.success(t("adminMedia.deletedSuccess"));
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminMedia.actionError"));
        },
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const uploadAxiosError = uploadMutation.error as AxiosError<ApiResponse<unknown>> | null;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Media Library & Uploads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload and manage images, audio, and video assets stored on Cloudinary.
        </p>
      </div>

      {/* Upload Dropzone Card */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            Upload New Asset to Cloudinary
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Select asset type and choose a file to upload.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {uploadMutation.isError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                {uploadAxiosError?.response?.data?.message ||
                  uploadMutation.error?.message ||
                  "Upload failed."}
              </span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              {/* Asset Type Selector */}
              <div className="sm:col-span-3 space-y-1.5">
                <label htmlFor="mediaTypeSelect" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Asset Type
                </label>
                <select
                  id="mediaTypeSelect"
                  value={uploadFileType}
                  onChange={(e) => setUploadFileType(e.target.value as MediaType)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="IMAGE">IMAGE</option>
                  <option value="AUDIO">AUDIO</option>
                  <option value="VIDEO">VIDEO</option>
                </select>
              </div>

              {/* Title Field (Optional) */}
              <div className="sm:col-span-4 space-y-1.5">
                <label htmlFor="mediaTitleInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Asset Title (Optional)
                </label>
                <input
                  id="mediaTitleInput"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Center Banner Image"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* File Input Picker */}
              <div className="sm:col-span-5 space-y-1.5">
                <label htmlFor="mediaFileInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Choose File
                </label>
                <input
                  id="mediaFileInput"
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    uploadFileType === "IMAGE"
                      ? "image/*"
                      : uploadFileType === "AUDIO"
                      ? "audio/*"
                      : "video/*"
                  }
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg shadow-xs text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Uploading to Cloudinary...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={!selectedFile || uploadMutation.isPending}
              size="sm"
              className="font-bold bg-primary hover:bg-primary/90 text-white"
            >
              {uploadMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" />
                  Upload File
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Gallery Filter & Grid Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Filter Gallery:
          </span>
          <div className="flex gap-1.5">
            <Button
              variant={selectedType === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedType(undefined);
                setPage(0);
              }}
              className="text-xs font-semibold py-1 px-3 h-8"
            >
              All Types
            </Button>
            <Button
              variant={selectedType === "IMAGE" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedType("IMAGE");
                setPage(0);
              }}
              className="text-xs font-semibold py-1 px-3 h-8 flex items-center gap-1.5"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Images
            </Button>
            <Button
              variant={selectedType === "AUDIO" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedType("AUDIO");
                setPage(0);
              }}
              className="text-xs font-semibold py-1 px-3 h-8 flex items-center gap-1.5"
            >
              <Music className="h-3.5 w-3.5" />
              Audio
            </Button>
            <Button
              variant={selectedType === "VIDEO" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedType("VIDEO");
                setPage(0);
              }}
              className="text-xs font-semibold py-1 px-3 h-8 flex items-center gap-1.5"
            >
              <Video className="h-3.5 w-3.5" />
              Videos
            </Button>
          </div>
        </div>
      </div>

      {/* Media Library Gallery Grid */}
      {isLoading ? (
        <SkeletonLoader count={8} type="card" />
      ) : isError ? (
        <ErrorAlert
          message={error instanceof Error ? error.message : "Failed to load media assets"}
          onRetry={refetch}
        />
      ) : mediaPage && mediaPage.content.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaPage.content.map((media: AdminMediaResponse) => {
              const isCopied = copiedId === media.id;
              return (
                <Card
                  key={media.id}
                  className="border-slate-200 shadow-xs overflow-hidden group hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                >
                  {/* Thumbnail / Media Container */}
                  <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                    {media.type === "IMAGE" ? (
                      <img
                        src={media.cloudinaryUrl}
                        alt={media.title || media.cloudinaryPublicId}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Defensive fallback if image fails to load
                          (e.target as HTMLElement).style.display = "none";
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            const fallback = document.createElement("div");
                            fallback.className = "flex flex-col items-center gap-2 text-slate-400";
                            fallback.innerHTML = `<svg class="h-10 w-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="text-[10px] font-mono text-slate-500">Image Unavailable</span>`;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : media.type === "AUDIO" ? (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Music className="h-10 w-10 text-indigo-500" />
                        <span className="text-[10px] font-mono text-slate-500">Audio File</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Video className="h-10 w-10 text-amber-500" />
                        <span className="text-[10px] font-mono text-slate-500">Video File</span>
                      </div>
                    )}
                    <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                      {media.type}
                    </span>
                  </div>

                  {/* Card Info & Actions */}
                  <div className="p-3 space-y-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={media.title || media.cloudinaryPublicId}>
                        {media.title || media.cloudinaryPublicId}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formatFileSize(media.fileSizeBytes)} • {media.uploadedAt ? new Date(media.uploadedAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        variant={isCopied ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCopyUrl(media)}
                        className={`flex-1 text-[11px] h-7 font-medium ${
                          isCopied ? "bg-emerald-600 hover:bg-emerald-500 text-white" : ""
                        }`}
                        aria-label={`Copy URL for ${media.title || media.cloudinaryPublicId}`}
                      >
                        {isCopied ? (
                          <span className="flex items-center justify-center gap-1">
                            <Check className="h-3 w-3" />
                            Copied!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1">
                            <Copy className="h-3 w-3" />
                            Copy URL
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteMediaTarget(media)}
                        className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                        aria-label={`Delete asset ${media.title || media.cloudinaryPublicId}`}
                        title="Delete asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {mediaPage.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-xs text-slate-500">
                Page {mediaPage.pageNo + 1} of {mediaPage.totalPages} ({mediaPage.totalElements} items)
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={mediaPage.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={mediaPage.last}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No media assets found"
          description="Upload images, audio, or video assets to Cloudinary using the form above."
          icon={ImageIcon}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteMediaTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-bold text-lg text-slate-900">Delete Media Asset</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{deleteMediaTarget.title || deleteMediaTarget.cloudinaryPublicId}</strong>? This action will permanently remove the file from Cloudinary and database.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteMediaTarget(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
                disabled={deleteMutation.isPending}
                onClick={handleDeleteConfirm}
              >
                {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMediaPage;
