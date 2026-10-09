import { LocaleConsumer } from '@douyinfe/semi-ui';
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PlayerTrend } from '../service/PlayerApis';
import { getColorByOverallRating } from '../common/player-helper';

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
  return (
    <LocaleConsumer componentName="PlayerListTable">
      {(locale: any, localeCode: string) => {
        const dateFormatter = new Intl.DateTimeFormat(
          localeCode.replace('_', '-'),
          { month: 'short', day: 'numeric' },
        );
        const formatDate = (date: string) => {
          const [year, month, day] = date.split('-').map(Number);
          return year && month && day
            ? dateFormatter.format(new Date(year, month - 1, day))
            : date;
        };
        return (
          <div
            className="player-trend-chart"
            style={{ width: '100%', minWidth: 0, height }}
            role="img"
            aria-label={`${locale.overall} / ${locale.potential}`}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={data}
                margin={{ left: -20, right: 12, top: 8 }}
                accessibilityLayer
              >
                {detailed && <CartesianGrid vertical={false} />}
                <XAxis
                  dataKey="inGameDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                  minTickGap={28}
                  style={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[detailed ? 40 : 50, 100]}
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0].payload as PlayerTrend;
                    return (
                      <div
                        style={{
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 12,
                        }}
                      >
                        <strong>{point.inGameDate}</strong>
                        <p
                          style={{
                            color: getColorByOverallRating(point.overallRating),
                          }}
                        >
                          {locale.overall}: {point.overallRating}
                        </p>
                        <p
                          style={{
                            color: getColorByOverallRating(point.potential),
                          }}
                        >
                          {locale.potential}: {point.potential}
                        </p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="linear"
                  dataKey="potential"
                  fill="#125427"
                  stroke="#125427"
                  fillOpacity={0.4}
                  isAnimationActive={false}
                />
                <Area
                  type="linear"
                  dataKey="overallRating"
                  fill="#5d7e2f"
                  stroke="none"
                  fillOpacity={0.8}
                  isAnimationActive={false}
                />
                {data.length > 1 && (
                  <Brush
                    dataKey="inGameDate"
                    height={28}
                    stroke="#82ca9d"
                    tickFormatter={formatDate}
                    startIndex={Math.max(data.length - 52, 0)}
                    endIndex={data.length - 1}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      }}
    </LocaleConsumer>
  );
}
