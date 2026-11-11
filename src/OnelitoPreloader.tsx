import { useEffect, useRef, useState } from 'react';

interface OnelitoPreloaderProps {
  progress?: number
  isLoaded?: boolean
  logoSrc?: string
  onFinish?: () => void
}

export default function OnelitoPreloader({ progress = 0, isLoaded = false, logoSrc, onFinish }: OnelitoPreloaderProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);
  const [isDarkInitial] = useState(() => document.documentElement.classList.contains('dark'));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const medallionRef = useRef<HTMLDivElement | null>(null);
  const [displayProgress, setDisplayProgress] = useState(10);

  useEffect(() => {
    let current = 10;
    const interval = setInterval(() => {
      const target = isLoaded ? 100 : Math.min(95, progress);
      if (current < target) {
        current += 1;
        setDisplayProgress(current);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [progress, isLoaded]);

  useEffect(() => {
    if (isLoaded || progress >= 100) {
      setDisplayProgress(100);
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const unmountTimer = setTimeout(() => {
          setShouldUnmount(true);
          if (onFinish) onFinish();
        }, 700);
        return () => clearTimeout(unmountTimer);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, progress, onFinish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateCenterFromMedallion();
    };
    window.addEventListener('resize', handleResize);

    let centerX = width / 2;
    let centerY = height / 2;
    let baseOrbitRadius = 150;

    function updateCenterFromMedallion() {
      if (medallionRef.current) {
        const rect = medallionRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        baseOrbitRadius = Math.max(130, rect.width * 0.72);
      } else {
        centerX = width / 2;
        centerY = height / 2;
      }
    }

    updateCenterFromMedallion();

    const ripples: Array<{ x: number; y: number; r: number; maxR: number; alpha: number; color: string }> = [];
    const bubbles: Array<{ x: number; y: number; r: number; alpha: number; color: string }> = [];

    // Lotus pads positioned surrounding the central logo badge ring naturally
    const lotusPads = [
      { angle: 0.15, distOffset: 25, r: 24, rot: 0.4, hasFlower: true, flowerColor: '#F472B6' },
      { angle: 1.70, distOffset: 32, r: 20, rot: 1.8, hasFlower: false, flowerColor: '' },
      { angle: 3.35, distOffset: 28, r: 26, rot: 3.8, hasFlower: true, flowerColor: '#FB7185' },
      { angle: 4.85, distOffset: 30, r: 22, rot: 5.1, hasFlower: false, flowerColor: '' },
    ];

    const sakuraPetals = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.007,
      vx: 0.12 + Math.random() * 0.18,
      vy: 0.08 + Math.random() * 0.15,
      swayPhase: Math.random() * Math.PI * 2,
      alpha: 0.5 + Math.random() * 0.4,
    }));

    class ProceduralKoi {
      angle: number
      speed: number
      variant: 'showa' | 'tancho'
      joints: Array<{ x: number; y: number; angle: number }>
      segCount: number = 14
      segLength: number = 11

      constructor(opts: { startAngle: number; speed: number; variant: 'showa' | 'tancho' }) {
        this.angle = opts.startAngle;
        this.speed = opts.speed;
        this.variant = opts.variant;
        this.joints = [];
        for (let i = 0; i < this.segCount; i++) {
          this.joints.push({
            x: centerX + Math.cos(this.angle) * (baseOrbitRadius - i * this.segLength),
            y: centerY + Math.sin(this.angle) * (baseOrbitRadius - i * this.segLength),
            angle: this.angle,
          });
        }
      }

      update(time: number) {
        this.angle += this.speed;
        const targetX = centerX + Math.cos(this.angle) * baseOrbitRadius + Math.sin(time * 0.0015) * 12;
        const targetY = centerY + Math.sin(this.angle) * baseOrbitRadius + Math.cos(time * 0.0012) * 12;

        this.joints[0].x += (targetX - this.joints[0].x) * 0.22;
        this.joints[0].y += (targetY - this.joints[0].y) * 0.22;

        for (let i = 1; i < this.segCount; i++) {
          const prev = this.joints[i - 1];
          const curr = this.joints[i];
          const dx = curr.x - prev.x;
          const dy = curr.y - prev.y;
          const angle = Math.atan2(dy, dx);

          curr.x = prev.x + Math.cos(angle) * this.segLength;
          curr.y = prev.y + Math.sin(angle) * this.segLength;
          curr.angle = angle;
        }

        // Sparse & subtle tail ripples (not too frequent)
        if (Math.random() < 0.035) {
          const tailJoint = this.joints[this.segCount - 1];
          bubbles.push({
            x: tailJoint.x + (Math.random() - 0.5) * 4,
            y: tailJoint.y + (Math.random() - 0.5) * 4,
            r: 1 + Math.random() * 1.2,
            alpha: 0.25,
            color: this.variant === 'showa' ? '#D61F26' : '#888888',
          });
          if (Math.random() < 0.2) {
            ripples.push({
              x: tailJoint.x,
              y: tailJoint.y,
              r: 2,
              maxR: 24 + Math.random() * 10,
              alpha: 0.18,
              color: '#D61F26',
            });
          }
        }
      }

      draw(c: CanvasRenderingContext2D, isDark: boolean) {
        const leftPts: Array<{ x: number; y: number }> = [];
        const rightPts: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < this.segCount; i++) {
          const j = this.joints[i];
          const widthFactor = Math.sin((i / (this.segCount - 1)) * Math.PI) * 13 + 3;
          const perp = j.angle + Math.PI / 2;
          leftPts.push({ x: j.x + Math.cos(perp) * widthFactor, y: j.y + Math.sin(perp) * widthFactor });
          rightPts.push({ x: j.x - Math.cos(perp) * widthFactor, y: j.y - Math.sin(perp) * widthFactor });
        }

        c.save();
        c.beginPath();
        c.moveTo(leftPts[0].x, leftPts[0].y);
        for (let i = 1; i < leftPts.length; i++) c.lineTo(leftPts[i].x, leftPts[i].y);
        for (let i = rightPts.length - 1; i >= 0; i--) c.lineTo(rightPts[i].x, rightPts[i].y);
        c.closePath();

        const bodyGrad = c.createLinearGradient(this.joints[0].x, this.joints[0].y, this.joints[this.segCount - 1].x, this.joints[this.segCount - 1].y);
        if (this.variant === 'showa') {
          bodyGrad.addColorStop(0, isDark ? '#27272a' : '#18181b');
          bodyGrad.addColorStop(0.5, isDark ? '#d4d4d8' : '#fafafa');
          bodyGrad.addColorStop(1, isDark ? '#b91c1c' : '#ef4444');
        } else {
          bodyGrad.addColorStop(0, isDark ? '#fafafa' : '#ffffff');
          bodyGrad.addColorStop(0.7, isDark ? '#f43f5e' : '#e11d48');
          bodyGrad.addColorStop(1, isDark ? '#e4e4e7' : '#f4f4f5');
        }

        c.fillStyle = bodyGrad;
        c.shadowColor = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)';
        c.shadowBlur = 10;
        c.shadowOffsetY = 4;
        c.fill();
        c.restore();

        // Head accent / Tancho dot
        const head = this.joints[0];
        c.save();
        c.beginPath();
        c.arc(head.x + Math.cos(head.angle) * 3, head.y + Math.sin(head.angle) * 3, this.variant === 'tancho' ? 5.5 : 3.5, 0, Math.PI * 2);
        c.fillStyle = '#ef4444';
        c.fill();
        c.restore();
      }
    }

    const koiList = [
      new ProceduralKoi({ startAngle: 0, speed: 0.0065, variant: 'showa' }),
      new ProceduralKoi({ startAngle: Math.PI, speed: 0.0065, variant: 'tancho' }),
    ];

    function drawLotusPadAndFlower(c: CanvasRenderingContext2D, pad: any, time: number, isDark: boolean) {
      // Natural floating bob and swaying rotation
      const floatBob = Math.sin(time * 0.0011 + pad.angle * 2) * 2.8;
      const swayRot = Math.sin(time * 0.0008 + pad.angle) * 0.06;
      const dist = baseOrbitRadius + pad.distOffset + floatBob;
      const lx = centerX + Math.cos(pad.angle) * dist;
      const ly = centerY + Math.sin(pad.angle) * dist;
      const currentRot = pad.rot + swayRot;

      c.save();
      c.translate(lx, ly);
      c.rotate(currentRot);

      c.shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(17,17,17,0.1)';
      c.shadowBlur = 6;
      c.shadowOffsetY = 3;

      c.beginPath();
      c.moveTo(0, 0);
      c.arc(0, 0, pad.r, 0.22, Math.PI * 2 - 0.22);
      c.closePath();

      const leafGrad = c.createRadialGradient(0, 0, 2, 0, 0, pad.r);
      leafGrad.addColorStop(0, isDark ? '#15803D' : '#22C55E');
      leafGrad.addColorStop(1, isDark ? '#14532D' : '#15803D');
      c.fillStyle = leafGrad;
      c.fill();

      c.shadowColor = 'transparent';
      c.strokeStyle = isDark ? 'rgba(187, 247, 208, 0.2)' : 'rgba(255, 255, 255, 0.3)';
      c.lineWidth = 1;
      c.stroke();

      for (let i = 0; i < 6; i++) {
        const vAngle = 0.5 + i * 0.9;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(Math.cos(vAngle) * (pad.r * 0.75), Math.sin(vAngle) * (pad.r * 0.75));
        c.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        c.lineWidth = 0.8;
        c.stroke();
      }

      if (pad.hasFlower) {
        const petalCount = 8;
        for (let layer = 0; layer < 2; layer++) {
          const pRadius = layer === 0 ? pad.r * 0.52 : pad.r * 0.35;
          for (let p = 0; p < petalCount; p++) {
            const a = (p * Math.PI * 2) / petalCount + layer * 0.4;
            c.save();
            c.rotate(a);
            c.beginPath();
            c.moveTo(0, 0);
            c.quadraticCurveTo(pRadius * 0.5, -pRadius * 0.3, pRadius, 0);
            c.quadraticCurveTo(pRadius * 0.5, pRadius * 0.3, 0, 0);
            c.fillStyle = layer === 0 ? pad.flowerColor : '#FBCFE8';
            c.fill();
            c.restore();
          }
        }
        c.beginPath();
        c.arc(0, 0, 3, 0, Math.PI * 2);
        c.fillStyle = '#FACC15';
        c.fill();
      }

      c.restore();

      // Sparse lotus ripple emission
      if (Math.random() < 0.001) {
        ripples.push({
          x: lx,
          y: ly,
          r: 3,
          maxR: 28 + Math.random() * 10,
          alpha: 0.15,
          color: '#22C55E',
        });
      }
    }

    function drawSakuraPetal(c: CanvasRenderingContext2D, p: any, time: number) {
      p.x += p.vx + Math.sin(time * 0.002 + p.swayPhase) * 0.25;
      p.y += p.vy + Math.cos(time * 0.0015 + p.swayPhase) * 0.15;
      p.rot += p.rotSpeed;

      // Gentle magnetic pull toward koi head if close
      const head = koiList[0].joints[0];
      const dx = head.x - p.x;
      const dy = head.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        p.x += (dx / dist) * 0.35;
        p.y += (dy / dist) * 0.35;
      }

      if (p.x > width + 30) p.x = -30;
      if (p.y > height + 30) p.y = -30;

      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.beginPath();
      c.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      c.fillStyle = `rgba(244, 114, 182, ${p.alpha})`;
      c.fill();
      c.restore();
    }

    let lastTime = performance.now();

    function renderLoop(time: number) {
      const dt = time - lastTime;
      lastTime = time;
      if (dt > 100) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      updateCenterFromMedallion();
      ctx.clearRect(0, 0, width, height);

      // Draw dashed orbit path
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseOrbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isDarkInitial ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 8]);
      ctx.stroke();
      ctx.restore();

      // Update & draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 0.55;
        rp.alpha *= 0.97;
        if (rp.r >= rp.maxR || rp.alpha <= 0.01) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0, rp.alpha);
        ctx.stroke();
        ctx.restore();
      }

      // Update & draw bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= 0.35;
        b.alpha -= 0.012;
        if (b.alpha <= 0) {
          bubbles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = Math.max(0, b.alpha);
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < lotusPads.length; i++) {
        drawLotusPadAndFlower(ctx, lotusPads[i], time, isDarkInitial);
      }

      for (let i = 0; i < koiList.length; i++) {
        koiList[i].update(time);
        koiList[i].draw(ctx, isDarkInitial);
      }

      for (let i = 0; i < sakuraPetals.length; i++) {
        drawSakuraPetal(ctx, sakuraPetals[i], time);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (shouldUnmount) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkInitial ? '#0B0C0E' : '#ffffff',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.7s ease',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        userSelect: 'none',
        fontFamily: 'DM Sans, Inter, system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes floatPulse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.01); }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .koi-logo-float { animation: floatPulse 4.5s ease-in-out infinite; }
        .koi-shimmer { animation: shimmerSlide 1.6s infinite; }
      `}</style>

      {/* Canvas Full Screen Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Central Medallion */}
      <div
        ref={medallionRef}
        className="koi-logo-float relative z-10 flex flex-col items-center justify-center p-8 rounded-3xl"
        style={{
          backgroundColor: isDarkInitial ? 'rgba(24, 24, 27, 0.85)' : 'rgba(255, 255, 255, 0.88)',
          border: `1px solid ${isDarkInitial ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow: isDarkInitial ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(16px)',
          minWidth: '280px',
        }}
      >
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center rounded-2xl overflow-hidden shadow-md"
             style={{ backgroundColor: isDarkInitial ? '#27272a' : '#f4f4f5' }}>
          <img
            src={logoSrc || "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=160&auto=format&fit=crop&q=80"}
            alt="Onelito Koi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent koi-shimmer pointer-events-none" />
        </div>

        <h1 className="text-xl font-bold tracking-tight mb-1" style={{ color: isDarkInitial ? '#f4f4f5' : '#18181b' }}>
          ONELITO KOI
        </h1>
        <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: isDarkInitial ? '#a1a1aa' : '#71717a' }}>
          Japanese Koi Management
        </p>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs font-semibold" style={{ color: isDarkInitial ? '#d4d4d8' : '#3f3f46' }}>
            <span>MEMUAT DATA KOLAM</span>
            <span>{displayProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDarkInitial ? '#3f3f46' : '#e4e4e7' }}>
            <div
              style={{
                width: `${displayProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #ec4899)',
                borderRadius: '9999px',
                transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
