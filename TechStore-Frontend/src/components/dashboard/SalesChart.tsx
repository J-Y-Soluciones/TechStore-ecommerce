import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Sale } from "@/types/api.types";
import dayjs from "dayjs";

interface SalesChartProps {
  sales: Sale[];
}

interface TooltipPayloadItem {
  value?: number;
  name?: string;
  dataKey?: string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomSalesTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs">
        <p className="font-bold text-white mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
          <span>Fecha: {label}</span>
        </p>
        <div className="space-y-1.5">
          <p className="text-slate-300 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
              Ventas:
            </span>
            <strong className="text-white font-mono">
              {payload[0]?.value || 0}
            </strong>
          </p>
          <p className="text-slate-300 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Facturación:
            </span>
            <strong className="text-emerald-400 font-mono">
              S/. {Number(payload[1]?.value || 0).toFixed(2)}
            </strong>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({ sales }) => {
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(dayjs().subtract(i, "day").format("DD/MM"));
    }
    return days;
  };

  const last7Days = getLast7Days();

  const initialData = last7Days.map((date) => ({
    date,
    cantidadVentas: 0,
    totalVentas: 0,
  }));

  const chartData = sales.reduce(
    (acc, sale) => {
      try {
        const saleDate = dayjs(sale.fecha).format("DD/MM");
        const dayIndex = last7Days.findIndex((day) => day === saleDate);
        if (dayIndex !== -1) {
          acc[dayIndex].cantidadVentas += 1;
          acc[dayIndex].totalVentas += sale.total;
        }
      } catch (error) {
        console.error("Error procesando venta:", error);
      }
      return acc;
    },
    [...initialData],
  );

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={{ stroke: "#334155" }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `S/.${v}`}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomSalesTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              paddingBottom: "16px",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="cantidadVentas"
            name="Pedidos"
            fill="#06b6d4"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalVentas"
            name="Monto (S/.)"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#34d399" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
