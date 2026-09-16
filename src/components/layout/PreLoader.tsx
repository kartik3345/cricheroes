import React, { useRef, useState, useEffect } from 'react';
import styles from './PreLoader.module.css';

export default function PreLoader({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleDone = () => {
    if (finished) return;
    setFinished(true);
    setFadeOut(true);
    setTimeout(onFinish, 600);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.warn('Autoplay blocked, skipping splash');
        setTimeout(handleDone, 500);
      });
    }

    // Safety timeout: skip after 15 seconds if video hasn't ended
    const safetyTimer = setTimeout(() => {
      handleDone();
    }, 15000);

    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <div className={`${styles.preloader} ${fadeOut ? styles.fadeOut : ''}`}>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className={styles.videoSplash}
        onEnded={handleDone}
      >
        <source src="/splash_screen02.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
