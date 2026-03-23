import { Toaster } from "@/components/ui/sonner";
import { usePhotoStorage } from "@/hooks/usePhotoStorage";
import CameraPage from "@/pages/CameraPage";
import GalleryPage from "@/pages/GalleryPage";
import { Camera, Heart, Images } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Page = "camera" | "gallery";

export default function App() {
  const [page, setPage] = useState<Page>("camera");
  const { photos, addPhoto, deletePhoto, downloadPhoto } = usePhotoStorage();

  const handlePhotoSaved = (dataUrl: string, width: number, height: number) => {
    const photo = addPhoto(dataUrl, width, height);
    toast.success("Photo saved to gallery!", {
      description: `${width}×${height}px`,
      action: {
        label: "View",
        onClick: () => setPage("gallery"),
      },
    });
    return photo;
  };

  const handleDelete = (id: string) => {
    deletePhoto(id);
    toast.error("Photo deleted");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold leading-none tracking-tight">
                SnapVault
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase leading-none mt-0.5">
                Camera · Gallery
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <button
              type="button"
              onClick={() => setPage("camera")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                page === "camera"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              data-ocid="nav.link"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              onClick={() => setPage("gallery")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                page === "gallery"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              data-ocid="nav.link"
            >
              <Images className="w-3.5 h-3.5" />
              <span>Gallery</span>
              {photos.length > 0 && (
                <span className="ml-0.5 bg-primary text-primary-foreground text-[10px] font-mono rounded-full px-1.5 py-0.5 leading-none">
                  {photos.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {page === "camera" && (
              <CameraPage onPhotoSaved={handlePhotoSaved} />
            )}
            {page === "gallery" && (
              <GalleryPage
                photos={photos}
                onDelete={handleDelete}
                onDownload={downloadPhoto}
              />
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          © {new Date().getFullYear()} · Built with
          <Heart className="w-3 h-3 text-primary mx-0.5" fill="currentColor" />
          using
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors ml-0.5"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
