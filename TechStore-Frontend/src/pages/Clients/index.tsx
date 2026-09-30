import React, { useState } from "react";
import { Popconfirm, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useClients } from "@/hooks/useClients";
import ClientForm from "@/components/clients/ClientForm";
import { Client, CreateClient, UpdateClient } from "@/types/api.types";
import QueryBoundary from "@/components/common/QueryBoundary";

const ClientsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [searchText, setSearchText] = useState("");

  const {
    clients,
    isLoading,
    isError,
    error,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    refetch,
  } = useClients();

  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      client.dniRuc.includes(searchText) ||
      client.email.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleCreate = () => {
    setEditingClient(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id);
      message.success("Cliente eliminado correctamente");
    } catch (err) {
      console.error("Error deleting client:", err);
      message.error("No se pudo eliminar el cliente");
    }
  };

  const handleSubmit = async (data: CreateClient | UpdateClient) => {
    try {
      if ("id" in data) {
        await updateClient(data.id, data);
        message.success("Cliente actualizado");
      } else {
        await createClient(data);
        message.success("Cliente registrado exitosamente");
      }
      setIsModalOpen(false);
      setEditingClient(undefined);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "Error al guardar el cliente";
      message.error(errMessage);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "CL";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
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
              <UserOutlined />
              Directorio Comercial
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Gestión de Clientes
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Mostrando{" "}
              <span className="text-cyan-400 font-mono font-bold">
                {filteredClients.length}
              </span>{" "}
              de {clients.length} compradores registrados
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer"
          >
            <PlusOutlined /> Nuevo Cliente
          </button>
        </div>

        {/* Barra de Filtro / Búsqueda */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por DNI/RUC, nombre o correo..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <span className="text-slate-500 text-xs hidden sm:inline font-mono">
            {filteredClients.length} resultado(s)
          </span>
        </div>

        {/* Tabla de Clientes en formato Stitch Hub */}
        <div className="bg-[#0f172a]/70 backdrop-blur border border-slate-800/80 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">
                    Identificación (DNI/RUC)
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Cliente</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Teléfono</th>
                  <th className="py-3.5 px-4 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-800/40 transition"
                    >
                      {/* DNI / RUC en Badge Terminal */}
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                          {client.dniRuc}
                        </span>
                      </td>

                      {/* Nombre con Avatar Pill */}
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                            {getInitials(client.nombre)}
                          </div>
                          <span>{client.nombre}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {client.email || "N/A"}
                      </td>

                      {/* Teléfono */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {client.telefono || "Sin teléfono"}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(client)}
                            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
                            title="Editar cliente"
                          >
                            <EditOutlined className="text-xs" />
                          </button>
                          <Popconfirm
                            title="¿Eliminar cliente?"
                            description="Esta acción retirará al cliente de la base de datos."
                            onConfirm={() => handleDelete(client.id)}
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
                              title="Eliminar cliente"
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
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No se encontraron clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ClientForm
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClient(undefined);
          }}
          client={editingClient}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </QueryBoundary>
  );
};

export default ClientsPage;
