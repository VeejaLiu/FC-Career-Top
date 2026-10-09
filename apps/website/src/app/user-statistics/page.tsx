// src/app/user-statistics/page.tsx

'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis, // Add YAxis import
  Cell,
  Tooltip,
} from 'recharts';

const uniqueId = 'daily-new-users-count-chart';
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function UserStatisticsPage() {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUserCount, setTotalUserCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/v1/public/daily-new-users-count?pastDays=90`)
      .then((response) => {
        const sortedData = response.data.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const formattedData = sortedData.map((item: any) => {
          const date = new Date(item.date);
          const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
          return {
            ...item,
            date: formattedDate,
          };
        });
        setData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

    axios
      .get(`${apiUrl}/api/v1/public/users-count`)
      .then((response) => {
        console.log('Total user count:', response.data.count);
        setTotalUserCount(response.data.count);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  function CustomBar(props: any) {
    const { fill, x, y, width, height } = props;

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

  function CustomLabel(props: any) {
    const { x, y, width, value } = props;
    if (value === 0) {
      return null;
    }
    return (
      <text x={x + width / 2} y={y - 10} fill="#999" textAnchor="middle">
        {value}
      </text>
    );
  }

  function CustomTooltip({ active, payload, label }: any) {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        New User Registrations (Last 90 Days)
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-4 rounded shadow">
          <ResponsiveContainer width="100%" height={400} minWidth={300}>
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
              {/* Add YAxis with domain prop */}
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
        <p className="text-3xl font-bold">{totalUserCount}</p>
      </div>
    </div>
  );
}

export default UserStatisticsPage;
