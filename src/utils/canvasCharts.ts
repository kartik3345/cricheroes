// ==========================================
// Canvas Charts — Pure Drawing Functions
// ==========================================
import type { OverHistoryEntry, FallOfWicket } from '../types/cricket';

interface ChartTheme {
  gridColor: string;
  axisColor: string;
  labelColor: string;
  teamAColor: string;
  teamBColor: string;
}

function getTheme(isLight: boolean): ChartTheme {
  return {
    gridColor: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)',
    axisColor: isLight ? '#4b5563' : '#64748b',
    labelColor: isLight ? '#1f2937' : '#94a3b8',
    teamAColor: '#00f5a0',
    teamBColor: '#fbbf24',
  };
}

const PADDING = { top: 30, right: 30, bottom: 40, left: 50 };

function drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number, axisColor: string): void {
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING.left, PADDING.top);
  ctx.lineTo(PADDING.left, h - PADDING.bottom);
  ctx.lineTo(w - PADDING.right, h - PADDING.bottom);
  ctx.stroke();
}

function plotWormLine(
  ctx: CanvasRenderingContext2D,
  data: number[],
  maxOvers: number,
  maxRuns: number,
  w: number,
  h: number,
  color: string,
  wickets: FallOfWicket[]
): void {
  if (data.length === 0) return;
  const plotW = w - PADDING.left - PADDING.right;
  const plotH = h - PADDING.top - PADDING.bottom;
  const maxBalls = maxOvers * 6;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();

  data.forEach((score, ballIndex) => {
    const fraction = ballIndex / maxBalls;
    const x = PADDING.left + plotW * fraction;
    const y = PADDING.top + plotH * (1 - score / maxRuns);
    if (ballIndex === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw wicket dots
  if (wickets && wickets.length > 0) {
    ctx.fillStyle = '#ef4444';
    wickets.forEach((wkt) => {
      const parts = wkt.overs.split('.');
      const over = parseInt(parts[0], 10);
      const ball = parseInt(parts[1], 10);
      const ballIndex = over * 6 + ball;
      if (ballIndex < data.length) {
        const fraction = ballIndex / maxBalls;
        const x = PADDING.left + plotW * fraction;
        const y = PADDING.top + plotH * (1 - data[ballIndex] / maxRuns);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }
}

function drawLegendInternal(
  ctx: CanvasRenderingContext2D,
  w: number,
  teamAName: string,
  colorA: string,
  teamBName: string,
  colorB: string,
  textColor: string
): void {
  ctx.font = '10px Inter';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = colorA;
  ctx.fillRect(w - 160, PADDING.top - 15, 12, 6);
  ctx.fillStyle = textColor;
  ctx.fillText(teamAName.substring(0, 10), w - 142, PADDING.top - 12);

  ctx.fillStyle = colorB;
  ctx.fillRect(w - 85, PADDING.top - 15, 12, 6);
  ctx.fillStyle = textColor;
  ctx.fillText(teamBName.substring(0, 10), w - 67, PADDING.top - 12);
}

// ---- Public API ----

export interface WormChartData {
  innings1Cumulative: number[];
  innings2Cumulative: number[];
  innings1Fow: FallOfWicket[];
  innings2Fow: FallOfWicket[];
  maxOvers: number;
  teamAName: string;
  teamBName: string;
  isLight: boolean;
}

export function drawWormChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: WormChartData): void {
  const w = canvas.width;
  const h = canvas.height;
  const theme = getTheme(data.isLight);
  const plotW = w - PADDING.left - PADDING.right;
  const plotH = h - PADDING.top - PADDING.bottom;

  ctx.clearRect(0, 0, w, h);
  drawAxes(ctx, w, h, theme.axisColor);

  // Determine max runs
  let maxRuns = 20;
  const maxD1 = data.innings1Cumulative.length > 0 ? Math.max(...data.innings1Cumulative) : 0;
  const maxD2 = data.innings2Cumulative.length > 0 ? Math.max(...data.innings2Cumulative) : 0;
  maxRuns = Math.max(maxRuns, maxD1, maxD2);
  maxRuns = Math.ceil(maxRuns / 10) * 10;

  // Y axis labels + grid
  ctx.fillStyle = theme.labelColor;
  ctx.font = '10px Inter';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const val = Math.round((maxRuns / yTicks) * i);
    const y = h - PADDING.bottom - (plotH / yTicks) * i;
    ctx.strokeStyle = theme.gridColor;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, y);
    ctx.lineTo(w - PADDING.right, y);
    ctx.stroke();
    ctx.fillText(String(val), PADDING.left - 8, y);
  }

  // X axis labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i <= data.maxOvers; i++) {
    const x = PADDING.left + (plotW / data.maxOvers) * i;
    ctx.strokeStyle = theme.gridColor;
    ctx.beginPath();
    ctx.moveTo(x, PADDING.top);
    ctx.lineTo(x, h - PADDING.bottom);
    ctx.stroke();
    ctx.fillText(String(i), x, h - PADDING.bottom + 8);
  }
  ctx.fillText('Overs', PADDING.left + plotW / 2, h - PADDING.bottom + 24);

  // Plot lines
  plotWormLine(ctx, data.innings1Cumulative, data.maxOvers, maxRuns, w, h, theme.teamAColor, data.innings1Fow);
  if (data.innings2Cumulative.length > 1) {
    plotWormLine(ctx, data.innings2Cumulative, data.maxOvers, maxRuns, w, h, theme.teamBColor, data.innings2Fow);
  }

  drawLegendInternal(ctx, w, data.teamAName, theme.teamAColor, data.teamBName, theme.teamBColor, theme.labelColor);
}

export interface ManhattanChartData {
  innings1OversHistory: OverHistoryEntry[];
  innings2OversHistory: OverHistoryEntry[];
  maxOvers: number;
  teamAName: string;
  teamBName: string;
  isLight: boolean;
}

export function drawManhattanChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: ManhattanChartData): void {
  const w = canvas.width;
  const h = canvas.height;
  const theme = getTheme(data.isLight);
  const plotW = w - PADDING.left - PADDING.right;
  const plotH = h - PADDING.top - PADDING.bottom;

  ctx.clearRect(0, 0, w, h);
  drawAxes(ctx, w, h, theme.axisColor);

  let maxOverRuns = 6;
  data.innings1OversHistory.forEach((o) => { maxOverRuns = Math.max(maxOverRuns, o.runs); });
  data.innings2OversHistory.forEach((o) => { maxOverRuns = Math.max(maxOverRuns, o.runs); });
  maxOverRuns = Math.ceil(maxOverRuns / 4) * 4;

  // Y grid
  ctx.fillStyle = theme.labelColor;
  ctx.font = '10px Inter';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const yTicks = 4;
  for (let i = 0; i <= yTicks; i++) {
    const val = Math.round((maxOverRuns / yTicks) * i);
    const y = h - PADDING.bottom - (plotH / yTicks) * i;
    ctx.strokeStyle = theme.gridColor;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, y);
    ctx.lineTo(w - PADDING.right, y);
    ctx.stroke();
    ctx.fillText(String(val), PADDING.left - 8, y);
  }

  // X ticks
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 1; i <= data.maxOvers; i++) {
    const x = PADDING.left + (plotW / (data.maxOvers + 1)) * i;
    ctx.fillText(String(i), x, h - PADDING.bottom + 8);
  }
  ctx.fillText('Overs', PADDING.left + plotW / 2, h - PADDING.bottom + 24);

  const barGroupWidth = plotW / (data.maxOvers + 1);
  const barWidth = barGroupWidth * 0.35;

  // Team A bars
  data.innings1OversHistory.forEach((over) => {
    const x = PADDING.left + barGroupWidth * over.overNum - barWidth - 2;
    const barH = (over.runs / maxOverRuns) * plotH;
    const y = h - PADDING.bottom - barH;
    ctx.fillStyle = theme.teamAColor;
    ctx.fillRect(x, y, barWidth, barH);
    if (over.wickets > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 9px Inter';
      ctx.fillText(`${over.wickets}w`, x + barWidth / 2, y - 10);
    }
  });

  // Team B bars
  data.innings2OversHistory.forEach((over) => {
    const x = PADDING.left + barGroupWidth * over.overNum + 2;
    const barH = (over.runs / maxOverRuns) * plotH;
    const y = h - PADDING.bottom - barH;
    ctx.fillStyle = theme.teamBColor;
    ctx.fillRect(x, y, barWidth, barH);
    if (over.wickets > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 9px Inter';
      ctx.fillText(`${over.wickets}w`, x + barWidth / 2, y - 10);
    }
  });

  drawLegendInternal(ctx, w, data.teamAName, theme.teamAColor, data.teamBName, theme.teamBColor, theme.labelColor);
}

export interface ChaseGraphData {
  teamBattingFirst: string;
  teamBowlingFirst: string;
  innings: 1 | 2;
  score: number;
  wickets: number;
  balls: number;
  overs: number;
  innings1Score: number;
  innings1Wickets: number;
  innings1Balls: number;
  isLight: boolean;
  getOversString: (b: number) => string;
}

export function drawChaseGraphCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, d: ChaseGraphData): void {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const isLight = d.isLight;
  const labelColor = isLight ? '#1f2937' : '#94a3b8';
  const trackBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)';
  const borderBg = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  const barHeight = 24;
  const yCenterA = h * 0.35;
  const yCenterB = h * 0.65;
  const labelX = 20;
  const barStartX = 140;
  const barMaxWidth = w - barStartX - 50;

  // Team A label
  ctx.fillStyle = labelColor;
  ctx.font = 'bold 11px Inter';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(d.teamBattingFirst.substring(0, 14), labelX, yCenterA);

  // Track background
  ctx.fillStyle = trackBg;
  ctx.strokeStyle = borderBg;
  ctx.lineWidth = 1;
  ctx.fillRect(barStartX, yCenterA - barHeight / 2, barMaxWidth, barHeight);
  ctx.strokeRect(barStartX, yCenterA - barHeight / 2, barMaxWidth, barHeight);

  // Team A progress
  const maxBalls = d.overs * 6;
  const progressA = d.innings === 1 ? d.balls / maxBalls : 1.0;
  const scoreA = d.innings === 1 ? d.score : d.innings1Score;
  const wicketsA = d.innings === 1 ? d.wickets : d.innings1Wickets;
  const oversTextA = d.innings === 1 ? d.getOversString(d.balls) : d.getOversString(d.innings1Balls);
  const barWidthA = barMaxWidth * progressA;

  const gradA = ctx.createLinearGradient(barStartX, 0, barStartX + barWidthA, 0);
  gradA.addColorStop(0, '#00d9f5');
  gradA.addColorStop(1, '#00f5a0');
  ctx.fillStyle = gradA;
  ctx.fillRect(barStartX, yCenterA - barHeight / 2, barWidthA, barHeight);

  ctx.fillStyle = '#050a15';
  ctx.font = 'bold 10px Inter';
  ctx.fillText(`${scoreA}/${wicketsA} (${oversTextA} ov)`, barStartX + 10, yCenterA);

  // Team B label
  ctx.fillStyle = labelColor;
  ctx.font = 'bold 11px Inter';
  ctx.fillText(d.teamBowlingFirst.substring(0, 14), labelX, yCenterB);

  ctx.fillStyle = trackBg;
  ctx.fillRect(barStartX, yCenterB - barHeight / 2, barMaxWidth, barHeight);
  ctx.strokeRect(barStartX, yCenterB - barHeight / 2, barMaxWidth, barHeight);

  if (d.innings === 2) {
    const target = d.innings1Score + 1;
    const runsChased = d.score;
    const progressB = Math.min(1.0, runsChased / target);
    const barWidthB = barMaxWidth * progressB;

    const gradB = ctx.createLinearGradient(barStartX, 0, barStartX + barWidthB, 0);
    gradB.addColorStop(0, '#f97316');
    gradB.addColorStop(1, '#fbbf24');
    ctx.fillStyle = gradB;
    ctx.fillRect(barStartX, yCenterB - barHeight / 2, barWidthB, barHeight);

    ctx.fillStyle = '#050a15';
    ctx.font = 'bold 10px Inter';
    ctx.fillText(`${runsChased}/${d.wickets} (${d.getOversString(d.balls)} ov)`, barStartX + 10, yCenterB);

    // Target line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(barStartX + barMaxWidth, yCenterA - barHeight);
    ctx.lineTo(barStartX + barMaxWidth, yCenterB + barHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 9px Inter';
    ctx.fillText(`Target: ${target}`, barStartX + barMaxWidth - 60, yCenterB + barHeight + 2);
  } else {
    ctx.fillStyle = isLight ? '#6b7280' : '#64748b';
    ctx.font = 'italic 10px Inter';
    ctx.fillText('Yet to bat', barStartX + 10, yCenterB);
  }
}
