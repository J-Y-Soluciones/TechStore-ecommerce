import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Product,
  CreateProduct,
  UpdateProduct,
  Category,
} from "@/types/api.types";
import CurrencyInput from "../common/CurrencyInput";

const { TextArea } = Input;

const productSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  marca: z.string().min(2, "La marca es requerida"),
  modelo: z.string().optional(),
  descripcion: z.string().optional(),
  precio: z.number().min(0, "El precio no puede ser negativo"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  codigo: z.string().min(3, "El código debe tener al menos 3 caracteres"),
  categoriaId: z.number().min(1, "Seleccione una categoría"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  onSubmit: (data: CreateProduct | UpdateProduct) => Promise<void>;
  isSubmitting: boolean;
  categories: Category[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  product,
  onSubmit,
  isSubmitting,
  categories,
}) => {
  const isEditing = !!product;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: "",
      marca: "",
      modelo: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      codigo: "",
      categoriaId: categories[0]?.id || 1,
    },
  });

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          nombre: product.nombre,
          marca: product.marca,
          modelo: product.modelo || "",
          descripcion: product.descripcion || "",
          precio: product.precio,
          stock: product.stock,
          codigo: product.codigo,
          categoriaId: product.categoriaId,
        });
      } else {
        reset({
          nombre: "",
          marca: "",
          modelo: "",
          descripcion: "",
          precio: 0,
          stock: 0,
          codigo: "",
          categoriaId: categories[0]?.id || 1,
        });
      }
    }
  }, [open, product, reset, categories]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && product) {
        await onSubmit({ id: product.id, ...data } as UpdateProduct);
      } else {
        await onSubmit(data as CreateProduct);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const inputClass =
    "!bg-slate-900 !border-slate-800 !text-white !rounded-xl placeholder:!text-slate-500 focus:!border-cyan-500";

  return (
    <Modal
      title={
        <div className="pb-2 border-b border-slate-800 text-white font-bold text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          {isEditing ? "Actualizar Hardware SKU" : "Registrar Nuevo Hardware"}
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
      centered
      className="[&_.ant-modal-content]:!bg-[#0b1329] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-slate-800 [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-close]:!text-slate-400"
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFormSubmit)}
        className="mt-4 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-slate-300 text-xs font-semibold">
                Código SKU
              </span>
            }
            validateStatus={errors.codigo ? "error" : ""}
            help={errors.codigo?.message}
            required
            className="mb-0"
          >
            <Controller
              name="codigo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ej: LAP-002"
                  className={inputClass}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-slate-300 text-xs font-semibold">
                Categoría
              </span>
            }
            validateStatus={errors.categoriaId ? "error" : ""}
            help={errors.categoriaId?.message}
            required
            className="mb-0"
          >
            <Controller
              name="categoriaId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Seleccionar"
                  className="w-full [&_.ant-select-selector]:!bg-slate-900! [&_.ant-select-selector]:!border-slate-800! [&_.ant-select-selector]:!text-white! [&_.ant-select-selector]:!rounded-xl!"
                  popupClassName="bg-slate-900 border border-slate-800 text-white"
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.nombre,
                  }))}
                />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <span className="text-slate-300 text-xs font-semibold">
              Nombre del Dispositivo
            </span>
          }
          validateStatus={errors.nombre ? "error" : ""}
          help={errors.nombre?.message}
          required
          className="mb-0"
        >
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: Tarjeta Gráfica RTX 4070 Ti"
                className={inputClass}
              />
            )}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-slate-300 text-xs font-semibold">
                Marca
              </span>
            }
            validateStatus={errors.marca ? "error" : ""}
            help={errors.marca?.message}
            required
            className="mb-0"
          >
            <Controller
              name="marca"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ej: ASUS, Corsair"
                  className={inputClass}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-slate-300 text-xs font-semibold">
                Modelo
              </span>
            }
            validateStatus={errors.modelo ? "error" : ""}
            help={errors.modelo?.message}
            className="mb-0"
          >
            <Controller
              name="modelo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ej: ROG Strix OC"
                  className={inputClass}
                />
              )}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-slate-300 text-xs font-semibold">
                Precio (S/.)
              </span>
            }
            validateStatus={errors.precio ? "error" : ""}
            help={errors.precio?.message}
            required
            className="mb-0"
          >
            <Controller
              name="precio"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="0.00"
                  className={`w-full ${inputClass}`}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-slate-300 text-xs font-semibold">
                Stock Inicial
              </span>
            }
            validateStatus={errors.stock ? "error" : ""}
            help={errors.stock?.message}
            required
            className="mb-0"
          >
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  placeholder="0"
                  min={0}
                  className={`w-full ${inputClass} [&_.ant-input-number-input]:!text-white`}
                />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <span className="text-slate-300 text-xs font-semibold">
              Especificaciones / Notas
            </span>
          }
          validateStatus={errors.descripcion ? "error" : ""}
          help={errors.descripcion?.message}
          className="mb-0"
        >
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder="Detalles técnicos..."
                rows={3}
                className={inputClass}
              />
            )}
          />
        </Form.Item>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? "Guardando..."
              : isEditing
                ? "Actualizar Hardware"
                : "Registrar Hardware"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProductForm;
