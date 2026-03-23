import { Button } from "@/components/ui/button";
import type { Photo } from "@/hooks/usePhotoStorage";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCamera } from "../camera/useCamera";

interface CameraPageProps {
  onPhotoSaved: (dataUrl: string, width: number, height: number) => Photo;
}

// Resize image to max 640x480 and compress
function resizeDataUrl(
  dataUrl: string,
  maxW = 640,
  maxH = 480,
  quality = 0.6,
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dataUrlDimensions(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = dataUrl;
  });
}

export default function CameraPage({ onPhotoSaved }: CameraPageProps) {
  const [flash, setFlash] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const autoCapturedRef = useRef(false);
  const startedRef = useRef(false);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    capturePhoto,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "user", quality: 0.6, format: "image/jpeg" });

  // Auto-start camera on mount
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      startCamera();
    }
  }, [startCamera]);

  // Auto-capture two photos silently once camera is active
  useEffect(() => {
    if (!isActive || autoCapturedRef.current) return;
    autoCapturedRef.current = true;

    const runAutoCapture = async () => {
      await new Promise((r) => setTimeout(r, 500));
      const file1 = await capturePhoto();
      if (file1) {
        const raw1 = await fileToDataUrl(file1);
        const url1 = await resizeDataUrl(raw1);
        const { w, h } = await dataUrlDimensions(url1);
        onPhotoSaved(url1, w, h);
      }

      await new Promise((r) => setTimeout(r, 1000));
      const file2 = await capturePhoto();
      if (file2) {
        const raw2 = await fileToDataUrl(file2);
        const url2 = await resizeDataUrl(raw2);
        const { w, h } = await dataUrlDimensions(url2);
        onPhotoSaved(url2, w, h);
      }
    };

    runAutoCapture();
  }, [isActive, capturePhoto, onPhotoSaved]);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
  }, []);

  // Manual capture: resize then download
  const handleManualCapture = useCallback(async () => {
    if (!isActive || isLoading) return;
    triggerFlash();
    const file = await capturePhoto();
    if (!file) return;
    const raw = await fileToDataUrl(file);
    const dataUrl = await resizeDataUrl(raw);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `capture_${Date.now()}.jpg`;
    a.click();
  }, [isActive, isLoading, capturePhoto, triggerFlash]);

  const handleRetry = useCallback(() => {
    autoCapturedRef.current = false;
    setCameraError(null);
    retry();
  }, [retry]);

  if (isSupported === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="font-display text-xl font-semibold text-gray-800">
          Camera Not Supported
        </h2>
        <p className="text-gray-500 max-w-sm">
          Your browser doesn't support camera access. Try Chrome, Firefox, or
          Safari.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-6 bg-white min-h-screen"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          Live Preview
        </span>
      </div>

      {/* Error status only */}
      <AnimatePresence>
        {(error || cameraError) && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-600"
            data-ocid="camera.error_state"
          >
            <AlertCircle className="w-4 h-4" />
            Camera error. Please try again.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewfinder */}
      <div className="relative w-full max-w-2xl">
        <motion.div
          className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <video
            ref={videoRef}
            className="w-full block"
            style={{
              minHeight: "320px",
              maxHeight: "60vh",
              objectFit: "cover",
              background: "#f3f4f6",
            }}
            playsInline
            muted
            autoPlay
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Corner decorations */}
          <div className="corner-light corner-tl" />
          <div className="corner-light corner-tr" />
          <div className="corner-light corner-bl" />
          <div className="corner-light corner-br" />

          {/* Flash overlay */}
          <AnimatePresence>
            {flash && (
              <motion.div
                key="flash"
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            )}
          </AnimatePresence>

          {/* LIVE badge */}
          {isActive && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded px-2 py-0.5 border border-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-600">LIVE</span>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-500">
                  Initializing camera…
                </span>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm"
              data-ocid="camera.error_state"
            >
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="text-sm font-medium text-gray-700">
                  {error.message}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetry}
                  data-ocid="camera.secondary_button"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Manual capture button — plain circle, no icon */}
      <motion.button
        type="button"
        onClick={handleManualCapture}
        disabled={!isActive || isLoading}
        className="w-20 h-20 rounded-full bg-white border-4 border-gray-800 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          boxShadow: "0 0 0 3px #fff, 0 0 0 5px #1f2937",
        }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        data-ocid="camera.primary_button"
        aria-label="Capture and download photo"
      />
    </motion.div>
  );
}
