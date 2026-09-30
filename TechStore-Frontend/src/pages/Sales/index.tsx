import React, { useState } from "react";
import { message, DatePicker } from "antd";
import {
  PlusOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useSales } from "@/hooks/useSales";
import { useClients } from "@/hooks/useClients";
import { useProducts } from "@/hooks/useProducts";
import SaleForm from "@/components/sales/SaleForm";
import InvoiceModal from "@/components/sales/InvoiceModal";
import { Sale, CreateSale, DocumentType } from "@/types/api.types";
import { InvoiceGenerator } from "@/services/invoiceGenerator";
import dayjs from "dayjs";
import QueryBoundary from "@/components/common/QueryBoundary";
import type { RangePickerProps } from "antd/es/date-picker";
import { SaleTagger } from "@/services/saleTagger";
import { useQueryClient } from "@tanstack/react-query";

const { RangePicker } = DatePicker;

const SalesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );

  const {
    sales,
    isLoading,
    isError,
    error,
    createSale,
    isCreating,
    refetch: refetchSales,
  } = useSales({
    includeClientData: true,
    includeProductData: true,
  });

  const { clients: allClients } = useClients();
  const { products: allProducts } = useProducts();
  const queryClient = useQueryClient();

  const filteredSales = dateRange
    ? sales.filter((sale) => {
        const saleDate = dayjs(sale.fecha);
        return (
          saleDate.isAfter(dateRange[0]) && saleDate.isBefore(dateRange[1])
        );
      })
    : sales;

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const todayRevenue = filteredSales
    .filter((sale) => dayjs(sale.fecha).isSame(dayjs(), "day"))
    .reduce((sum, sale) => sum + sale.total, 0);

  const todaySales = filteredSales.filter((sale) =>
    dayjs(sale.fecha).isSame(dayjs(), "day"),
  ).length;

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateSale) => {
    try {
      const selectedType = data.tipoDocumento || DocumentType.BOLETA;
      const result = await createSale(data);
      const taggedSale = SaleTagger.tagSale(result, selectedType);

      queryClient.setQueryData<Sale[]>(["sales"], (old = []) =>
        old.map((s) => (s.id === taggedSale.id ? taggedSale : s)),
      );

      message.success(
        `${selectedType === DocumentType.FACTURA ? "Factura" : "Boleta"} registrada exitosamente`,
      );
      setIsModalOpen(false);

      setTimeout(() => {
        setSelectedSale(taggedSale);
        setShowInvoice(true);
      }, 300);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "No se pudo registrar la venta";
      message.error(`Error: ${errMessage}`);
    }
  };

  const handleViewInvoice = (sale: Sale) => {
    const taggedSale = SaleTagger.getTaggedSale(sale);
    setSelectedSale(taggedSale);
    setShowInvoice(true);
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetchSales}
    >
      <div className="space-y-6">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <ShoppingCartOutlined />
              Módulo Transaccional
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Historial de Ventas
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Registro contable, emisión de comprobantes y flujo de facturación
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RangePicker
              placeholder={["Fecha inicio", "Fecha fin"]}
              onChange={(dates) =>
                setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
              }
              disabledDate={disabledDate}
              className="!bg-slate-900 !border-slate-800 !text-slate-200 rounded-xl h-10"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer"
            >
              <PlusOutlined /> Nueva Venta
            </button>
          </div>
        </div>

        {/* Tarjetas KPI Superiores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Ventas Realizadas
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {filteredSales.length}
              </div>
              <span className="text-[11px] text-cyan-400 font-medium">
                Hoy: {todaySales} órdenes
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
              <ShoppingCartOutlined className="text-lg" />
            </div>
          </div>

          <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Ingresos Totales
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                S/. {totalRevenue.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400">
                Prom: S/.{" "}
                {filteredSales.length > 0
                  ? (totalRevenue / filteredSales.length).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
              <DollarOutlined className="text-lg" />
            </div>
          </div>

          <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Ingresos Hoy
              </span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                S/. {todayRevenue.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400">
                {todaySales > 0 ? "Flujo activo" : "Sin operaciones hoy"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
              <CreditCardOutlined className="text-lg" />
            </div>
          </div>

          <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Boletas Emitidas
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {
                  filteredSales.filter(
                    (s) => s.tipoDocumento === DocumentType.BOLETA,
                  ).length
                }
              </div>
              <span className="text-[11px] text-purple-400 font-medium">
                Facturas:{" "}
                {
                  filteredSales.filter(
                    (s) => s.tipoDocumento === DocumentType.FACTURA,
                  ).length
                }
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/50 flex items-center justify-center text-purple-400">
              <FileTextOutlined className="text-lg" />
            </div>
          </div>
        </div>

        {/* Tabla de Ventas en formato Stitch */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Registro de Operaciones
            </span>
            {dateRange && (
              <button
                type="button"
                onClick={() => setDateRange(null)}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Limpiar filtro de fechas
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">ID</th>
                  <th className="py-3.5 px-4 font-semibold">Cliente</th>
                  <th className="py-3.5 px-4 font-semibold">Fecha / Hora</th>
                  <th className="py-3.5 px-4 font-semibold">Comprobante</th>
                  <th className="py-3.5 px-4 font-semibold">Monto Total</th>
                  <th className="py-3.5 px-4 font-semibold">Método</th>
                  <th className="py-3.5 px-4 font-semibold">Ítems</th>
                  <th className="py-3.5 px-4 text-right font-semibold">
                    Ticket
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => {
                    const docType = InvoiceGenerator.getDocumentTypeLabel(
                      sale.tipoDocumento,
                    );
                    const invoiceNum =
                      InvoiceGenerator.formatInvoiceNumber(sale);

                    return (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          #{sale.id}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">
                            {sale.cliente?.nombre || "Cliente Final"}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {sale.cliente?.dniRuc || "Sin DNI/RUC"}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          <div>{dayjs(sale.fecha).format("DD/MM/YYYY")}</div>
                          <div className="text-[10px] text-slate-500">
                            {dayjs(sale.fecha).format("HH:mm")}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                              sale.tipoDocumento === DocumentType.FACTURA
                                ? "bg-purple-950/80 text-purple-300 border-purple-800/60"
                                : "bg-cyan-950/80 text-cyan-300 border-cyan-800/60"
                            }`}
                          >
                            {docType}
                          </span>
                          <div className="text-[11px] font-mono text-slate-400 mt-1">
                            {invoiceNum}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                          S/. {sale.total.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-900 border border-slate-700 text-slate-300">
                            {sale.metodoPago || "EFECTIVO"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {sale.detalles?.length || 0} prod.
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleViewInvoice(sale)}
                            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 inline-flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
                            title="Ver Comprobante"
                          >
                            <FileTextOutlined className="text-xs" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No se registraron ventas en el periodo seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Creación */}
        <SaleForm
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
          clients={allClients || []}
          products={(allProducts || []).filter((p) => p.stock > 0)}
        />

        {/* Modal de Comprobante / Factura */}
        {selectedSale && (
          <InvoiceModal
            sale={selectedSale}
            open={showInvoice}
            onClose={() => {
              setShowInvoice(false);
              setSelectedSale(null);
            }}
          />
        )}
      </div>
    </QueryBoundary>
  );
};

export default SalesPage;
