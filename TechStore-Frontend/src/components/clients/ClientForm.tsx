import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Client, CreateClient, UpdateClient } from "@/types/api.types";

const clientSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  dniRuc: z.string().min(8, "El DNI/RUC debe tener al menos 8 caracteres"),
  direccion: z.string().min(5, "La dirección es requerida"),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres"),
  email: z.string().email("Email inválido"),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  client?: Client;
  onSubmit: (data: CreateClient | UpdateClient) => Promise<void>;
  isSubmitting: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  open,
  onClose,
  client,
  onSubmit,
  isSubmitting,
}) => {
  const isEditing = !!client;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombre: "",
      dniRuc: "",
      direccion: "",
      telefono: "",
      email: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (client) {
        reset({
          nombre: client.nombre,
          dniRuc: client.dniRuc,
          direccion: client.direccion,
          telefono: client.telefono,
          email: client.email,
        });
      } else {
        reset({
          nombre: "",
          dniRuc: "",
          direccion: "",
          telefono: "",
          email: "",
        });
      }
    }
  }, [open, client, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      if (isEditing && client) {
        await onSubmit({ id: client.id, ...data } as UpdateClient);
      } else {
        await onSubmit(data as CreateClient);
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
          {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        </span>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
      className="[&_.ant-modal-content]:!bg-[#0f172a] [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-slate-800 [&_.ant-modal-header]:!bg-transparent"
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleFormSubmit)}
        className="mt-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-xs font-semibold text-slate-400">
                Nombre Completo
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
                  placeholder="Ej: Juan Pérez"
                  size="middle"
                  className="!bg-slate-900 !border-slate-700/80 !text-slate-100 placeholder:!text-slate-500 rounded-lg"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-slate-400">
                DNI / RUC
              </span>
            }
            validateStatus={errors.dniRuc ? "error" : ""}
            help={errors.dniRuc?.message}
            required
          >
            <Controller
              name="dniRuc"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ej: 12345678"
                  size="middle"
                  className="!bg-slate-900 !border-slate-700/80 !text-slate-100 placeholder:!text-slate-500 rounded-lg"
                />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <span className="text-xs font-semibold text-slate-400">
              Correo Electrónico
            </span>
          }
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
          required
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: cliente@email.com"
                size="middle"
                type="email"
                className="!bg-slate-900 !border-slate-700/80 !text-slate-100 placeholder:!text-slate-500 rounded-lg"
              />
            )}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-xs font-semibold text-slate-400">
                Teléfono
              </span>
            }
            validateStatus={errors.telefono ? "error" : ""}
            help={errors.telefono?.message}
            required
          >
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ej: 987654321"
                  size="middle"
                  className="!bg-slate-900 !border-slate-700/80 !text-slate-100 placeholder:!text-slate-500 rounded-lg"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-slate-400">
                Dirección
              </span>
            }
            validateStatus={errors.direccion ? "error" : ""}
            help={errors.direccion?.message}
            required
          >
            <Controller
              name="direccion"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ej: Av. Principal 123"
                  size="middle"
                  className="!bg-slate-900 !border-slate-700/80 !text-slate-100 placeholder:!text-slate-500 rounded-lg"
                />
              )}
            />
          </Form.Item>
        </div>

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

export default ClientForm;
