"use client";

import { useEffect, useRef } from "react";

export default function HeroBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const textPoints: any[] = [];

    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d")!;
    offCanvas.width = width;
    offCanvas.height = height;

    // 🔥 Text sizing
    const titleSize = Math.min(width / 5, 140);
    const subSize = titleSize * 0.4;

    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";

    // TOP LINE (smaller)
    offCtx.font = `bold ${subSize}px Poppins, Arial, sans-serif`;
    offCtx.fillText("WELCOME TO", width / 2, height / 2 - titleSize * 0.6);

    // MAIN BRAND (big + bold)
    offCtx.font = `bold ${titleSize}px Poppins, Arial, sans-serif`;
    offCtx.fillText("MIKE'S STORE", width / 2, height / 2 + titleSize * 0.2);

    const imageData = offCtx.getImageData(0, 0, width, height);
    const gap = 4;

    // Create particle positions from text
    for (let y = 0; y < height; y += gap) {
      for (let x = 0; x < width; x += gap) {
        const index = (y * width + x) * 4;
        const alpha = imageData.data[index + 3];
        if (alpha > 150) {
          textPoints.push({ x, y, ox: x, oy: y });
        }
      }
    }

    const applyDistortion = (p: any) => {
      const dx = p.x - mouse.current.x;
      const dy = p.y - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 50; // bigger distortion radius

      if (dist < radius) {
        const force = ((radius - dist) / radius) * 3.5;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force;
        p.y += Math.sin(angle) * force;
      } else {
        p.x += (p.ox - p.x) * 0.07;
        p.y += (p.oy - p.y) * 0.07;
      }
    };

    let animationId: any;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      textPoints.forEach((p) => {
        applyDistortion(p);

        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(p.x - 1, p.y, 4, 4);
        ctx.fillRect(p.x + 1, p.y, 4, 4);
        ctx.fillRect(p.x, p.y - 1, 4, 4);
        ctx.fillRect(p.x, p.y + 1, 4, 4);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(p.x, p.y, 4, 4);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full h-64 md:h-96 bg-gradient-to-b from-black to-neutral-900">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
