import React, { useState } from "react";
import { Tooltip } from "antd";
import { PieChartOutlined, InfoCircleOutlined } from "@ant-design/icons";

interface EnhancedPieChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showDonut?: boolean;
  showLabels?: boolean;
}

const EnhancedPieChart: React.FC<EnhancedPieChartProps> = ({
  title,
  data,
  height = 360,
  showDonut = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const defaultColors = [
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#3b82f6",
  ];

  const { segments } = data.reduce<{
    segments: Array<{
      label: string;
      value: number;
      percentage: number;
      startAngle: number;
      angle: number;
      color: string;
      endAngle: number;
    }>;
    cumulativeAngle: number;
  }>(
    (acc, item, index) => {
      const percentage = total > 0 ? item.value / total : 0;
      const angle = percentage * 360;
      const startAngle = acc.cumulativeAngle;
      const endAngle = startAngle + angle;

      acc.segments.push({
        ...item,
        percentage,
        startAngle,
        angle,
        color: item.color || defaultColors[index % defaultColors.length],
        endAngle,
      });

      acc.cumulativeAngle = endAngle;
      return acc;
    },
    { segments: [], cumulativeAngle: 0 },
  );

  const chartSize = Math.min(height - 80, 240);
  const radius = chartSize / 2;
  const donutRadius = showDonut ? radius * 0.65 : 0;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angleDeg: number,
  ) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (
    startAngle: number,
    endAngle: number,
    inR: number,
    outR: number,
  ) => {
    const start = polarToCartesian(centerX, centerY, outR, endAngle);
    const end = polarToCartesian(centerX, centerY, outR, startAngle);
    const inStart = polarToCartesian(centerX, centerY, inR, endAngle);
    const inEnd = polarToCartesian(centerX, centerY, inR, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      outR,
      outR,
      0,
      largeArc,
      0,
      end.x,
      end.y,
      "L",
      inEnd.x,
      inEnd.y,
      "A",
      inR,
      inR,
      0,
      largeArc,
      1,
      inStart.x,
      inStart.y,
      "Z",
    ].join(" ");
  };

  return (
    <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <PieChartOutlined className="text-emerald-400" /> {title}
        </span>
        <Tooltip title={`Facturación consolidada: S/. ${total.toFixed(2)}`}>
          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1 cursor-pointer">
            S/. {total.toFixed(2)}{" "}
            <InfoCircleOutlined className="text-slate-400" />
          </span>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Gráfico Donut SVG */}
        <div className="md:col-span-5 flex justify-center items-center py-2">
          <svg
            width={chartSize}
            height={chartSize}
            className="overflow-visible"
          >
            {segments.map((segment, index) => {
              const isHovered = hoveredIndex === index;
              const segRadius = isHovered ? radius + 4 : radius;

              return (
                <path
                  key={index}
                  d={describeArc(
                    segment.startAngle,
                    segment.endAngle,
                    donutRadius,
                    segRadius,
                  )}
                  fill={segment.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered
                      ? "drop-shadow(0 0 10px rgba(6,182,212,0.4))"
                      : "none",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}

            {/* Centro oscuro del donut */}
            {showDonut && (
              <circle
                cx={centerX}
                cy={centerY}
                r={donutRadius}
                fill="#0b1329"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
            )}

            {/* Texto central */}
            <text
              x={centerX}
              y={centerY - 6}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider"
            >
              Total PEN
            </text>
            <text
              x={centerX}
              y={centerY + 14}
              textAnchor="middle"
              className="text-xs font-mono font-black fill-emerald-400"
            >
              S/. {total.toFixed(0)}
            </text>
          </svg>
        </div>

        {/* Desglose lateral oscuro */}
        <div className="md:col-span-7 space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Detalles por Categoría
          </span>

          {segments.map((segment, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={index}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? "bg-slate-900 border-cyan-500/50"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-white font-medium">
                      {segment.label}
                    </span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    S/. {segment.value.toFixed(2)}
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${segment.percentage * 100}%`,
                      backgroundColor: segment.color,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>Participación</span>
                  <span>{(segment.percentage * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPieChart;
