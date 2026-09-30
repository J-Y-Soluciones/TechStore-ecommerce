import React, { useState, useCallback, useMemo } from "react";

import { Modal, Form, Select, Table, InputNumber, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreateSale,
  Client,
  Product,
  PaymentMethod,
  DocumentType,
} from "@/types/api.types";

const { Option } = Select;

// Esquema de validación
const saleSchema = z.object({
  clienteId: z.number().min(1, "Seleccione un cliente"),
  metodoPago: z.string().min(1, "Seleccione un método de pago"),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleDetailWithProduct {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  producto?: Product;
}

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSale) => Promise<void>;
  isSubmitting: boolean;
  clients: Client[];
  products: Product[];
}

const determineDocumentType = (cliente: Client | undefined): DocumentType => {
  if (!cliente) return DocumentType.BOLETA;
  if (cliente.dniRuc && cliente.dniRuc.length === 11) {
    return DocumentType.FACTURA;
  }
  return DocumentType.BOLETA;
};

const SaleForm: React.FC<SaleFormProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  clients,
  products,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<
    SaleDetailWithProduct[]
  >([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [cantidad, setCantidad] = useState<number>(1);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      clienteId: clients[0]?.id || 0,
      metodoPago: PaymentMethod.CASH,
    },
  });

  // Observador de cliente seleccionado
  const selectedClientId = useWatch({ control, name: "clienteId" });

  // Estado derivado: calculamos el tipo de documento sin requerir setState en un effect
  const tipoDocumento = useMemo(() => {
    const cliente = clients.find((c) => c.id === selectedClientId);
    return determineDocumentType(cliente);
  }, [selectedClientId, clients]);

  const resetForm = useCallback(() => {
    setSelectedProducts([]);
    setSelectedProductId(null);
    setCantidad(1);
    reset({
      clienteId: clients[0]?.id || 0,
      metodoPago: PaymentMethod.CASH,
    });
  }, [clients, reset]);

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + item.cantidad * item.precioUnitario,
    0,
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const agregarProducto = () => {
    if (!selectedProductId || cantidad < 1) return;

    const producto = products.find((p) => p.id === selectedProductId);
    if (!producto) {
      message.error("Producto no encontrado");
      return;
    }

    if (producto.stock < cantidad) {
      message.warning(
        `Stock insuficiente. Disponible: ${producto.stock} unidades`,
      );
      return;
    }

    const existingIndex = selectedProducts.findIndex(
      (item) => item.productoId === selectedProductId,
    );
    if (existingIndex > -1) {
      const updated = [...selectedProducts];
      const nuevaCantidad = updated[existingIndex].cantidad + cantidad;
      if (producto.stock < nuevaCantidad) {
        message.warning(
          `Stock total insuficiente. Máximo disponible: ${producto.stock}`,
        );
        return;
      }
      updated[existingIndex].cantidad = nuevaCantidad;
      setSelectedProducts(updated);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          productoId: selectedProductId,
          cantidad,
          precioUnitario: producto.precio,
          producto,
        },
      ]);
    }

    setSelectedProductId(null);
    setCantidad(1);
  };

  const eliminarProducto = (index: number) => {
    const nuevos = [...selectedProducts];
    nuevos.splice(index, 1);
    setSelectedProducts(nuevos);
  };

  const handleFormSubmit = async (data: SaleFormData) => {
    try {
      const saleData: CreateSale = {
        clienteId: data.clienteId,
        metodoPago: data.metodoPago,
        tipoDocumento: tipoDocumento,
        detalles: selectedProducts.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      };

      await onSubmit(saleData);
      resetForm();
      onClose();
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(`Error al registrar venta: ${errorMsg}`);
    }
  };

  const columns: ColumnsType<SaleDetailWithProduct> = [
    {
      title: (
        <span className="text-slate-400 text-xs font-semibold">Producto</span>
      ),
      dataIndex: "producto",
      key: "producto",
      render: (producto: Product | undefined) => (
        <div>
          <div className="font-medium text-slate-100 text-xs">
            {producto?.nombre || "N/A"}
          </div>
          <div className="text-[10px] text-cyan-400 font-mono">
            {producto?.codigo || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="text-slate-400 text-xs font-semibold">Cant.</span>
      ),
      dataIndex: "cantidad",
      key: "cantidad",
      width: 70,
      render: (cant: number) => (
        <span className="text-slate-200 text-xs font-mono font-bold">
          {cant}
        </span>
      ),
    },
    {
      title: (
        <span className="text-slate-400 text-xs font-semibold">P. Unit.</span>
      ),
      dataIndex: "precioUnitario",
      key: "precioUnitario",
      width: 100,
      render: (precio: number) => (
        <span className="text-slate-300 text-xs font-mono">
          S/ {precio.toFixed(2)}
        </span>
      ),
    },
    {
      title: (
        <span className="text-slate-400 text-xs font-semibold">Subtotal</span>
      ),
      key: "subtotal",
      width: 100,
      render: (_value: unknown, record: SaleDetailWithProduct) => (
        <span className="font-semibold text-emerald-400 text-xs font-mono">
          S/ {(record.cantidad * record.precioUnitario).toFixed(2)}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (
        _value: unknown,
        _record: SaleDetailWithProduct,
        index: number,
      ) => (
        <button
          type="button"
          onClick={() => eliminarProducto(index)}
          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition cursor-pointer"
        >
          <DeleteOutlined className="text-xs" />
        </button>
      ),
    },
  ];

  const productosConStock = products.filter((p) => p.stock > 0);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5 text-white font-bold text-base py-1">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Registrar Nueva Operación de Venta</span>
        </div>
      }
      open={open}
      onCancel={handleModalClose}
      footer={null}
      width={1080}
      destroyOnClose
      className="dark-saas-modal"
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFormSubmit)}
        className="mt-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y PRODUCTOS */}
          <div className="lg:col-span-7 space-y-4">
            {/* PANEL 1: INFORMACIÓN DE LA VENTA */}
            <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/80">
                <UserOutlined className="text-cyan-400 text-xs" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Información del Cliente y Pago
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Form.Item
                  label={
                    <span className="text-slate-300 text-xs font-medium">
                      Cliente *
                    </span>
                  }
                  validateStatus={errors.clienteId ? "error" : ""}
                  help={errors.clienteId?.message}
                  className="!mb-3"
                >
                  <Controller
                    name="clienteId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Seleccionar cliente"
                        className="w-full !h-10 text-xs custom-dark-select"
                        showSearch
                        optionFilterProp="children"
                      >
                        {clients.map((client) => (
                          <Option key={client.id} value={client.id}>
                            <div className="flex flex-col py-0.5">
                              <span className="font-semibold text-slate-100">
                                {client.nombre}
                              </span>
                              <span className="text-[10px] text-cyan-400 font-mono">
                                {client.dniRuc.length === 11
                                  ? "RUC: "
                                  : "DNI: "}
                                {client.dniRuc}
                              </span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-slate-300 text-xs font-medium">
                      Método de Pago *
                    </span>
                  }
                  validateStatus={errors.metodoPago ? "error" : ""}
                  help={errors.metodoPago?.message}
                  className="!mb-3"
                >
                  <Controller
                    name="metodoPago"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Método de pago"
                        className="w-full !h-10 text-xs custom-dark-select"
                      >
                        <Option value={PaymentMethod.CASH}>Efectivo</Option>
                        <Option value={PaymentMethod.CARD}>
                          Tarjeta Débito/Crédito
                        </Option>
                        <Option value={PaymentMethod.TRANSFER}>
                          Transferencia Bancaria
                        </Option>
                      </Select>
                    )}
                  />
                </Form.Item>
              </div>

              <div className="mt-1 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-cyan-400 text-sm" />
                  <div>
                    <div className="text-[11px] text-slate-400">
                      Tipo de Comprobante Determinado:
                    </div>
                    <div className="text-xs font-bold text-white">
                      {tipoDocumento === DocumentType.FACTURA
                        ? "Factura Comercial"
                        : "Boleta de Venta"}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase ${
                    tipoDocumento === DocumentType.FACTURA
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                      : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {tipoDocumento === DocumentType.FACTURA
                    ? "FACTURA (RUC)"
                    : "BOLETA (DNI)"}
                </span>
              </div>
            </div>

            {/* PANEL 2: AGREGAR PRODUCTOS */}
            <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/80">
                <ShoppingCartOutlined className="text-cyan-400 text-xs" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Catálogo de Artículos
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2.5 items-end">
                <div className="col-span-8">
                  <label className="block text-[11px] text-slate-400 mb-1.5">
                    Producto con Stock Disponible
                  </label>
                  <Select
                    placeholder="Buscar por nombre o código..."
                    value={selectedProductId}
                    onChange={setSelectedProductId}
                    className="w-full !h-10 text-xs custom-dark-select"
                    showSearch
                    optionFilterProp="children"
                  >
                    {productosConStock.map((product) => (
                      <Option key={product.id} value={product.id}>
                        <div className="flex justify-between items-center py-0.5">
                          <span className="font-medium text-slate-200">
                            {product.nombre}
                          </span>
                          <span className="text-[11px] text-cyan-400 font-mono ml-2">
                            S/ {product.precio.toFixed(2)} (Stock:{" "}
                            {product.stock})
                          </span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="col-span-4">
                  <label className="block text-[11px] text-slate-400 mb-1.5">
                    Cantidad
                  </label>
                  <InputNumber
                    value={cantidad}
                    onChange={(val) => setCantidad(val || 1)}
                    min={1}
                    className="w-full !h-10 !bg-slate-900 !border-slate-800 !text-slate-100 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={agregarProducto}
                disabled={!selectedProductId || cantidad < 1}
                className="w-full mt-3 py-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-30 disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              >
                <PlusOutlined className="text-xs" /> Agregar a la Lista de Venta
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE ORDEN */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800 flex flex-col justify-between shadow-sm min-h-[360px]">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Detalle de la Orden
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {selectedProducts.length} ítem(s)
                  </span>
                </div>

                {selectedProducts.length === 0 ? (
                  <div className="py-7 px-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-800/80 text-center flex flex-col items-center justify-center my-auto">
                    <ShoppingCartOutlined className="text-3xl text-slate-600 mb-2" />
                    <div className="text-xs font-semibold text-slate-400">
                      Canasta de venta vacía
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                      Selecciona productos del inventario y agrégalos a la
                      orden.
                    </div>
                  </div>
                ) : (
                  <div className="max-h-[220px] overflow-y-auto pr-1">
                    <Table
                      dataSource={selectedProducts}
                      columns={columns}
                      rowKey={(record, index) =>
                        `${record.productoId}-${index}`
                      }
                      pagination={false}
                      size="small"
                      className="dark-table"
                    />
                  </div>
                )}
              </div>

              {/* CÁLCULO DE TOTALES CONTABLES */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal Base</span>
                  <span className="font-mono text-slate-200">
                    S/ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>IGV (18%)</span>
                  <span className="font-mono text-slate-200">
                    S/ {igv.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Importe Total
                  </span>
                  <span className="text-xl font-black text-emerald-400 font-mono tracking-tight">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACCIONES DEL MODAL */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={handleModalClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedProducts.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircleOutlined className="text-sm" />
            {isSubmitting
              ? "Registrando Operación..."
              : "Confirmar y Registrar Venta"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default SaleForm;
