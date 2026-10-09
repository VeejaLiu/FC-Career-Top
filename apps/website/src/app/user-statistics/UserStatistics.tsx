'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from 'recharts';

const uniqueId = 'daily-new-users-count-chart';
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
type DailyNewUsers = { date: string; count: number };
type ChartShapeProps = {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};
type ChartLabelProps = {
  x?: number;
  y?: number;
  width?: number;
  value?: number | string;
};
type ChartTooltipProps = {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: number | string;
};

function UserStatisticsPage() {
  const [data, setData] = useState<DailyNewUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUserCount, setTotalUserCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal, timeout: 10000 };
    Promise.all([
      axios.get<DailyNewUsers[]>(
        `${apiUrl}/api/v1/public/daily-new-users-count?pastDays=90`,
        options
      ),
      axios.get<{ count: number }>(
        `${apiUrl}/api/v1/public/users-count`,
        options
      ),
    ])
      .then(([daily, total]) => {
        const formattedData = [...daily.data]
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((item) => {
            const date = new Date(item.date);
            const formattedDate = `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}`;
            return {
              ...item,
              date: formattedDate,
            };
          });
        setData(formattedData);
        setTotalUserCount(total.data.count);
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setFailed(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function CustomBar(props: ChartShapeProps) {
    const { fill, x = 0, y = 0, width = 0, height = 0 } = props;

    if (height === 0) {
      return null;
    }
    const radius = width / 2;
    const d = `M${x},${y + height} L${x},${y + radius} A${radius},${radius} 0 0 1 ${x + width},${y + radius} L${x + width},${y + height} Z`;
    return (
      <path
        d={d}
        stroke="none"
        fill={fill}
        clipPath={`url(#${uniqueId}-clip)`}
      />
    );
  }

  function CustomLabel(props: ChartLabelProps) {
    const { x = 0, y = 0, width = 0, value } = props;
    if (value === 0) {
      return null;
    }
    return (
      <text x={x + width / 2} y={y - 10} fill="#999" textAnchor="middle">
        {value}
      </text>
    );
  }

  function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="text-sm font-semibold text-black">{`Date: ${label}`}</p>
          <p className="text-sm text-black">{`New Users: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  }

  if (failed) {
    return (
      <p role="status">
        User statistics are temporarily unavailable. Please try again later.
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        New User Registrations (Last 90 Days)
      </h2>
      {loading ? (
        <p role="status">Loading user statistics...</p>
      ) : (
        <div className="p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <defs>
                <linearGradient
                  id="abc-bar-gradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#00ddee" />
                  <stop offset="100%" stopColor="#5dc1fb" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: '#5dc1fb' }}
                tick={{ fill: '#999' }}
              />
              <YAxis
                domain={[0, 'dataMax + 5']}
                tickLine={false}
                axisLine={false}
              />
              <Bar
                dataKey="count"
                fill="url(#abc-bar-gradient)"
                barSize={32}
                shape={<CustomBar />}
                label={<CustomLabel />}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
              <Tooltip content={<CustomTooltip />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Total registrations */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Total Registrations (all time)</h2>
        <p className="text-3xl font-bold">{totalUserCount ?? 'Loading...'}</p>
      </div>
    </div>
  );
}

export default UserStatisticsPage;
