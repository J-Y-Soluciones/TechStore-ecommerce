import React, { useState, useMemo } from "react";
import { message } from "antd";
import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons";
import ProductTable from "@/components/products/ProductTable";
import ProductForm from "@/components/products/ProductForm";
import AdvancedFilters, {
  FilterField,
} from "@/components/common/AdvancedFilters";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Product, CreateProduct, UpdateProduct } from "@/types/api.types";
import QueryBoundary from "@/components/common/QueryBoundary";

interface FilterState {
  search?: string;
  categoriaId?: string;
  minPrice?: string;
  maxPrice?: string;
  minStock?: string;
  maxStock?: string;
}

const ProductsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [filters, setFilters] = useState<FilterState>({});

  const {
    products,
    isLoading,
    isError,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useProducts();

  const { categories } = useCategories();

  const filterFields: FilterField[] = [
    {
      name: "search",
      label: "Buscar",
      type: "text",
      placeholder: "Buscar por nombre, código o marca",
    },
    {
      name: "categoriaId",
      label: "Categoría",
      type: "select",
      options: categories.map((cat) => ({
        label: cat.nombre,
        value: cat.id,
      })),
    },
    {
      name: "minPrice",
      label: "Precio Mínimo",
      type: "number",
      placeholder: "0.00",
    },
    {
      name: "maxPrice",
      label: "Precio Máximo",
      type: "number",
      placeholder: "5000.00",
    },
    {
      name: "minStock",
      label: "Stock Mínimo",
      type: "number",
      placeholder: "0",
    },
    {
      name: "maxStock",
      label: "Stock Máximo",
      type: "number",
      placeholder: "100",
    },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.codigo.toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q),
      );
    }

    if (filters.categoriaId) {
      result = result.filter(
        (p) => p.categoriaId === parseInt(filters.categoriaId!),
      );
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.precio >= parseFloat(filters.minPrice!));
    }

    if (filters.maxPrice) {
      result = result.filter((p) => p.precio <= parseFloat(filters.maxPrice!));
    }

    if (filters.minStock) {
      result = result.filter((p) => p.stock >= parseInt(filters.minStock!));
    }

    if (filters.maxStock) {
      result = result.filter((p) => p.stock <= parseInt(filters.maxStock!));
    }

    return result;
  }, [products, filters]);

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleSubmit = async (data: CreateProduct | UpdateProduct) => {
    try {
      if ("id" in data) {
        await updateProduct(data.id, data);
      } else {
        await createProduct(data);
      }
      setIsModalOpen(false);
      setEditingProduct(undefined);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "Error al guardar el producto";
      message.error(errMessage);
    }
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      <div className="p-2 md:p-4 space-y-6">
        {/* Cabecera con contraste garantizado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <AppstoreOutlined />
              Control de Inventario
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
              Catálogo de Hardware
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Mostrando{" "}
              <span className="text-cyan-400 font-mono font-bold">
                {filteredProducts.length}
              </span>{" "}
              de {products.length} productos registrados
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer"
          >
            <PlusOutlined /> Nuevo Producto
          </button>
        </div>

        {/* Filtros */}
        <AdvancedFilters
          fields={filterFields}
          onFilter={(vals) => setFilters(vals as FilterState)}
          onReset={() => setFilters({})}
          loading={isLoading}
        />

        {/* Tabla */}
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isDeleting}
        />

        <ProductForm
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(undefined);
          }}
          product={editingProduct}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
          categories={categories}
        />
      </div>
    </QueryBoundary>
  );
};

export default ProductsPage;
