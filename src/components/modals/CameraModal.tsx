import React, { useEffect } from 'react';
import { useCameraStream } from '../../hooks/useCameraStream';
import { IconCamera, IconX } from '../icons/SvgIcons';
import styles from './CameraModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: Props) {
  const { videoRef, startCamera, stopCamera, capturePhoto } = useCameraStream();

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      onCapture(photo);
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Take Photo</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <IconX size={24} />
          </button>
        </div>

        <div className={styles.videoContainer}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={styles.video}
          />
          <div className={styles.guideline}></div>
        </div>

        <div className={styles.actions}>
          <button className={styles.captureBtn} onClick={handleCapture}>
            <IconCamera size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
