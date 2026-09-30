import React from "react";
import { Tooltip } from "antd";
import { InfoCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";

interface TooltipPayloadItem {
  value?: number;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  total: number;
  unit: string;
}

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  total,
  unit,
}) => {
  if (active && payload && payload.length) {
    const val = Number(payload[0]?.value || 0);
    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
    return (
      <div className="bg-[#0b1329]/95 backdrop-blur border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-cyan-300 font-mono font-bold">
          {val} {unit}{" "}
          <span className="text-slate-400 font-normal">({pct}%)</span>
        </p>
      </div>
    );
  }
  return null;
};

interface EnhancedBarChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showTooltip?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  unit?: string;
  compact?: boolean;
}

const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({
  title,
  data,
  height = 320,
  showTooltip = true,
  unit = "unidades",
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const defaultColors = [
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#3b82f6",
  ];

  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  return (
    <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BarChartOutlined className="text-cyan-400" /> {title}
        </span>
        {showTooltip && (
          <Tooltip title={`Total acumulado: ${total.toLocaleString()} ${unit}`}>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1 cursor-pointer hover:text-cyan-400 transition">
              {total} {unit} <InfoCircleOutlined />
            </span>
          </Tooltip>
        )}
      </div>

      {/* Gráfico Recharts */}
      <div style={{ height: height - 110 }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <RechartsTooltip
              content={<CustomBarTooltip total={total} unit={unit} />}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={45}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>
          Mayor rotación:{" "}
          <strong className="text-emerald-400 font-bold">{maxValue} uds</strong>
        </span>
        <span>
          SKUs evaluados: <strong className="text-white">{data.length}</strong>
        </span>
      </div>
    </div>
  );
};

export default EnhancedBarChart;
