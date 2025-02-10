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
                        stroke="#888888"
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        width={40}
                    />
                    <Tooltip
                        contentStyle={{
                            fontSize: '16px',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                    />
                    <Bar
                        dataKey="count"
                        fill="#8b2455"
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
} 