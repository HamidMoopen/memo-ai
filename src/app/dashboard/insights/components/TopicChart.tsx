'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TopicChartProps {
    data: Array<{ name: string; count: number; }>;
}

export function TopicChart({ data }: TopicChartProps) {
    return (
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#383f51"
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        stroke="#383f51"
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        width={40}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: 'none',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '14px',
                            padding: '12px 16px'
                        }}
                    />
                    <Bar
                        dataKey="count"
                        fill="#3c4f76"
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
} 