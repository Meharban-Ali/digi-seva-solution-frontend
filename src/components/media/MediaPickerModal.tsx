import { useState } from "react";
import { useAdminMedia } from "@/hooks/useAdminMedia";
import { AdminMediaResponse } from "@/types/adminMedia.types";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Check, X, Search, FileImage } from "lucide-react";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (url: string) => void;
  currentUrl?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelectUrl,
  currentUrl,
}: MediaPickerModalProps) {
  const [selectedUrl, setSelectedUrl] = useState(currentUrl || "");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: mediaPage, isLoading } = useAdminMedia("IMAGE", 0, 30);

  if (!isOpen) return null;

  const images = mediaPage?.content || [];
  const filteredImages = images.filter((img: AdminMediaResponse) =>
    (img.title || img.cloudinaryPublicId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelectUrl(selectedUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base">Select Image from Media Library</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media files by name..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Gallery Grid Container */}
        <div className="p-4 flex-1 overflow-y-auto min-h-[250px]">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-28 rounded-lg bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredImages.map((img: AdminMediaResponse) => {
                const isSelected = selectedUrl === img.cloudinaryUrl;
                return (
                  <div
                    key={img.id}
                    onClick={() => setSelectedUrl(img.cloudinaryUrl)}
                    className={`group relative rounded-lg border-2 overflow-hidden cursor-pointer aspect-square bg-slate-100 transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={img.cloudinaryUrl}
                      alt={img.title || img.cloudinaryPublicId}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-white p-1.5 rounded-full shadow-md">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white p-1 text-[10px] truncate px-2">
                      {img.title || img.cloudinaryPublicId}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileImage className="h-10 w-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No images found in library.</p>
              <p className="text-[11px] text-slate-400">Upload images in the Media Library tab first.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="truncate max-w-xs text-xs text-slate-500 font-mono">
            {selectedUrl ? `Selected: ${selectedUrl}` : "No image selected"}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" disabled={!selectedUrl} onClick={handleConfirm}>
              Select Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaPickerModal;
