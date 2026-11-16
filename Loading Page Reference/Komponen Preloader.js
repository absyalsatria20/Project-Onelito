// src/components/OnelitoPreloader.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function OnelitoPreloader({
  progress = 0,
  isLoaded = false,
  logoSrc = '/logo-vertical.png',
  onFinish,
}) {
  const canvasRef = useRef(null);
  const medallionRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const isComplete = isLoaded || clampedProgress >= 100;

  // Transisi keluar halus saat loading mencapai 100% / selesai
  useEffect(() => {
    if (isComplete) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 900); // Tampilkan "Selamat datang di ONELITO KOI" sejenak

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

  // Simulasi Full-Screen Canvas: Koi + Teratai + Kelopak Sakura + Riak Air
  useEffect(() => {
    if (shouldUnmount) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let baseOrbitRadius = 135;

    const ripples = [];
    const bubbles = [];

    // Profil lebar setengah badan ikan Koi (14 segmen tulang belakang)
    const bodyWidthProfile = [
      7.5, 13.5, 16.5, 16.2, 14.8, 13.0, 11.0,
      9.0, 7.2, 5.6, 4.3, 3.3, 2.5, 1.8
    ];

    // Data Daun & Bunga Teratai di sekitar orbit ikan
    const lotusPads = [
      { angle: 0.45, distOffset: 44, r: 26, rot: 0.4, hasFlower: true, flowerColor: '#F472B6' },
      { angle: 2.35, distOffset: -42, r: 20, rot: 2.1, hasFlower: false },
      { angle: 3.75, distOffset: 48, r: 28, rot: 3.8, hasFlower: true, flowerColor: '#FB7185' },
      { angle: 5.35, distOffset: 38, r: 22, rot: 5.1, hasFlower: false },
    ];

    // Data Kelopak Bunga Sakura mengapung di seluruh layar
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
      constructor(config) {
        this.angle = config.startAngle || 0;
        this.speed = config.speed || 0.0072; // Gerakan lambat & tenang (Zen)
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

      update(time) {
        this.phase += 0.075; // Ayunan ekor tenang
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

      draw(ctx, isDark) {
        const leftPts = [];
        const rightPts = [];

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

        // 1. Sirip Dada & Perut
        this.drawPairedFins(ctx, 2, 22, 11, 0.55);
        this.drawPairedFins(ctx, 6, 13, 6.5, 0.45);

        // 2. Sirip Ekor
        this.drawCaudalTail(ctx);

        // 3. Path2D Kontur Tubuh Utama (Mencegah bug corak bulatan bocor keluar badan)
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

        ctx.fillStyle = this.variant === 'showa' ? '#FFFFFF' : '#141416';
        ctx.fill(bodyPath);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 4. Corak Badan Terkunci di Dalam Path2D Clip
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
          ctx.beginPath();
          ctx.arc(this.joints[0].x, this.joints[0].y, 6.8, 0, Math.PI * 2);
          ctx.fillStyle = '#D61F26';
          ctx.fill();
        }
        ctx.restore();

        // Garis tepi badan menggunakan bodyPath
        ctx.strokeStyle =
          this.variant === 'showa'
            ? isDark
              ? 'rgba(255,255,255,0.25)'
              : 'rgba(17,17,17,0.3)'
            : isDark
            ? 'rgba(255,255,255,0.4)'
            : 'rgba(17,17,17,0.65)';
        ctx.lineWidth = 1.2;
        ctx.stroke(bodyPath);

        // 5. Sirip Punggung & Detail Kepala
        this.drawDorsalFin(ctx);
        this.drawHeadDetails(ctx, snoutX, snoutY);

        ctx.restore();
      }

      drawPairedFins(ctx, jointIndex, length, widthFin, baseSpread) {
        const j = this.joints[jointIndex];
        const bodyW = bodyWidthProfile[jointIndex] * 0.72;
        const paddleSwing = Math.sin(this.phase - jointIndex * 0.3) * 0.12;

        [-1, 1].forEach((side) => {
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

      drawCaudalTail(ctx) {
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

      drawBodyPatch(ctx, startIdx, sideOffset, radius, color) {
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

      drawDorsalFin(ctx) {
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

      drawHeadDetails(ctx, snoutX, snoutY) {
        const head = this.joints[0];
        const neck = this.joints[1];
        const angle = head.angle;
        const perp = angle + Math.PI / 2;

        [-1, 1].forEach((side) => {
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
        [-1, 1].forEach((side) => {
          const ex = head.x * 0.55 + neck.x * 0.45 + Math.cos(perp) * (side * eyeDist);
          const ey = head.y * 0.55 + neck.y * 0.45 + Math.sin(perp) * (side * eyeDist);
          ctx.beginPath();
          ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = this.variant === 'showa' ? '#111111' : '#FFFFFF';
          ctx.fill();
        });
      }
    }

    const koiList = [
      new ProceduralKoi({ startAngle: 0, speed: 0.0072, variant: 'showa', phase: 0 }),
      new ProceduralKoi({ startAngle: Math.PI, speed: 0.0072, variant: 'tancho', phase: Math.PI }),
    ];

    function updateCenterFromMedallion() {
      if (medallionRef.current) {
        const rect = medallionRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        baseOrbitRadius = Math.max(125, rect.width * 0.78);
      } else {
        centerX = width / 2;
        centerY = height / 2;
      }
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateCenterFromMedallion();
    }

    function drawLotusPadAndFlower(ctx, pad, time, isDark) {
      const floatBob = Math.sin(time * 0.0014 + pad.angle) * 2.5;
      const dist = baseOrbitRadius + pad.distOffset + floatBob;
      const lx = centerX + Math.cos(pad.angle) * dist;
      const ly = centerY + Math.sin(pad.angle) * dist;
      const currentRot = pad.rot + Math.sin(time * 0.0009 + pad.angle) * 0.06;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(currentRot);

      // Bayangan daun teratai
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(17,17,17,0.12)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      // Daun Teratai dengan celah V (Notch)
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

      // Urat daun teratai
      for (let i = 0; i < 7; i++) {
        const vAngle = 0.5 + i * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(vAngle) * (pad.r * 0.78), Math.sin(vAngle) * (pad.r * 0.78));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Bunga Teratai Mekar di atas daun
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
        // Putik kuning tengah bunga teratai
        ctx.beginPath();
        ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FACC15';
        ctx.fill();
      }

      ctx.restore();
    }

    function drawSakuraPetal(ctx, petal, time) {
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
      ctx.lineTo(0, -s * 0.62); // Lekukan khas ujung kelopak sakura
      ctx.lineTo(s * 0.18, -s * 0.9);
      ctx.bezierCurveTo(s * 0.7, -s * 0.8, s * 0.8, s * 0.1, 0, s * 0.6);
      ctx.closePath();

      ctx.fillStyle = '#FDA4AF';
      ctx.fill();
      ctx.restore();
    }

    const handlePointerMove = (e) => {
      if (Math.random() < 0.28) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 3,
          maxR: 38 + Math.random() * 24,
          alpha: 0.32,
          color: '#D61F26',
        });
      }
    };

    const handlePointerDown = (e) => {
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
      if (ripples.length < 6) {
        const targetKoi = koiList[Math.floor(Math.random() * koiList.length)];
        const head = targetKoi.joints[0];
        ripples.push({
          x: head.x,
          y: head.y,
          r: 6,
          maxR: 45 + Math.random() * 20,
          alpha: 0.24,
          color: Math.random() > 0.5 ? '#D61F26' : '#888888',
        });
      }
    }, 1100);

    function renderLoop(timestamp) {
      const time = timestamp || performance.now();
      ctx.clearRect(0, 0, width, height);
      updateCenterFromMedallion();
      const isDark = document.documentElement.classList.contains('dark');

      // Garis orbit putus-putus lembut
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseOrbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(17, 17, 17, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 9]);
      ctx.stroke();
      ctx.restore();

      // Riak air (Water Ripples) di seluruh layar
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

      // Gelembung jejak renang ikan
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

      // Update & Gambar Ikan Koi
      for (let i = 0; i < koiList.length; i++) {
        koiList[i].update(time);
        koiList[i].draw(ctx, isDark);
      }

      // Gambar Daun & Bunga Teratai
      for (let i = 0; i < lotusPads.length; i++) {
        drawLotusPadAndFlower(ctx, lotusPads[i], time, isDark);
      }

      // Gambar Kelopak Sakura
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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-[#0B0C0E]/95 backdrop-blur-md transition-all duration-700 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Full-Screen Interactive Koi Pond Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen z-20 pointer-events-none"
      />

      {/* Ambient Radial Glow */}
      <div className="absolute w-[460px] h-[460px] rounded-full bg-koi-red/5 dark:bg-koi-red/10 blur-3xl pointer-events-none" />

      {/* Central Pond Medallion Anchor */}
      <div className="relative flex items-center justify-center w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] mb-2">
        <div className="animate-ripple-1 absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-koi-red/25 dark:border-koi-red/35 pointer-events-none" />
        <div className="animate-ripple-2 absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-koi-black/15 dark:border-white/15 pointer-events-none" />
        <div className="animate-ripple-3 absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-koi-red/20 dark:border-koi-red/25 pointer-events-none" />

        {/* Medallion Logo */}
        <div
          ref={medallionRef}
          className="animate-logo-float relative z-10 flex flex-col items-center justify-center w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-white/95 dark:bg-[#141619]/95 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.09)] dark:shadow-[0_14px_45px_rgba(214,31,38,0.18)] border border-neutral-200/80 dark:border-neutral-800 p-4"
        >
          {!imgError ? (
            <img
              src={logoSrc}
              alt="ONELITO KOI Logo"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain select-none"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="mt-1 tracking-wider font-extrabold text-[13px] sm:text-[14px] leading-none">
                <span className="text-koi-black dark:text-white">ONELITO</span>
                <span className="text-koi-red ml-1">KOI</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Database Sync Status & Welcome Text */}
      <div className="relative z-30 w-full max-w-xs sm:max-w-sm px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isComplete ? 'bg-emerald-500' : 'bg-koi-red animate-ping'
            }`}
          />
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-semibold">
            DATABASE SYNC ACTIVE
          </span>
        </div>

        <p
          className={`text-sm sm:text-base font-bold transition-all duration-300 ${
            isComplete
              ? 'text-koi-red scale-105'
              : 'text-koi-black dark:text-neutral-100'
          }`}
        >
          {isComplete ? 'Selamat datang di ONELITO KOI' : 'Menghubungkan ke Database'}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 relative w-full h-2.5 bg-neutral-200/80 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="relative h-full bg-gradient-to-r from-koi-black via-koi-red to-koi-red rounded-full transition-all duration-200 ease-out overflow-hidden"
            style={{ width: `${clampedProgress}%` }}
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center">
          <span className="font-mono font-bold text-koi-red text-sm">
            {clampedProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}