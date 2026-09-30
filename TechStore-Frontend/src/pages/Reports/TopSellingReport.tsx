import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import {
  DownloadOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { reportsService } from "@/services/reports.service";
import { TopSellingProduct } from "@/types/reports.types";

const TopSellingReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);

  useEffect(() => {
    loadTopProducts();
  }, []);

  const loadTopProducts = async () => {
    setLoading(true);
    try {
      const data = await reportsService.getTopSellingProducts();
      setTopProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading top products:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSold = topProducts.reduce(
    (sum, item) => sum + item.totalVendido,
    0,
  );
  const averagePerProduct =
    topProducts.length > 0 ? totalSold / topProducts.length : 0;
  const maxSold = topProducts[0]?.totalVendido || 1;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 transition"
          >
            <ArrowLeftOutlined /> Volver a Reportes
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Top Hardware con Mayor Rotación
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Análisis consolidado de demanda y ventas acumuladas
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer"
        >
          <DownloadOutlined /> Exportar Resumen
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Unidades Totales
            </span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
              {totalSold} uds
            </div>
            <span className="text-[11px] text-slate-400">Total acumulado</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <ShoppingCartOutlined className="text-lg" />
          </div>
        </div>

        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              SKUs en Ranking
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {topProducts.length}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Líderes de catálogo
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <BarChartOutlined className="text-lg" />
          </div>
        </div>

        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Promedio por SKU
            </span>
            <div className="text-2xl font-black text-purple-400 font-mono mt-1">
              {averagePerProduct.toFixed(1)} uds
            </div>
            <span className="text-[11px] text-slate-400">
              Media de rotación
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/50 flex items-center justify-center text-purple-400">
            <TrophyOutlined className="text-lg" />
          </div>
        </div>
      </div>

      {/* Tabla Stitch */}
      <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Posiciones y Ratio de Volumen
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-center w-16">
                    Rank
                  </th>
                  <th className="py-3.5 px-4 font-semibold">
                    Producto Hardware
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Volumen Vendido</th>
                  <th className="py-3.5 px-4 text-right font-semibold">
                    Participación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {topProducts.map((p, idx) => {
                  const share = ((p.totalVendido / maxSold) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-mono font-bold text-xs ${
                            idx === 0
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : idx === 1
                                ? "bg-slate-300/20 text-slate-200 border border-slate-300/40"
                                : idx === 2
                                  ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                                  : "bg-slate-900 text-slate-500 border border-slate-800"
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-white">
                        {p.producto || "Hardware SKU sin nombre"}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                        {p.totalVendido} unidades
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-cyan-500 h-full rounded-full"
                              style={{ width: `${share}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-slate-400 text-[11px] w-10 text-right">
                            {share}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellingReport;
