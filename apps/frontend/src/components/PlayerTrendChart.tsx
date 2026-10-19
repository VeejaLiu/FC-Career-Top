import { LocaleConsumer } from '@douyinfe/semi-ui';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PlayerTrend } from '../service/PlayerApis';
import { trendPoints } from './trend-data';
import './PlayerTrendChart.css';
import { careerCopy } from '../pages/CareerPage/copy';

interface ChartProps {
  data: PlayerTrend[];
  height?: number;
  detailed?: boolean;
}
export function PlayerTrendChart({
  data,
  height = 190,
  detailed = false,
}: ChartProps) {
  const labels = careerCopy();
  const points = trendPoints(data);
  const last = points[points.length - 1];
  const first = points[0];
  const values = points
    .flatMap((p) => [p.overallRating, p.potential])
    .filter(Number.isFinite);
  const floor = values.length
    ? Math.max(0, Math.floor((Math.min(...values) - 5) / 5) * 5)
    : 40;
  return (
    <LocaleConsumer componentName="PlayerListTable">
      {(_locale: any, localeCode: string) => {
        const dates = new Intl.DateTimeFormat(localeCode.replace('_', '-'), {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        });
        return (
          <div
            className="player-trend-chart"
            role="img"
            aria-label={`${labels.overall} / ${labels.pot}`}
          >
            <div
              className={`trend-legend ${detailed ? 'trend-legend-detailed' : ''}`}
            >
              {(
                [
                  ['overallRating', labels.overall, 'overall'],
                  ['potential', labels.pot, 'potential'],
                ] as const
              ).map(([key, label, color]) => {
                const change = last && first ? last[key] - first[key] : null;
                return (
                  <span className={`trend-series trend-${color}`} key={key}>
                    <i aria-hidden="true" /> <span>{label}</span>
                    <strong>{last?.[key] ?? '—'}</strong>
                    {detailed &&
                      change != null &&
                      change !== 0 &&
                      points.length > 1 && (
                        <small>
                          {change >= 0 ? '+' : ''}
                          {change}
                        </small>
                      )}
                  </span>
                );
              })}
            </div>
            <div style={{ width: '100%', minWidth: 0, height }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart
                  data={points}
                  margin={{ left: -22, right: 14, top: 14, bottom: 4 }}
                  accessibilityLayer
                >
                  <CartesianGrid vertical={false} stroke="#e7ede9" />
                  <XAxis
                    dataKey="time"
                    type="number"
                    scale="time"
                    domain={['dataMin', 'dataMax']}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(time) => dates.format(new Date(time))}
                    minTickGap={36}
                    style={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[floor, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickCount={4}
                    style={{ fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0].payload as PlayerTrend;
                      return (
                        <div className="trend-tooltip">
                          <strong>{point.inGameDate}</strong>
                          <p className="trend-overall">
                            {labels.overall}
                            <b>{point.overallRating}</b>
                          </p>
                          <p className="trend-potential">
                            {labels.pot}
                            <b>{point.potential}</b>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="linear"
                    dataKey="potential"
                    stroke="#8264b5"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={
                      points.length < 12
                        ? { r: 3, strokeWidth: 0, fill: '#8264b5' }
                        : false
                    }
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="linear"
                    dataKey="overallRating"
                    stroke="#20824d"
                    strokeWidth={2.5}
                    dot={
                      points.length < 12
                        ? { r: 3, strokeWidth: 0, fill: '#20824d' }
                        : false
                    }
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }}
    </LocaleConsumer>
  );
}
