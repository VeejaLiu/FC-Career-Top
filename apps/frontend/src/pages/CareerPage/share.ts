import type { Summary } from '../../service/CareerApis';
import { careerCopy } from './copy';
export function growthCard(
  data: Summary,
  periodLabel: string,
  playerId?: number,
): string {
  const t = careerCopy(),
    canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('Canvas unavailable');
  c.fillStyle = '#101d2e';
  c.fillRect(0, 0, 1200, 900);
  c.fillStyle = '#9de8bd';
  c.font = 'bold 26px sans-serif';
  c.fillText('FC CAREER TOP', 70, 85);
  const line = (
    text: string,
    y: number,
    size: number,
    color = '#ffffff',
    width = 1050,
  ) => {
    c.fillStyle = color;
    c.font = `bold ${size}px sans-serif`;
    let value = text;
    while (c.measureText(value).width > width && value.length > 1)
      value = value.slice(0, -2);
    c.fillText(value + (value !== text ? '…' : ''), 70, y);
  };
  line(data.career.name, 155, 46);
  line(`${periodLabel} · ${data.end || '—'}`, 205, 24, '#b4c5d5');
  const players = data.players
    .filter((p) => !p.archived && p.overallChange != null)
    .sort((a, b) => (b.overallChange ?? 0) - (a.overallChange ?? 0))
    .slice(0, 5);
  const focus = data.players.find(
    (p) => p.playerID === playerId && !p.archived && p.overallChange != null,
  );
  if (focus) {
    line(focus.playerName, 335, 60);
    line(
      `${t.overall} ${focus.overallRating}   ${focus.overallChange! >= 0 ? '+' : ''}${focus.overallChange}`,
      460,
      64,
      focus.overallChange! < 0 ? '#ffa0a0' : '#9de8bd',
    );
    line(
      `${t.pot} ${focus.potential}   ${focus.potentialChange == null ? '—' : `${focus.potentialChange >= 0 ? '+' : ''}${focus.potentialChange}`}`,
      555,
      42,
    );
    line(
      `${focus.baselineDate || '—'} → ${focus.observedOn}`,
      675,
      26,
      '#b4c5d5',
    );
  } else
    players.forEach((p, i) => {
      const y = 300 + i * 88;
      line(p.playerName, y, 32, '#ffffff', 560);
      c.textAlign = 'right';
      c.fillStyle = p.overallChange! < 0 ? '#ffa0a0' : '#9de8bd';
      c.font = 'bold 32px sans-serif';
      c.fillText(
        `${t.overall} ${p.overallRating}   ${p.overallChange! >= 0 ? '+' : ''}${p.overallChange}`,
        1120,
        y,
      );
      c.textAlign = 'left';
    });
  line('fccareer.top', 830, 24, '#b4c5d5');
  line(data.career.id === 0 ? t.demoNotice : t.baseline, 865, 16, '#b4c5d5');
  return canvas.toDataURL('image/png');
}
