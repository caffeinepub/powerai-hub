import { useCallback, useState } from "react";

export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
  width: number;
  height: number;
}

const STORAGE_KEY = "snapvault_photos";

function loadFromStorage(): Photo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Photo[];
  } catch {
    return [];
  }
}

function saveToStorage(photos: Photo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch {
    // localStorage quota exceeded — skip silently
  }
}

export function usePhotoStorage() {
  const [photos, setPhotos] = useState<Photo[]>(() => loadFromStorage());

  const addPhoto = useCallback(
    (dataUrl: string, width: number, height: number): Photo => {
      const photo: Photo = {
        id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        dataUrl,
        timestamp: Date.now(),
        width,
        height,
      };
      setPhotos((prev) => {
        const next = [photo, ...prev];
        saveToStorage(next);
        return next;
      });
      return photo;
    },
    [],
  );

  const deletePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const downloadPhoto = useCallback((photo: Photo) => {
    const a = document.createElement("a");
    a.href = photo.dataUrl;
    a.download = `snap_${new Date(photo.timestamp).toISOString().replace(/[:.]/g, "-")}.jpg`;
    a.click();
  }, []);

  return { photos, addPhoto, deletePhoto, downloadPhoto };
}
