export const PRODUCTS = [
  {
    id: 'tshirt',
    name: 'Camiseta',
    emoji: '👕',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 175, y: 155, maxW: 150, maxH: 100 },
    textY: 310,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      const { w, h } = { w: 500, h: 500 };

      // Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      ctx.fillStyle = productColor;

      // Body
      ctx.beginPath();
      ctx.moveTo(150, 130);
      ctx.lineTo(100, 110);
      ctx.lineTo(60, 140);
      ctx.lineTo(50, 200);
      ctx.lineTo(90, 210);
      ctx.lineTo(90, 420);
      ctx.lineTo(410, 420);
      ctx.lineTo(410, 210);
      ctx.lineTo(450, 200);
      ctx.lineTo(440, 140);
      ctx.lineTo(400, 110);
      ctx.lineTo(350, 130);
      // Neckline
      ctx.quadraticCurveTo(320, 160, 250, 165);
      ctx.quadraticCurveTo(180, 160, 150, 130);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Subtle fold lines
      ctx.save();
      ctx.strokeStyle = adjustColor(productColor, -15);
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(250, 180);
      ctx.lineTo(250, 390);
      ctx.stroke();
      ctx.restore();

      drawLogoAndText(ctx, logoImg, logoConfig, companyText, 250, 320, productColor);
    }
  },
  {
    id: 'mug',
    name: 'Taza',
    emoji: '☕',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 150, y: 160, maxW: 160, maxH: 100 },
    textY: 290,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      // Mug body
      ctx.fillStyle = productColor;
      ctx.beginPath();
      ctx.moveTo(120, 160);
      ctx.lineTo(140, 360);
      ctx.quadraticCurveTo(250, 390, 360, 360);
      ctx.lineTo(380, 160);
      ctx.quadraticCurveTo(250, 140, 120, 160);
      ctx.fill();

      // Handle
      ctx.strokeStyle = adjustColor(productColor, -20);
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(370, 210);
      ctx.bezierCurveTo(440, 210, 440, 310, 370, 310);
      ctx.stroke();

      ctx.restore();

      // Rim (top ellipse)
      ctx.fillStyle = adjustColor(productColor, 20);
      ctx.beginPath();
      ctx.ellipse(250, 160, 130, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner rim shadow
      ctx.fillStyle = adjustColor(productColor, -30);
      ctx.beginPath();
      ctx.ellipse(250, 160, 110, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      drawLogoAndText(ctx, logoImg, logoConfig, companyText, 250, 295, productColor);
    }
  },
  {
    id: 'cap',
    name: 'Gorra',
    emoji: '🧢',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 180, y: 150, maxW: 140, maxH: 80 },
    textY: 270,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      ctx.fillStyle = productColor;

      // Crown
      ctx.beginPath();
      ctx.moveTo(130, 270);
      ctx.quadraticCurveTo(130, 130, 250, 100);
      ctx.quadraticCurveTo(370, 130, 370, 270);
      ctx.quadraticCurveTo(310, 290, 250, 290);
      ctx.quadraticCurveTo(190, 290, 130, 270);
      ctx.fill();

      // Brim
      ctx.beginPath();
      ctx.ellipse(250, 280, 130, 30, 0, 0, Math.PI);
      ctx.fill();

      ctx.restore();

      // Brim underside
      ctx.fillStyle = adjustColor(productColor, -25);
      ctx.beginPath();
      ctx.ellipse(250, 280, 130, 30, 0, 0, Math.PI);
      ctx.fill();

      // Sweatband line
      ctx.strokeStyle = adjustColor(productColor, -20);
      ctx.lineWidth = 6;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(140, 268);
      ctx.quadraticCurveTo(250, 285, 360, 268);
      ctx.stroke();
      ctx.globalAlpha = 1;

      drawLogoAndText(ctx, logoImg, logoConfig, companyText, 250, 200, productColor);
    }
  },
  {
    id: 'tote',
    name: 'Tote Bag',
    emoji: '👜',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 155, y: 200, maxW: 190, maxH: 120 },
    textY: 360,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      ctx.fillStyle = productColor;

      // Bag body
      ctx.beginPath();
      ctx.moveTo(130, 170);
      ctx.lineTo(110, 420);
      ctx.quadraticCurveTo(250, 445, 390, 420);
      ctx.lineTo(370, 170);
      ctx.quadraticCurveTo(250, 155, 130, 170);
      ctx.fill();

      ctx.restore();

      // Handles
      ctx.strokeStyle = adjustColor(productColor, -30);
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(185, 170);
      ctx.bezierCurveTo(180, 90, 230, 75, 250, 75);
      ctx.bezierCurveTo(270, 75, 320, 90, 315, 170);
      ctx.stroke();

      // Top fold
      ctx.fillStyle = adjustColor(productColor, 15);
      ctx.beginPath();
      ctx.moveTo(130, 170);
      ctx.quadraticCurveTo(250, 155, 370, 170);
      ctx.quadraticCurveTo(250, 195, 130, 170);
      ctx.fill();

      drawLogoAndText(ctx, logoImg, logoConfig, companyText, 250, 365, productColor);
    }
  },
  {
    id: 'pen',
    name: 'Bolígrafo',
    emoji: '🖊️',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 200, y: 160, maxW: 100, maxH: 60 },
    textY: 390,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 8;

      // Pen body (rotated)
      ctx.translate(250, 250);
      ctx.rotate(-Math.PI / 2);

      ctx.fillStyle = productColor;
      ctx.beginPath();
      ctx.roundRect(-170, -15, 300, 30, 5);
      ctx.fill();

      // Clip
      ctx.fillStyle = adjustColor(productColor, -30);
      ctx.beginPath();
      ctx.roundRect(90, -18, 12, 100, 3);
      ctx.fill();

      // Top cap
      ctx.fillStyle = adjustColor(productColor, -20);
      ctx.beginPath();
      ctx.roundRect(130, -15, 50, 30, [5, 15, 15, 5]);
      ctx.fill();

      // Tip
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.moveTo(-170, -8);
      ctx.lineTo(-170, 8);
      ctx.lineTo(-195, 0);
      ctx.closePath();
      ctx.fill();

      // Shine
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.roundRect(-165, -12, 290, 10, 3);
      ctx.fill();

      ctx.restore();

      // Company text below pen
      if (companyText) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Segoe UI, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(companyText, 250, 390);
      }
      // Logo (small, centered on pen body area)
      if (logoImg) {
        const scale = logoConfig.scale || 0.5;
        const lw = 80 * scale;
        const lh = 40 * scale;
        ctx.save();
        ctx.globalAlpha = logoConfig.opacity || 1;
        ctx.drawImage(logoImg, 250 - lw / 2, 240 - lh / 2, lw, lh);
        ctx.restore();
      }
    }
  },
  {
    id: 'notebook',
    name: 'Libreta',
    emoji: '📓',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 155, y: 170, maxW: 190, maxH: 130 },
    textY: 345,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      // Back slightly visible (3D effect)
      ctx.fillStyle = adjustColor(productColor, -30);
      ctx.beginPath();
      ctx.roundRect(148, 108, 210, 290, 8);
      ctx.fill();

      // Cover
      ctx.fillStyle = productColor;
      ctx.beginPath();
      ctx.roundRect(140, 100, 210, 290, 8);
      ctx.fill();

      ctx.restore();

      // Spine
      ctx.fillStyle = adjustColor(productColor, -20);
      ctx.beginPath();
      ctx.roundRect(140, 100, 22, 290, [8, 0, 0, 8]);
      ctx.fill();

      // Spiral rings
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      for (let y = 130; y < 380; y += 20) {
        ctx.beginPath();
        ctx.arc(151, y, 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Lines on cover
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      for (let y = 175; y < 360; y += 15) {
        ctx.beginPath();
        ctx.moveTo(175, y);
        ctx.lineTo(330, y);
        ctx.stroke();
      }

      drawLogoAndText(ctx, logoImg, logoConfig, companyText, 232, 348, productColor);
    }
  },
  {
    id: 'hoodie',
    name: 'Sudadera',
    emoji: '🧥',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 180, y: 175, maxW: 140, maxH: 90 },
    textY: 320,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      ctx.fillStyle = productColor;

      // Body
      ctx.beginPath();
      ctx.moveTo(145, 145);
      ctx.lineTo(90, 125);
      ctx.lineTo(55, 165);
      ctx.lineTo(60, 220);
      ctx.lineTo(95, 225);
      ctx.lineTo(100, 430);
      ctx.lineTo(400, 430);
      ctx.lineTo(405, 225);
      ctx.lineTo(440, 220);
      ctx.lineTo(445, 165);
      ctx.lineTo(410, 125);
      ctx.lineTo(355, 145);
      // Hood curve
      ctx.quadraticCurveTo(330, 110, 290, 100);
      ctx.quadraticCurveTo(250, 90, 210, 100);
      ctx.quadraticCurveTo(170, 110, 145, 145);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Hood inner
      ctx.fillStyle = adjustColor(productColor, -20);
      ctx.beginPath();
      ctx.moveTo(210, 100);
      ctx.quadraticCurveTo(250, 90, 290, 100);
      ctx.quadraticCurveTo(310, 120, 305, 145);
      ctx.quadraticCurveTo(280, 155, 250, 157);
      ctx.quadraticCurveTo(220, 155, 195, 145);
      ctx.quadraticCurveTo(190, 120, 210, 100);
      ctx.fill();

      // Zipper
      ctx.strokeStyle = adjustColor(productColor, -25);
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(250, 157);
      ctx.lineTo(250, 430);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pocket
      ctx.strokeStyle = adjustColor(productColor, -20);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(180, 340);
      ctx.lineTo(180, 395);
      ctx.quadraticCurveTo(250, 410, 320, 395);
      ctx.lineTo(320, 340);
      ctx.stroke();

      drawLogoAndText(ctx, logoImg, logoConfig, companyText, 250, 325, productColor);
    }
  },
  {
    id: 'usb',
    name: 'USB',
    emoji: '💾',
    canvasWidth: 500,
    canvasHeight: 500,
    logoArea: { x: 165, y: 195, maxW: 170, maxH: 80 },
    textY: 330,
    draw: (ctx, productColor, logoImg, logoConfig, companyText) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      // USB body
      ctx.fillStyle = productColor;
      ctx.beginPath();
      ctx.roundRect(130, 170, 240, 130, 12);
      ctx.fill();

      ctx.restore();

      // USB connector
      ctx.fillStyle = '#b0b8c0';
      ctx.beginPath();
      ctx.roundRect(340, 200, 55, 70, [0, 6, 6, 0]);
      ctx.fill();

      ctx.fillStyle = '#8a9099';
      ctx.beginPath();
      ctx.rect(350, 215, 35, 40);
      ctx.fill();

      // Connector pins
      ctx.fillStyle = '#c8d0d8';
      ctx.beginPath();
      ctx.rect(352, 218, 14, 8);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(352, 232, 14, 8);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(370, 218, 14, 8);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(370, 232, 14, 8);
      ctx.fill();

      // Keyring hole
      ctx.strokeStyle = adjustColor(productColor, -30);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(163, 235, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Shine
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.roundRect(135, 175, 230, 30, 8);
      ctx.fill();

      drawLogoAndText(ctx, logoImg, logoConfig, companyText, 230, 340, productColor);
    }
  }
];

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

function drawLogoAndText(ctx, logoImg, logoConfig, companyText, cx, textY, productColor) {
  if (logoImg) {
    const scale = logoConfig.scale || 1;
    const opacity = logoConfig.opacity !== undefined ? logoConfig.opacity : 1;
    const offsetX = logoConfig.offsetX || 0;
    const offsetY = logoConfig.offsetY || 0;

    const maxW = 140 * scale;
    const maxH = 90 * scale;
    let lw = logoImg.width;
    let lh = logoImg.height;
    const ratio = Math.min(maxW / lw, maxH / lh);
    lw *= ratio;
    lh *= ratio;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(logoImg, cx - lw / 2 + offsetX, textY - 90 - lh / 2 + offsetY, lw, lh);
    ctx.restore();
  }

  if (companyText) {
    ctx.save();
    // Determine text color based on background lightness
    const r = parseInt(productColor.slice(1, 3), 16);
    const g = parseInt(productColor.slice(3, 5), 16);
    const b = parseInt(productColor.slice(5, 7), 16);
    const lightness = (r * 299 + g * 587 + b * 114) / 1000;
    ctx.fillStyle = lightness > 140 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 15px Segoe UI, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText(companyText.toUpperCase(), cx, textY);
    ctx.restore();
  }
}

export const COLORS = [
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Negro', hex: '#1a1a1a' },
  { name: 'Rojo', hex: '#e94560' },
  { name: 'Azul Navy', hex: '#0f3460' },
  { name: 'Azul Cielo', hex: '#4a90d9' },
  { name: 'Verde', hex: '#2ecc71' },
  { name: 'Amarillo', hex: '#f1c40f' },
  { name: 'Naranja', hex: '#e67e22' },
  { name: 'Morado', hex: '#9b59b6' },
  { name: 'Rosa', hex: '#fd79a8' },
  { name: 'Gris', hex: '#95a5a6' },
  { name: 'Caqui', hex: '#c8a97e' },
];
