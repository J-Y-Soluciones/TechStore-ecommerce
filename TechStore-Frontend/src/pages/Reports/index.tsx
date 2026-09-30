import React, { useState, useEffect } from "react";
import { Spin, Modal, Form, InputNumber, Dropdown, type MenuProps } from "antd";
import {
  DownloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  WarningOutlined,
  DollarOutlined,
  ProductOutlined,
  FilterOutlined,
  PrinterOutlined,
  MailOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { reportsService } from "@/services/reports.service";
import {
  TopSellingProduct,
  LowStockProduct,
  IncomeByCategory,
  ProductWithoutCategory,
} from "@/types/reports.types";
import EnhancedBarChart from "@/Charts/EnhancedBarChart";
import EnhancedPieChart from "@/Charts/EnhancedPieChart";

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "chart" | "both">("both");
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    [],
  );
  const [incomeByCategory, setIncomeByCategory] = useState<IncomeByCategory[]>(
    [],
  );
  const [productsWithoutCategory, setProductsWithoutCategory] = useState<
    ProductWithoutCategory[]
  >([]);
  const [threshold, setThreshold] = useState(5);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>("all");
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">(
    "pdf",
  );

  useEffect(() => {
    loadReportsData();
  }, [threshold]);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const [topSellingData, lowStockData, incomeData, noCategoryData] =
        await Promise.all([
          reportsService.getTopSellingProducts(),
          reportsService.getLowStockProducts(threshold),
          reportsService.getIncomeByCategory(),
          reportsService.getProductsWithoutCategory(),
        ]);

      setTopProducts(Array.isArray(topSellingData) ? topSellingData : []);
      setLowStockProducts(Array.isArray(lowStockData) ? lowStockData : []);
      setIncomeByCategory(Array.isArray(incomeData) ? incomeData : []);
      setProductsWithoutCategory(
        Array.isArray(noCategoryData) ? noCategoryData : [],
      );
    } catch (error) {
      console.error("Error loading reports:", error);
      Modal.error({
        title: "Error",
        content: "No se pudieron cargar los reportes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => setExportModalVisible(true);
  const handleFilter = () => setFilterModalVisible(true);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "print":
        window.print();
        break;
      case "email":
        Modal.info({
          title: "Notificación",
          content: "Módulo de mensajería en cola de despacho.",
        });
        break;
      case "refresh":
        loadReportsData();
        break;
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "print",
      icon: <PrinterOutlined />,
      label: "Imprimir Reporte",
      onClick: () => handleQuickAction("print"),
    },
    {
      key: "email",
      icon: <MailOutlined />,
      label: "Enviar por Email",
      onClick: () => handleQuickAction("email"),
    },
    { type: "divider" },
    {
      key: "refresh",
      icon: <SettingOutlined />,
      label: "Recargar Datos",
      onClick: () => handleQuickAction("refresh"),
    },
  ];

  const totalRevenue = incomeByCategory.reduce(
    (sum, item) => sum + (item.ingresos || 0),
    0,
  );

  // Gráficos
  const renderChartView = () => {
    const topProductsChartData = topProducts.slice(0, 6).map((item, index) => ({
      label:
        item.producto?.substring(0, 18) +
          (item.producto?.length > 18 ? "..." : "") || "SKU",
      value: item.totalVendido || 0,
      color: ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"][
        index % 6
      ],
    }));

    const incomeChartData = incomeByCategory.slice(0, 5).map((item, index) => ({
      label: item.categoria?.substring(0, 15) || "General",
      value: item.ingresos || 0,
      color: ["#06b6d4", "#10b981", "#f59e0b", "#a855f7", "#3b82f6"][index % 5],
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <EnhancedBarChart
              title="Top Productos Más Vendidos"
              data={topProductsChartData}
              height={300}
              unit="uds"
              showTooltip={true}
              showGrid={true}
              showLegend={false}
              compact={true}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Meta Mensual
              </span>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                65%
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="w-full flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>Actual: S/. 8,450</span>
                <span>Meta: S/. 13,000</span>
              </div>
            </div>

            <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Rotación de Stock
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  2.4x
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Alta rotación operativa
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <InfoCircleOutlined className="text-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <EnhancedPieChart
            title="Distribución de Facturación por Categoría"
            data={incomeChartData}
            height={320}
            showDonut={true}
            showLabels={false}
          />
        </div>
      </div>
    );
  };

  // Tablas
  const renderTableView = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ventas */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChartOutlined className="text-cyan-400" /> Top Productos
                Vendidos
              </span>
              <Link
                to="/reports/top-selling"
                className="text-xs text-cyan-400 hover:underline"
              >
                Ver detalle analítico
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/80 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-4 text-center">Unidades</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {topProducts.slice(0, 5).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-cyan-400 font-bold">
                        #{idx + 1}
                      </td>
                      <td className="py-3 px-4 text-white font-sans font-medium">
                        {item.producto || "Hardware SKU"}
                      </td>
                      <td className="py-3 px-4 text-center text-emerald-400 font-bold">
                        {item.totalVendido || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Categorías Top */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PieChartOutlined className="text-emerald-400" /> Facturación
                por Categoría
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/80 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Ingresos</th>
                    <th className="py-3 px-4 text-right">% Cuota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {incomeByCategory.slice(0, 5).map((cat, idx) => {
                    const percentage =
                      totalRevenue > 0
                        ? ((cat.ingresos || 0) / totalRevenue) * 100
                        : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 text-white font-sans font-medium">
                          {cat.categoria}
                        </td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">
                          S/. {(cat.ingresos || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400">
                          {percentage.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spin size="large" />
        <span className="text-slate-400 text-xs mt-3 tracking-widest uppercase">
          Generando telemetría...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1">
            <LineChartOutlined />
            Business Intelligence
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Reportes y Métricas Operativas
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Actualizado: {dayjs().format("DD/MM/YYYY HH:mm")} ·{" "}
            <span className="text-emerald-400">● Motor en línea</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleFilter}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <FilterOutlined /> Filtros
          </button>

          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              Acciones
            </button>
          </Dropdown>

          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-2 transition cursor-pointer"
          >
            <DownloadOutlined /> Exportar
          </button>
        </div>
      </div>

      {/* Selector de modo estilo Pill */}
      <div className="flex items-center justify-between bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-2.5">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider pl-2">
          Vista de datos:
        </span>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
          {(["table", "chart", "both"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                viewMode === mode
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {mode === "table"
                ? "Tablas"
                : mode === "chart"
                  ? "Gráficos"
                  : "Combinado"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              En Ranking
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {topProducts.length}
            </div>
            <span className="text-[11px] text-cyan-400 font-medium">
              SKUs con demanda
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <BarChartOutlined className="text-lg" />
          </div>
        </div>

        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Bajo Stock
            </span>
            <div
              className={`text-2xl font-black mt-1 ${lowStockProducts.length > 0 ? "text-amber-400" : "text-emerald-400"}`}
            >
              {lowStockProducts.length}
            </div>
            <span className="text-[11px] text-slate-400">
              {lowStockProducts.length > 0
                ? "Requiere reabastecer"
                : "Stock suficiente"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <WarningOutlined className="text-lg" />
          </div>
        </div>

        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Facturación Global
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              S/. {totalRevenue.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400">
              {incomeByCategory.length} categorías
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <DollarOutlined className="text-lg" />
          </div>
        </div>

        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Sin Categoría
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {productsWithoutCategory.length}
            </div>
            <span className="text-[11px] text-slate-400">Sin clasificar</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/50 flex items-center justify-center text-purple-400">
            <ProductOutlined className="text-lg" />
          </div>
        </div>
      </div>

      {/* Render condicional de secciones */}
      {viewMode === "table" && renderTableView()}
      {viewMode === "chart" && renderChartView()}
      {viewMode === "both" && (
        <div className="space-y-6">
          {renderChartView()}
          {renderTableView()}
        </div>
      )}

      {/* Modal de Exportación */}
      <Modal
        title={
          <span className="text-white font-bold">
            Generar Archivo de Exportación
          </span>
        }
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        onOk={() => {
          setExportModalVisible(false);
          Modal.success({
            title: "Exportación en curso",
            content: `Generando archivo ${exportFormat.toUpperCase()} para ${selectedReport}.`,
          });
        }}
        okText="Descargar"
        cancelText="Cancelar"
        className="[&_.ant-modal-content]:!bg-[#0f172a] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-slate-800 [&_.ant-modal-header]:!bg-transparent"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item
            label={
              <span className="text-xs text-slate-400">Reporte Destino</span>
            }
          >
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
            >
              <option value="all">
                Consolidado General (Todas las métricas)
              </option>
              <option value="top-selling">Top Hardware Vendido</option>
              <option value="low-stock">Alerta de Stock Crítico</option>
              <option value="income-category">Facturación por Categoría</option>
            </select>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs text-slate-400">Formato de Salida</span>
            }
          >
            <div className="grid grid-cols-3 gap-3">
              {(["pdf", "excel", "csv"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={`py-2 text-xs font-bold rounded-lg uppercase border transition ${
                    exportFormat === fmt
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Filtros */}
      <Modal
        title={
          <span className="text-white font-bold">Parámetros de Auditoría</span>
        }
        open={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        onOk={() => {
          setFilterModalVisible(false);
          loadReportsData();
        }}
        okText="Aplicar"
        cancelText="Cancelar"
        className="[&_.ant-modal-content]:!bg-[#0f172a] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-slate-800 [&_.ant-modal-header]:!bg-transparent"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item
            label={
              <span className="text-xs text-slate-400">
                Umbral de Stock Bajo (Unidades)
              </span>
            }
          >
            <InputNumber
              min={1}
              max={100}
              value={threshold}
              onChange={(val) => val && setThreshold(val)}
              className="!w-full !bg-slate-900 !border-slate-700 !text-slate-100 rounded-lg"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportsPage;
