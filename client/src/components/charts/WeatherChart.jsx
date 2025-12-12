import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl">
                <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value}°C
                </p>
            </div>
        );
    }
    return null;
};

const WeatherChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-[300px] w-full mt-6 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden group">
            {/* Chart Background Overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                        dy={10}
                    />
                    <YAxis
                        hide={true}
                        domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#059669', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#059669"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTemp)"
                        activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeatherChart;
