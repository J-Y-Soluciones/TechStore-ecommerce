import React, { useState } from "react";
import { Select } from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  AppstoreOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSales } from "@/hooks/useSales";
import QueryBoundary from "@/components/common/QueryBoundary";
import SalesChart from "@/components/dashboard/SalesChart";
import TrendChart from "@/components/dashboard/TrendChart";
import ExportButton from "@/components/common/ExportButton";
import { useAlert } from "@/hooks/useAlert";
import { useRealTrendData } from "@/hooks/useRealTrendData";
import dayjs from "dayjs";

const { Option } = Select;

const exportColumns = [
  { title: "ID", dataIndex: "id" },
  { title: "Cliente", dataIndex: ["cliente", "nombre"] },
  { title: "Fecha", dataIndex: "fecha" },
  { title: "Total", dataIndex: "total" },
  { title: "Método Pago", dataIndex: "metodoPago" },
];

const Dashboard: React.FC = () => {
  const { addAlert } = useAlert();
  const {
    stats,
    recentSales,
    lowStockProducts,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardData();
  const { sales: allSales, isLoading: salesLoading } = useSales();
  const [metricPeriod, setMetricPeriod] = useState<"day" | "week" | "month">(
    "month",
  );

  const trendData = useRealTrendData(allSales, metricPeriod);
  const productosConStockBajo = lowStockProducts.length;

  // Cálculo de tendencias
  const calculateRealTrends = () => {
    if (trendData.length < 2)
      return { sales: 0, revenue: 0, products: 0, customers: 0 };
    const currentPeriod = trendData[trendData.length - 1];
    const previousPeriod = trendData[trendData.length - 2];
    const calc = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

    return {
      sales: calc(currentPeriod.sales, previousPeriod.sales),
      revenue: calc(currentPeriod.revenue, previousPeriod.revenue),
      products: calc(currentPeriod.products, previousPeriod.products),
      customers: calc(currentPeriod.customers, previousPeriod.customers),
    };
  };

  const realTrends = calculateRealTrends();

  // Generador de iniciales para los clientes
  const getInitials = (name?: string) => {
    if (!name) return "CL";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  // Estilo visual del método de pago
  const getPaymentBadge = (method?: string) => {
    const m = (method || "").toLowerCase();
    if (
      m.includes("tarjeta") ||
      m.includes("credito") ||
      m.includes("debito")
    ) {
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    }
    if (
      m.includes("transferencia") ||
      m.includes("bcp") ||
      m.includes("interbank")
    ) {
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 md:p-8 font-sans">
        {/* Cabecera / Topbar Tech */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Telemetría Operativa
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Panel Principal
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Resumen general de operaciones y ventas en tiempo real ·{" "}
              {dayjs().format("DD [de] MMMM [de] YYYY")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={metricPeriod}
              onChange={setMetricPeriod}
              size="middle"
              className="w-32 bg-slate-900 border-slate-700 text-white rounded-lg"
              popupClassName="bg-slate-900 text-slate-200 border border-slate-800"
            >
              <Option value="day">Diario</Option>
              <Option value="week">Semanal</Option>
              <Option value="month">Mensual</Option>
            </Select>

            <ExportButton
              data={recentSales}
              filename={`ventas-${dayjs().format("YYYY-MM-DD")}`}
              columns={exportColumns}
              buttonText="Exportar Reporte"
            />
          </div>
        </div>

        {/* KPIs Principales (Fila Superior) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Ventas Totales */}
          <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-semibold tracking-wider">
                Ventas Totales
              </span>
              <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-400">
                <ShoppingCartOutlined className="text-lg" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {stats.totalSales}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                pedidos
              </span>
            </div>
            <div className="mt-3 flex items-center text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${realTrends.sales >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {realTrends.sales >= 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
                {Math.abs(realTrends.sales).toFixed(1)}%
              </span>
              <span className="text-slate-500 ml-2">vs período anterior</span>
            </div>
          </div>

          {/* Card 2: Ingresos Totales (Destacada con Glow Cyan) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0c2438] via-[#0f172a] to-[#091522] border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.12)]">
            <div className="flex items-center justify-between text-cyan-200/80 mb-3">
              <span className="text-xs uppercase font-semibold tracking-wider">
                Ingresos Totales (PEN)
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <DollarOutlined className="text-lg" />
              </div>
            </div>
            <div className="text-3xl font-black text-cyan-300 tracking-tight">
              S/.{" "}
              {stats.totalRevenue.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${realTrends.revenue >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {realTrends.revenue >= 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
                {Math.abs(realTrends.revenue).toFixed(1)}%
              </span>
              <span className="text-cyan-400/60 font-mono text-[11px]">
                En tiempo real
              </span>
            </div>
          </div>

          {/* Card 3: Productos en Catálogo */}
          <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-semibold tracking-wider">
                Catálogo de Hardware
              </span>
              <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-400">
                <AppstoreOutlined className="text-lg" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {stats.totalProducts}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                SKUs activos
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              {productosConStockBajo > 0 ? (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <WarningOutlined /> {productosConStockBajo} stock bajo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircleOutlined /> Stock óptimo
                </span>
              )}
              <span className="text-slate-500">Total en base</span>
            </div>
          </div>

          {/* Card 4: Clientes */}
          <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs uppercase font-semibold tracking-wider">
                Clientes Activos
              </span>
              <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-400">
                <UserOutlined className="text-lg" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {stats.totalClients || 0}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                compradores
              </span>
            </div>
            <div className="mt-3 flex items-center text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold ${realTrends.customers >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {realTrends.customers >= 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
                {Math.abs(realTrends.customers).toFixed(1)}%
              </span>
              <span className="text-slate-500 ml-2">registrados</span>
            </div>
          </div>
        </div>

        {/* Sección Central de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Gráfico de Ventas de los Últimos 7 Días */}
          <div className="lg:col-span-8 bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Ventas de los Últimos 7 Días
                  </h3>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    En vivo
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comportamiento diario de ingresos y órdenes
                </p>
              </div>
            </div>
            <div className="w-full">
              <SalesChart sales={allSales} />
            </div>
          </div>

          {/* Gráfico de Tendencias / Distribución */}
          <div className="lg:col-span-4 bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">
                  Tendencias y Proyección
                </h3>
                <span className="text-xs text-slate-400">
                  {metricPeriod.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Evolución periódica acumulada de facturación
              </p>
              <div className="w-full">
                <TrendChart
                  data={trendData}
                  title=""
                  height={240}
                  isLoading={salesLoading}
                />
              </div>
            </div>

            {/* Micro card de resumen */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Acumulado</span>
              <span className="font-bold text-cyan-400">
                S/.{" "}
                {stats.totalRevenue.toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Tabla de Ventas Recientes (Estilo Terminal / Hub) */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Ventas Recientes
                </h3>
                <span className="text-xs text-slate-400">
                  ({recentSales.length} transacciones)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Últimas operaciones registradas en el sistema
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Método de Pago</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Total (PEN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {recentSales.length > 0 ? (
                  recentSales.slice(0, 5).map((sale: any) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4 text-slate-400 font-medium">
                        #{sale.id}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-medium text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                            {getInitials(sale.cliente?.nombre)}
                          </div>
                          <span>
                            {sale.cliente?.nombre || "Cliente General"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {dayjs(sale.fecha).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-sans border ${getPaymentBadge(sale.metodoPago)}`}
                        >
                          {sale.metodoPago || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-cyan-400 text-[11px] font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          Completado
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                        S/. {Number(sale.total).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-500 font-sans"
                    >
                      No hay transacciones recientes registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </QueryBoundary>
  );
};

export default Dashboard;
