import { useEffect, useRef, useState } from 'react';

interface OnelitoPreloaderProps {
  progress?: number
  isLoaded?: boolean
  logoSrc?: string
  onFinish?: () => void
}

export default function OnelitoPreloader({
  progress = 0,
  isLoaded = false,
  logoSrc = '/logo-vertical.png',
  onFinish,
}: OnelitoPreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const medallionRef = useRef<HTMLDivElement | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const isComplete = isLoaded || clampedProgress >= 100;

  useEffect(() => {
    if (isComplete) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 900);

      const unmountTimer = setTimeout(() => {
        setShouldUnmount(true);
        if (onFinish) onFinish();
      }, 1600);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isComplete, onFinish]);

  useEffect(() => {
    if (shouldUnmount) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let baseOrbitRadius = 135;

    const ripples: Array<{ x: number; y: number; r: number; maxR: number; alpha: number; color: string }> = [];
    const bubbles: Array<{ x: number; y: number; r: number; alpha: number; color: string }> = [];

    const bodyWidthProfile: number[] = [
      7.5, 13.5, 16.5, 16.2, 14.8, 13.0, 11.0,
      9.0, 7.2, 5.6, 4.3, 3.3, 2.5, 1.8
    ];

    const lotusPads = [
      { angle: 0.25, distOffset: 90, r: 24, rot: 0.4, hasFlower: true, flowerColor: '#F472B6' },
      { angle: 1.15, distOffset: 98, r: 20, rot: 1.8, hasFlower: false, flowerColor: '' },
      { angle: 4.15, distOffset: 88, r: 26, rot: 3.8, hasFlower: true, flowerColor: '#FB7185' },
      { angle: 5.15, distOffset: 95, r: 22, rot: 5.1, hasFlower: false, flowerColor: '' },
    ];

    const sakuraPetals = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      vx: 0.15 + Math.random() * 0.22,
      vy: 0.1 + Math.random() * 0.18,
      swayPhase: Math.random() * Math.PI * 2,
      alpha: 0.55 + Math.random() * 0.3,
    }));

    class ProceduralKoi {
      angle: number
      speed: number
      variant: string
      phase: number
      segCount: number
      segDist: number
      rawJoints: Array<{ x: number; y: number; angle: number }>
      joints: Array<{ x: number; y: number; angle: number }>

      constructor(config: { startAngle?: number; speed?: number; variant?: string; phase?: number }) {
        this.angle = config.startAngle || 0;
        this.speed = config.speed || 0.0072;
        this.variant = config.variant || 'showa';
        this.phase = config.phase || 0;
        this.segCount = bodyWidthProfile.length;
        this.segDist = 6.2;
        this.rawJoints = [];
        this.joints = [];

        for (let i = 0; i < this.segCount; i++) {
          const a = this.angle - i * (this.segDist / baseOrbitRadius);
          const x = centerX + Math.cos(a) * baseOrbitRadius;
          const y = centerY + Math.sin(a) * baseOrbitRadius;
          this.rawJoints.push({ x, y, angle: a + Math.PI / 2 });
          this.joints.push({ x, y, angle: a + Math.PI / 2 });
        }
      }

      update(time: number) {
        this.phase += 0.075;
        const speedMod = 1 + 0.08 * Math.sin(time * 0.001 + (this.variant === 'showa' ? 0 : 3.14));
        this.angle += this.speed * speedMod;

        const currentRadius =
          baseOrbitRadius + Math.sin(time * 0.0009 + (this.variant === 'showa' ? 1.5 : 4.5)) * 5;

        const headSway = Math.sin(this.phase) * 1.6;
        const headX = centerX + Math.cos(this.angle) * (currentRadius + headSway);
        const headY = centerY + Math.sin(this.angle) * (currentRadius + headSway);

        const prevX = this.rawJoints[0].x;
        const prevY = this.rawJoints[0].y;
        const moveAngle = Math.atan2(headY - prevY, headX - prevX);

        this.rawJoints[0].x = headX;
        this.rawJoints[0].y = headY;
        this.rawJoints[0].angle = moveAngle;

        for (let i = 1; i < this.segCount; i++) {
          const prev = this.rawJoints[i - 1];
          const curr = this.rawJoints[i];
          const segAngle = Math.atan2(prev.y - curr.y, prev.x - curr.x);
          curr.x = prev.x - Math.cos(segAngle) * this.segDist;
          curr.y = prev.y - Math.sin(segAngle) * this.segDist;
          curr.angle = segAngle;
        }

        for (let i = 0; i < this.segCount; i++) {
          const raw = this.rawJoints[i];
          const perpAngle = raw.angle + Math.PI / 2;
          const progressRatio = i / (this.segCount - 1);
          const waveAmp = Math.pow(progressRatio, 1.35) * 5.2;
          const waveOffset = Math.sin(this.phase - i * 0.45) * waveAmp;

          this.joints[i].x = raw.x + Math.cos(perpAngle) * waveOffset;
          this.joints[i].y = raw.y + Math.sin(perpAngle) * waveOffset;
        }

        this.joints[0].angle = this.rawJoints[0].angle;
        for (let i = 1; i < this.segCount; i++) {
          const dx = this.joints[i - 1].x - this.joints[i].x;
          const dy = this.joints[i - 1].y - this.joints[i].y;
          this.joints[i].angle = Math.atan2(dy, dx);
        }

        if (Math.random() < 0.12) {
          const tailJoint = this.joints[this.segCount - 1];
          bubbles.push({
            x: tailJoint.x + (Math.random() - 0.5) * 5,
            y: tailJoint.y + (Math.random() - 0.5) * 5,
            r: 1.1 + Math.random() * 1.5,
            alpha: 0.35,
            color: this.variant === 'showa' ? '#D61F26' : '#888888',
          });
        }
      }

      draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
        const leftPts: Array<{ x: number; y: number }> = [];
        const rightPts: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < this.segCount; i++) {
          const j = this.joints[i];
          const w = bodyWidthProfile[i];
          const perp = j.angle + Math.PI / 2;
          leftPts.push({ x: j.x + Math.cos(perp) * w, y: j.y + Math.sin(perp) * w });
          rightPts.push({ x: j.x - Math.cos(perp) * w, y: j.y - Math.sin(perp) * w });
        }

        ctx.save();
        ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.55)' : 'rgba(17, 17, 17, 0.14)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;

        this.drawPairedFins(ctx, 2, 22, 11, 0.55);
        this.drawPairedFins(ctx, 6, 13, 6.5, 0.45);
        this.drawCaudalTail(ctx);

        const head = this.joints[0];
        const headAngle = head.angle;
        const snoutX = head.x + Math.cos(headAngle) * 9.5;
        const snoutY = head.y + Math.sin(headAngle) * 9.5;

        const bodyPath = new Path2D();
        bodyPath.moveTo(snoutX, snoutY);

        for (let i = 0; i < this.segCount - 1; i++) {
          const xc = (leftPts[i].x + leftPts[i + 1].x) / 2;
          const yc = (leftPts[i].y + leftPts[i + 1].y) / 2;
          bodyPath.quadraticCurveTo(leftPts[i].x, leftPts[i].y, xc, yc);
        }
        const lastL = leftPts[this.segCount - 1];
        const lastR = rightPts[this.segCount - 1];
        bodyPath.lineTo(lastL.x, lastL.y);
        bodyPath.lineTo(lastR.x, lastR.y);

        for (let i = this.segCount - 1; i > 0; i--) {
          const xc = (rightPts[i].x + rightPts[i - 1].x) / 2;
          const yc = (rightPts[i].y + rightPts[i - 1].y) / 2;
          bodyPath.quadraticCurveTo(rightPts[i].x, rightPts[i].y, xc, yc);
        }
        bodyPath.quadraticCurveTo(rightPts[0].x, rightPts[0].y, snoutX, snoutY);
        bodyPath.closePath();

        ctx.fillStyle = this.variant === 'showa' ? '#FFFFFF' : (isDark ? '#27272a' : '#141616');
        ctx.fill(bodyPath);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.save();
        ctx.clip(bodyPath);

        if (this.variant === 'showa') {
          this.drawBodyPatch(ctx, 1, 5, 16, '#D61F26');
          this.drawBodyPatch(ctx, 7, -4, 12, '#D61F26');
          this.drawBodyPatch(ctx, 4, -7, 11, '#111111');
          this.drawBodyPatch(ctx, 9, 5, 9.5, '#111111');
        } else {
          this.drawBodyPatch(ctx, 3, -6, 13, '#FFFFFF');
          this.drawBodyPatch(ctx, 6, 5, 14, '#D61F26');
          this.drawBodyPatch(ctx, 9, -4, 10, '#FFFFFF');
          const headJ = this.joints[0];
          const headAngle = headJ.angle;
          const rx = headJ.x + Math.cos(headAngle) * 5;
          const ry = headJ.y + Math.sin(headAngle) * 5;
          ctx.beginPath();
          ctx.arc(rx, ry, 5.0, 0, Math.PI * 2);
          ctx.fillStyle = '#D61F26';
          ctx.fill();
        }
        ctx.restore();

        ctx.strokeStyle =
          this.variant === 'showa'
            ? isDark
              ? 'rgba(255,255,255,0.25)'
              : 'rgba(17,17,17,0.3)'
            : isDark
            ? 'rgba(255,255,255,0.5)'
            : 'rgba(17,17,17,0.65)';
        ctx.lineWidth = 1.2;
        ctx.stroke(bodyPath);

        this.drawDorsalFin(ctx);
        this.drawHeadDetails(ctx, snoutX, snoutY);
        ctx.restore();
      }

      drawPairedFins(ctx: CanvasRenderingContext2D, jointIndex: number, length: number, widthFin: number, baseSpread: number) {
        const j = this.joints[jointIndex];
        const bodyW = bodyWidthProfile[jointIndex] * 0.72;
        const paddleSwing = Math.sin(this.phase - jointIndex * 0.3) * 0.12;

        [-1, 1].forEach((side: number) => {
          const perp = j.angle + side * (Math.PI / 2);
          const baseX = j.x + Math.cos(perp) * bodyW;
          const baseY = j.y + Math.sin(perp) * bodyW;
          const finAngle = j.angle + Math.PI + side * (baseSpread + paddleSwing);

          ctx.save();
          ctx.translate(baseX, baseY);
          ctx.rotate(finAngle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(length * 0.55, side * widthFin, length, side * (widthFin * 0.25));
          ctx.quadraticCurveTo(length * 0.45, -side * (widthFin * 0.2), 0, 0);
          ctx.closePath();

          if (this.variant === 'showa') {
            ctx.fillStyle = side === 1 ? 'rgba(214, 31, 38, 0.88)' : 'rgba(255, 255, 255, 0.9)';
            ctx.strokeStyle = 'rgba(17, 17, 17, 0.3)';
          } else {
            ctx.fillStyle = side === -1 ? 'rgba(214, 31, 38, 0.88)' : 'rgba(24, 24, 27, 0.9)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          }
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });
      }

      drawCaudalTail(ctx: CanvasRenderingContext2D) {
        const baseJ = this.joints[this.segCount - 2];
        const tipJ = this.joints[this.segCount - 1];
        const tailAngle = tipJ.angle + Math.PI;
        const tailSway = Math.sin(this.phase - 4.2) * 0.18;

        ctx.save();
        ctx.translate(baseJ.x, baseJ.y);
        ctx.rotate(tailAngle + tailSway);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, -8, 22, -16, 28, -11);
        ctx.quadraticCurveTo(18, -2, 15, 0);
        ctx.quadraticCurveTo(18, 2, 28, 11);
        ctx.bezierCurveTo(22, 16, 10, 8, 0, 0);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 28, 0);
        if (this.variant === 'showa') {
          grad.addColorStop(0, '#111111');
          grad.addColorStop(0.5, '#D61F26');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.85)');
        } else {
          grad.addColorStop(0, '#141416');
          grad.addColorStop(0.6, '#D61F26');
          grad.addColorStop(1, 'rgba(214, 31, 38, 0.75)');
        }
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      drawBodyPatch(ctx: CanvasRenderingContext2D, startIdx: number, sideOffset: number, radius: number, color: string) {
        const j = this.joints[startIdx];
        const perp = j.angle + Math.PI / 2;
        const px = j.x + Math.cos(perp) * sideOffset;
        const py = j.y + Math.sin(perp) * sideOffset;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(j.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.35, radius * 0.85, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }

      drawDorsalFin(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        const start = 3;
        const end = 9;
        ctx.moveTo(this.joints[start].x, this.joints[start].y);
        for (let i = start + 1; i <= end; i++) {
          const j = this.joints[i];
          const sway = Math.sin(this.phase - i * 0.4) * 2.5;
          const perp = j.angle + Math.PI / 2;
          ctx.lineTo(j.x + Math.cos(perp) * sway, j.y + Math.sin(perp) * sway);
        }
        ctx.strokeStyle = this.variant === 'showa' ? '#111111' : '#D61F26';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      drawHeadDetails(ctx: CanvasRenderingContext2D, snoutX: number, snoutY: number) {
        const head = this.joints[0];
        const neck = this.joints[1];
        const angle = head.angle;
        const perp = angle + Math.PI / 2;

        [-1, 1].forEach((side: number) => {
          const bx = snoutX + Math.cos(perp) * (side * 3.5) - Math.cos(angle) * 2;
          const by = snoutY + Math.sin(perp) * (side * 3.5) - Math.sin(angle) * 2;
          const tipAngle = angle + side * 0.65;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(
            bx + Math.cos(tipAngle) * 5,
            by + Math.sin(tipAngle) * 5,
            bx + Math.cos(tipAngle + side * 0.3) * 8,
            by + Math.sin(tipAngle + side * 0.3) * 8
          );
          ctx.strokeStyle = '#D61F26';
          ctx.lineWidth = 1.3;
          ctx.lineCap = 'round';
          ctx.stroke();
        });

        const eyeDist = 8.2;
        [-1, 1].forEach((side: number) => {
          const ex = head.x * 0.55 + neck.x * 0.45 + Math.cos(perp) * (side * eyeDist);
          const ey = head.y * 0.55 + neck.y * 0.45 + Math.sin(perp) * (side * eyeDist);
          ctx.beginPath();
          ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = this.variant === 'showa' ? '#111111' : '#FFFFFF';
          ctx.fill();
        });
      }
    }

    function updateCenterFromMedallion() {
      if (medallionRef.current) {
        const rect = medallionRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        baseOrbitRadius = Math.max(135, rect.width * 0.82);
      } else {
        centerX = width / 2;
        centerY = height / 2;
      }
    }

    updateCenterFromMedallion();

    const koiList = [
      new ProceduralKoi({ startAngle: 0, speed: 0.0072, variant: 'showa', phase: 0 }),
      new ProceduralKoi({ startAngle: Math.PI, speed: 0.0072, variant: 'tancho', phase: Math.PI }),
    ];

    function resizeCanvas() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateCenterFromMedallion();
    }

    function drawLotusPadAndFlower(ctx: CanvasRenderingContext2D, pad: any, time: number, isDark: boolean) {
      const floatBob = Math.sin(time * 0.0014 + pad.angle) * 2.5;
      const dist = baseOrbitRadius + pad.distOffset + floatBob;
      const lx = centerX + Math.cos(pad.angle) * dist;
      const ly = centerY + Math.sin(pad.angle) * dist;
      const currentRot = pad.rot + Math.sin(time * 0.0009 + pad.angle) * 0.06;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(currentRot);

      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(17,17,17,0.12)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, pad.r, 0.22, Math.PI * 2 - 0.22);
      ctx.closePath();

      const leafGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, pad.r);
      leafGrad.addColorStop(0, isDark ? '#15803D' : '#22C55E');
      leafGrad.addColorStop(1, isDark ? '#14532D' : '#15803D');
      ctx.fillStyle = leafGrad;
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = isDark ? 'rgba(187, 247, 208, 0.22)' : 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < 7; i++) {
        const vAngle = 0.5 + i * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(vAngle) * (pad.r * 0.78), Math.sin(vAngle) * (pad.r * 0.78));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      if (pad.hasFlower) {
        const petalCount = 8;
        for (let layer = 0; layer < 2; layer++) {
          const pRadius = layer === 0 ? pad.r * 0.55 : pad.r * 0.38;
          for (let p = 0; p < petalCount; p++) {
            const a = (p * Math.PI * 2) / petalCount + layer * 0.4;
            ctx.save();
            ctx.rotate(a);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(pRadius * 0.5, -pRadius * 0.32, pRadius, 0);
            ctx.quadraticCurveTo(pRadius * 0.5, pRadius * 0.32, 0, 0);
            ctx.fillStyle = layer === 0 ? pad.flowerColor : '#FBCFE8';
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.beginPath();
        ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FACC15';
        ctx.fill();
      }

      ctx.restore();
    }

    function drawSakuraPetal(ctx: CanvasRenderingContext2D, petal: any, time: number) {
      petal.x += petal.vx + Math.sin(time * 0.001 + petal.swayPhase) * 0.15;
      petal.y += petal.vy;
      petal.rot += petal.rotSpeed;

      if (petal.x > width + 20) petal.x = -20;
      if (petal.y > height + 20) petal.y = -20;

      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rot);
      ctx.globalAlpha = petal.alpha;

      const s = petal.size;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.6);
      ctx.bezierCurveTo(-s * 0.8, s * 0.1, -s * 0.7, -s * 0.8, -s * 0.18, -s * 0.9);
      ctx.lineTo(0, -s * 0.62);
      ctx.lineTo(s * 0.18, -s * 0.9);
      ctx.bezierCurveTo(s * 0.7, -s * 0.8, s * 0.8, s * 0.1, 0, s * 0.6);
      ctx.closePath();

      ctx.fillStyle = '#FDA4AF';
      ctx.fill();
      ctx.restore();
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (Math.random() < 0.05) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 3,
          maxR: 38 + Math.random() * 24,
          alpha: 0.25,
          color: '#D61F26',
        });
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 4,
        maxR: 65,
        alpha: 0.5,
        color: '#D61F26',
      });
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    resizeCanvas();

    const rippleInterval = setInterval(() => {
      if (ripples.length < 2) {
        const targetKoi = koiList[Math.floor(Math.random() * koiList.length)];
        const head = targetKoi.joints[0];
        ripples.push({
          x: head.x,
          y: head.y,
          r: 6,
          maxR: 45 + Math.random() * 20,
          alpha: 0.2,
          color: Math.random() > 0.5 ? '#D61F26' : '#888888',
        });
      }
    }, 3500);

    function renderLoop(timestamp: number) {
      const time = timestamp || performance.now();
      ctx.clearRect(0, 0, width, height);
      updateCenterFromMedallion();
      const isDark = document.documentElement.classList.contains('dark');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseOrbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(17, 17, 17, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 9]);
      ctx.stroke();
      ctx.restore();

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 0.48;
        rp.alpha -= 0.004;
        if (rp.alpha <= 0 || rp.r >= rp.maxR) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = Math.max(0, rp.alpha);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.alpha -= 0.009;
        b.r += 0.025;
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

      for (let i = 0; i < koiList.length; i++) {
        koiList[i].update(time);
        koiList[i].draw(ctx, isDark);
      }

      for (let i = 0; i < lotusPads.length; i++) {
        drawLotusPadAndFlower(ctx, lotusPads[i], time, isDark);
      }

      for (let i = 0; i < sakuraPetals.length; i++) {
        drawSakuraPetal(ctx, sakuraPetals[i], time);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(rippleInterval);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [shouldUnmount]);

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
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.7s ease',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        userSelect: 'none',
        fontFamily: 'DM Sans, Inter, system-ui, sans-serif',
      }}
      className="dark:bg-[#0B0C0E]/96"
    >
      <style>{`
        @keyframes rippleExpand {
          0% { transform: scale(0.82); opacity: 0.55; }
          100% { transform: scale(1.75); opacity: 0; }
        }
        @keyframes floatPulse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.01); }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .koi-ripple-1 { animation: rippleExpand 4s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        .koi-ripple-2 { animation: rippleExpand 4s cubic-bezier(0.16, 1, 0.3, 1) infinite 1.3s; }
        .koi-ripple-3 { animation: rippleExpand 4s cubic-bezier(0.16, 1, 0.3, 1) infinite 2.6s; }
        .koi-logo-float { animation: floatPulse 4.5s ease-in-out infinite; }
        .koi-shimmer { animation: shimmerSlide 1.6s infinite; }
      `}</style>

      {/* Canvas Full Screen */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'rgba(214, 31, 38, 0.08)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Central Pond Medallion Anchor */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '360px',
          height: '360px',
          marginBottom: '16px',
          zIndex: 20,
        }}
      >
        <div className="koi-ripple-1" style={{ position: 'absolute', width: '190px', height: '190px', borderRadius: '50%', border: '1px solid rgba(214, 31, 38, 0.3)', pointerEvents: 'none' }} />
        <div className="koi-ripple-2" style={{ position: 'absolute', width: '190px', height: '190px', borderRadius: '50%', border: '1px solid rgba(17, 17, 17, 0.2)', pointerEvents: 'none' }} />
        <div className="koi-ripple-3" style={{ position: 'absolute', width: '190px', height: '190px', borderRadius: '50%', border: '1px solid rgba(214, 31, 38, 0.25)', pointerEvents: 'none' }} />

        {/* Medallion Logo */}
        <div
          ref={medallionRef}
          className="koi-logo-float"
          style={{
            position: 'relative',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 14px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '16px',
          }}
        >
          {!imgError ? (
            <img
              src={logoSrc}
              alt="ONELITO KOI Logo"
              style={{ width: '110px', height: '110px', objectFit: 'contain', userSelect: 'none' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <div style={{ marginTop: '4px', letterSpacing: '0.05em', fontWeight: 800, fontSize: '14px', lineHeight: 1 }}>
                <span style={{ color: '#111111' }}>ONELITO</span>
                <span style={{ color: '#D61F26', marginLeft: '4px' }}>KOI</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Database Sync Status & Welcome Text */}
      <div style={{ position: 'relative', zIndex: 30, width: '100%', maxWidth: '320px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isComplete ? '#10B981' : '#D61F26',
            }}
            className={isComplete ? '' : 'animate-ping'}
          />
          <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748B', fontWeight: 600 }}>
            DATABASE SYNC ACTIVE
          </span>
        </div>

        <p
          style={{
            fontSize: '15px',
            fontWeight: 700,
            transition: 'all 0.3s ease',
            color: isComplete ? '#D61F26' : '#111111',
            transform: isComplete ? 'scale(1.05)' : 'scale(1)',
          }}
          className="dark:text-neutral-100"
        >
          {isComplete ? 'Selamat datang di ONELITO KOI' : 'Menghubungkan ke Database'}
        </p>

        {/* Progress Bar */}
        <div style={{ marginTop: '16px', position: 'relative', width: '100%', height: '10px', backgroundColor: 'rgba(226, 232, 240, 0.8)', borderRadius: '9999px', overflow: 'hidden', padding: '2px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }} className="dark:bg-neutral-800">
          <div
            style={{
              position: 'relative',
              height: '100%',
              background: 'linear-gradient(to right, #111111, #D61F26, #D61F26)',
              borderRadius: '9999px',
              transition: 'width 0.2s ease-out',
              width: `${clampedProgress}%`,
              overflow: 'hidden',
            }}
          >
            <div className="koi-shimmer" style={{ position: 'absolute', inset: 0, width: '50%', height: '100%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)' }} />
          </div>
        </div>

        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#D61F26', fontSize: '14px' }}>
            {clampedProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}
