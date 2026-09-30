import React from "react";
import { Table, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Product } from "@/types/api.types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const handleDelete = (id: number) => {
    onDelete(id);
    message.success("Producto eliminado correctamente");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: (a: Product, b: Product) => a.id - b.id,
      render: (id: number) => (
        <span className="text-slate-400 font-mono font-medium">#{id}</span>
      ),
    },
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      render: (codigo: string) => (
        <span className="inline-block px-2.5 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
          {codigo}
        </span>
      ),
    },
    {
      title: "Hardware / Descripción",
      dataIndex: "nombre",
      key: "nombre",
      render: (nombre: string, record: Product) => (
        <div className="py-0.5">
          <div className="font-semibold text-white tracking-tight">
            {nombre}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span className="text-slate-300 font-medium">{record.marca}</span>
            <span className="text-slate-600">•</span>
            <span>{record.modelo || "Estándar"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Categoría",
      key: "categoria",
      render: (_: unknown, record: Product) => (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
          {record.categoria?.nombre || "General"}
        </span>
      ),
    },
    {
      title: "Precio Unitario",
      dataIndex: "precio",
      key: "precio",
      sorter: (a: Product, b: Product) => a.precio - b.precio,
      render: (precio: number) => (
        <span className="font-mono font-bold text-emerald-400 text-sm">
          S/. {Number(precio).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a: Product, b: Product) => a.stock - b.stock,
      render: (stock: number) => {
        const isOutOfStock = stock === 0;
        const isLow = stock > 0 && stock < 10;

        return (
          <div className="flex flex-col items-start gap-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                isOutOfStock
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  : isLow
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOutOfStock
                    ? "bg-rose-400"
                    : isLow
                      ? "bg-amber-400 animate-pulse"
                      : "bg-emerald-400"
                }`}
              ></span>
              {stock} unidades
            </span>
            {isLow && (
              <span className="text-[10px] text-amber-400/90 font-medium">
                ¡Stock bajo!
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[10px] text-rose-400/90 font-medium">
                Agotado
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Acciones",
      key: "actions",
      width: 100,
      render: (_: unknown, record: Product) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(record)}
            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
            title="Editar producto"
          >
            <EditOutlined className="text-xs" />
          </button>
          <Popconfirm
            title="¿Eliminar producto?"
            description="Esta acción retirará el SKU del inventario."
            onConfirm={() => handleDelete(record.id)}
            okText="Eliminar"
            cancelText="Cancelar"
            okButtonProps={{
              className:
                "!bg-rose-600 hover:!bg-rose-500 !text-white !border-none",
            }}
          >
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition cursor-pointer"
              title="Eliminar producto"
            >
              <DeleteOutlined className="text-xs" />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
      className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg overflow-hidden
      [&_.ant-table]:!bg-transparent
      [&_.ant-table-container]:!bg-transparent
      [&_.ant-table-thead_.ant-table-cell]:!bg-slate-900/90
      [&_.ant-table-thead_.ant-table-cell]:!text-slate-400
      [&_.ant-table-thead_.ant-table-cell]:!border-slate-800
      [&_.ant-table-tbody_.ant-table-cell]:!border-slate-800/60
      [&_.ant-table-tbody_.ant-table-row:hover_.ant-table-cell]:!bg-slate-800/40
      [&_.ant-table-tbody_.ant-table-cell]:!text-slate-200
      [&_.ant-pagination]:!text-slate-400
      [&_.ant-pagination-item]:!bg-slate-900
      [&_.ant-pagination-item]:!border-slate-800
      [&_.ant-pagination-item_a]:!text-slate-300
      [&_.ant-pagination-item-active]:!border-cyan-500
      [&_.ant-pagination-item-active_a]:!text-cyan-400
      [&_.ant-select-selector]:!bg-slate-900!
      [&_.ant-select-selector]:!border-slate-800!
      [&_.ant-select-selection-item]:!text-slate-300"
    >
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showTotal: (total, range) => (
            <span className="text-slate-400 text-xs font-mono">
              {range[0]}-{range[1]} de {total} hardware SKUs
            </span>
          ),
        }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ProductTable;
