import { useRef, useCallback, useEffect } from 'react';

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 300 }, height: { ideal: 300 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror the image to match the video preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      const size = Math.min(videoRef.current.videoWidth, videoRef.current.videoHeight);
      const sx = (videoRef.current.videoWidth - size) / 2;
      const sy = (videoRef.current.videoHeight - size) / 2;
      
      ctx.drawImage(videoRef.current, sx, sy, size, size, 0, 0, 300, 300);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  }, []);

  useEffect(() => {
    return () => {
      stopCamera(); // cleanup on unmount
    };
  }, [stopCamera]);

  return { videoRef, startCamera, stopCamera, capturePhoto };
}
