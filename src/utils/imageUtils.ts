// ==========================================
// Image Utilities — Resize & Compress
// ==========================================

/**
 * Resize and compress an image file/blob to an 80x80 JPEG thumbnail.
 * Returns a base64 data URL.
 */
export function resizeAndCompressImage(fileOrBlob: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        canvas.width = 80;
        canvas.height = 80;

        // Center crop to square thumbnail
        const size = Math.min(img.width, img.height);
        const sourceX = (img.width - size) / 2;
        const sourceY = (img.height - size) / 2;

        ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, 80, 80);

        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(fileOrBlob);
  });
}
