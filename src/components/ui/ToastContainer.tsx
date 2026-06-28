import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastType } from '../../types/cricket';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType | 'info';
}

// Global state for toasts
let addToastFn: ((msg: string, type: ToastType | 'info') => void) | null = null;
let triggerCelebrationFn: ((type: ToastType) => void) | null = null;

export const showToast = (message: string, type: ToastType | 'info' = 'info') => {
  if (addToastFn) addToastFn(message, type);
};

export const triggerCelebration = (type: ToastType) => {
  if (triggerCelebrationFn) triggerCelebrationFn(type);
};

// --- Confetti System ---
function ConfettiCanvas({ active, type }: { active: boolean, type: ToastType | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    let animationId: number;
    let isActive = true;

    const colors = type === 'four' || type === 'six' ? ['#00f5a0', '#00d9f5', '#ffffff'] :
                   type === 'wicket' ? ['#ef4444', '#f97316', '#ffffff'] :
                   ['#a78bfa', '#fbbf24', '#ffffff'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 15 - 5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rs: (Math.random() - 0.5) * 10
      });
    }

    const animate = () => {
      if (!isActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let stillActive = false;
      particles.forEach(p => {
        p.vy += 0.4; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rs;
        
        if (p.y < canvas.height + 20) stillActive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
      });

      if (stillActive) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
    };
  }, [active, type]);

  return <canvas ref={canvasRef} id="confettiCanvas" style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 10001 }} />;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [celebration, setCelebration] = useState<{active: boolean, type: ToastType | null}>({active: false, type: null});
  const toastIdRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    addToastFn = (message: string, type: ToastType | 'info') => {
      const id = ++toastIdRef.current;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 2800);
    };

    triggerCelebrationFn = (type: ToastType) => {
      setCelebration({ active: true, type });
      setTimeout(() => setCelebration({ active: false, type: null }), 2000);
    };

    return () => {
      addToastFn = null;
      triggerCelebrationFn = null;
    };
  }, [removeToast]);

  return (
    <>
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      <div className={`celebration-overlay ${celebration.active ? 'active' : ''}`}>
        <div className={`celebration-sticker sticker-${celebration.type}`}>
          {celebration.type}
        </div>
      </div>
      
      <ConfettiCanvas active={celebration.active} type={celebration.type} />
    </>
  );
}
