import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category, CreateCategory, UpdateCategory } from "@/types/api.types";

const { TextArea } = Input;

const categorySchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
  onSubmit: (data: CreateCategory | UpdateCategory) => Promise<void>;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  category,
  onSubmit,
  isSubmitting,
}) => {
  const isEditing = !!category;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          nombre: category.nombre,
          descripcion: category.descripcion || "",
        });
      } else {
        reset({
          nombre: "",
          descripcion: "",
        });
      }
    }
  }, [open, category, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await onSubmit({ id: category.id, ...data } as UpdateCategory);
      } else {
        await onSubmit(data as CreateCategory);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal
      title={
        <span className="text-white font-bold">
          {isEditing ? "Editar Categoría" : "Nueva Categoría"}
        </span>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
      destroyOnClose
      className="[&_.ant-modal-content]:!bg-[#0f172a] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-slate-800 [&_.ant-modal-header]:!bg-transparent"
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFormSubmit)}
        className="mt-4"
      >
        <Form.Item
          label={
            <span className="text-xs font-semibold text-slate-400">
              Nombre de la Categoría
            </span>
          }
          validateStatus={errors.nombre ? "error" : ""}
          help={errors.nombre?.message}
          required
        >
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: Laptops, Periféricos, Componentes"
                size="middle"
                className="!bg-slate-900 !border-slate-700/80 !text-slate-100 placeholder:!text-slate-500 rounded-lg"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs font-semibold text-slate-400">
              Descripción
            </span>
          }
          validateStatus={errors.descripcion ? "error" : ""}
          help={errors.descripcion?.message}
        >
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder="Breve descripción del tipo de hardware..."
                rows={3}
                size="middle"
                className="!bg-slate-900 !border-slate-700/80 !text-slate-100 placeholder:!text-slate-500 rounded-lg"
              />
            )}
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
