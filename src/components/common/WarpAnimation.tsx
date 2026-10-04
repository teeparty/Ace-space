import React, { useEffect, useRef } from 'react';

interface WarpAnimationProps {
  destinationName: string;
  onComplete: () => void;
}

export const WarpAnimation: React.FC<WarpAnimationProps> = ({
  destinationName,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: Array<{ x: number; y: number; z: number; pz: number; color: string }> = [];
    const numStars = 600;
    const colors = ['#ffffff', '#38bdf8', '#ec4899', '#facc15', '#a855f7'];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: width,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let speed = 4;
    let animId: number;
    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 1600) {
        onComplete();
        return;
      }

      // Acceleration curve
      if (elapsed < 800) {
        speed += 1.2;
      } else {
        speed = Math.max(8, speed - 1);
      }

      ctx.fillStyle = 'rgba(6, 8, 20, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = width;
          star.pz = width;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const pk = 128.0 / star.pz;
          const prevX = star.x * pk + cx;
          const prevY = star.y * pk + cy;

          ctx.strokeStyle = star.color;
          ctx.lineWidth = Math.min(4, (1 - star.z / width) * 4);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.stroke();

          star.pz = star.z;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10 text-center px-4">
        <div className="text-xs font-arcade text-cyan-400 tracking-widest mb-2 animate-pulse">
          HYPERSPACE WARP ENGAGED
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-arcade text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.9)] mb-4">
          WARPING TO {destinationName.toUpperCase()}
        </h1>
        <div className="inline-block px-4 py-1.5 bg-slate-900/80 border border-yellow-400 text-yellow-300 font-mono text-xs">
          CALCULATING RE-ENTRY VECTOR · PREPARING STAGE
        </div>
      </div>
    </div>
  );
};
