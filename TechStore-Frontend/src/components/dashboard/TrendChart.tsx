import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TrendData {
  date: string;
  sales: number;
  revenue: number;
  products: number;
  customers: number;
}

interface TrendChartProps {
  data: TrendData[];
  title?: string;
  height?: number;
  showControls?: boolean;
  isLoading?: boolean;
}

interface TooltipPayloadItem {
  value?: number;
  name?: string;
}

interface CustomTrendTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  isRevenue: boolean;
}

const CustomTrendTooltip: React.FC<CustomTrendTooltipProps> = ({
  active,
  payload,
  label,
  isRevenue,
}) => {
  if (active && payload && payload.length) {
    const val = Number(payload[0]?.value || 0);
    return (
      <div className="bg-[#0b1329]/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
        <p className="text-slate-400 font-medium mb-1">{label}</p>
        <p className="font-bold text-cyan-300 font-mono">
          {isRevenue
            ? `S/ ${val.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
            : `${val} pedidos`}
        </p>
      </div>
    );
  }
  return null;
};

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  height = 240,
  isLoading = false,
}) => {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");
  const [metric, setMetric] = useState<"sales" | "revenue">("revenue");

  const isRevenue = metric === "revenue";
  const primaryColor = isRevenue ? "#06b6d4" : "#818cf8";

  if (isLoading || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-slate-500 text-xs font-medium"
      >
        No hay datos de tendencias disponibles
      </div>
    );
  }

  // Formateador limpio para el eje vertical
  const formatYAxis = (val: number) => {
    if (!isRevenue) return val.toString();
    if (val >= 1000) return `S/ ${(val / 1000).toFixed(0)}k`;
    return `S/ ${val}`;
  };

  return (
    <div className="w-full flex flex-col justify-between">
      {/* Controles de Vista */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
          {(["line", "area", "bar"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setChartType(type)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md capitalize transition cursor-pointer ${
                chartType === type
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {type === "line" ? "Línea" : type === "area" ? "Área" : "Barras"}
            </button>
          ))}
        </div>

        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as "sales" | "revenue")}
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="revenue" className="bg-slate-900 text-white">
            Ingresos (S/.)
          </option>
          <option value="sales" className="bg-slate-900 text-white">
            Ventas
          </option>
        </select>
      </div>

      {/* Gráfico Recharts con ComposedChart */}
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />
            <YAxis
              width={55}
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTrendTooltip isRevenue={isRevenue} />} />

            {chartType === "area" && (
              <Area
                type="monotone"
                dataKey={metric}
                stroke={primaryColor}
                strokeWidth={2}
                fill="url(#trendGradient)"
              />
            )}

            {chartType === "bar" && (
              <Bar
                dataKey={metric}
                fill={primaryColor}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            )}

            {chartType === "line" && (
              <Line
                type="monotone"
                dataKey={metric}
                stroke={primaryColor}
                strokeWidth={2}
                dot={{ r: 3, fill: primaryColor }}
                activeDot={{ r: 5 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
