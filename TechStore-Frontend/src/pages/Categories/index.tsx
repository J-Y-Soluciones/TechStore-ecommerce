import React, { useState } from "react";
import { Popconfirm, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useCategories } from "@/hooks/useCategories";
import CategoryForm from "@/components/categories/CategoryForm";
import { Category, CreateCategory, UpdateCategory } from "@/types/api.types";
import QueryBoundary from "@/components/common/QueryBoundary";

const CategoriesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();
  const [searchText, setSearchText] = useState("");

  const {
    categories,
    isLoading,
    isError,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    refetch,
  } = useCategories();

  const filteredCategories = categories.filter(
    (category) =>
      category.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      (category.descripcion &&
        category.descripcion.toLowerCase().includes(searchText.toLowerCase())),
  );

  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      message.success("Categoría eliminada correctamente");
    } catch (err) {
      console.error("Error deleting category:", err);
      message.error("No se pudo eliminar la categoría");
    }
  };

  const handleSubmit = async (data: CreateCategory | UpdateCategory) => {
    try {
      if ("id" in data) {
        await updateCategory(data.id, data);
        message.success("Categoría actualizada");
      } else {
        await createCategory(data);
        message.success("Categoría creada exitosamente");
      }
      setIsModalOpen(false);
      setEditingCategory(undefined);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "Error al guardar la categoría";
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
      <div className="space-y-6">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <TagsOutlined />
              Taxonomía de Catálogo
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Categorías
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Organiza y clasifica los componentes y periféricos de la tienda
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer"
          >
            <PlusOutlined /> Nueva Categoría
          </button>
        </div>

        {/* Buscador Stitch */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar categorías por nombre o descripción..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <span className="text-slate-500 text-xs hidden sm:inline font-mono">
            {filteredCategories.length} categoría(s)
          </span>
        </div>

        {/* Tabla Stitch */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">
                    Nombre de Categoría
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Descripción</th>
                  <th className="py-3.5 px-4 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-slate-800/40 transition"
                    >
                      {/* Badge con tono índigo/cyan */}
                      <td className="py-3.5 px-4 font-medium text-white">
                        <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          {category.nombre}
                        </span>
                      </td>

                      {/* Descripción */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {category.descripcion || (
                          <span className="text-slate-600 italic">
                            Sin descripción registrada
                          </span>
                        )}
                      </td>

                      {/* Botones de Acción */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
                            title="Editar categoría"
                          >
                            <EditOutlined className="text-xs" />
                          </button>
                          <Popconfirm
                            title="¿Eliminar categoría?"
                            description="Los productos asignados quedarán sin categoría."
                            onConfirm={() => handleDelete(category.id)}
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
                              title="Eliminar categoría"
                            >
                              <DeleteOutlined className="text-xs" />
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">
                      No se encontraron categorías registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CategoryForm
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(undefined);
          }}
          category={editingCategory}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </QueryBoundary>
  );
};

export default CategoriesPage;
