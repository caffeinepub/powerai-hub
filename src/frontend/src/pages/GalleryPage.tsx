import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Photo } from "@/hooks/usePhotoStorage";
import { Calendar, Download, Images, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface GalleryPageProps {
  photos: Photo[];
  onDelete: (id: string) => void;
  onDownload: (photo: Photo) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GalleryPage({
  photos,
  onDelete,
  onDownload,
}: GalleryPageProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
      if (lightboxPhoto?.id === deleteTarget) setLightboxPhoto(null);
    }
  };

  return (
    <motion.div
      className="py-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Gallery
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </span>
      </div>

      {/* Empty state */}
      {photos.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="gallery.empty_state"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Images className="w-9 h-9 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold mb-1">
              No photos yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Switch to the Camera tab to capture your first photo.
            </p>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <AnimatePresence>
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                className="group relative rounded-lg overflow-hidden bg-card cursor-pointer photo-card-hover"
                style={{ aspectRatio: "1" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                data-ocid={`gallery.item.${i + 1}`}
                onClick={() => setLightboxPhoto(photo)}
              >
                <img
                  src={photo.dataUrl}
                  alt={`Taken ${formatDate(photo.timestamp)}`}
                  className="w-full h-full object-cover"
                />

                {/* Hover overlay */}
                <div className="photo-overlay absolute inset-0 bg-background/75 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 flex flex-col justify-between p-2">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(photo.timestamp)}</span>
                  </div>
                  <div className="flex gap-1.5 justify-end">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-7 h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(photo);
                      }}
                      data-ocid={`gallery.edit_button.${i + 1}`}
                      aria-label="Download photo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="w-7 h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(photo.id);
                      }}
                      data-ocid={`gallery.delete_button.${i + 1}`}
                      aria-label="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            data-ocid="gallery.modal"
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.dataUrl}
                alt="Full size view"
                className="w-full h-auto rounded-lg max-h-[80vh] object-contain"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-9 h-9"
                  onClick={() => onDownload(lightboxPhoto)}
                  data-ocid="gallery.edit_button"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-9 h-9"
                  onClick={() => setLightboxPhoto(null)}
                  data-ocid="gallery.close_button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 text-center text-xs font-mono text-muted-foreground">
                {formatDate(lightboxPhoto.timestamp)} · {lightboxPhoto.width}×
                {lightboxPhoto.height}px
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="gallery.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The photo will be permanently
              removed from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="gallery.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="gallery.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
