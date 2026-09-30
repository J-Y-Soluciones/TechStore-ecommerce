import React from "react";
import { Dropdown, message } from "antd";
import {
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    message.success("Sesión cerrada exitosamente");
    navigate("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (!user) return null;

  const getUserInitials = () => {
    if (!user.username) return "AD";
    const parts = user.username.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : user.username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-[#080d19] border-b border-slate-800/80 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-cyan-400 tracking-wider hidden sm:inline">
          TechStore Retail Hub
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <SearchOutlined className="text-slate-500" />
          <span>Buscar terminal, SKU, clientes...</span>
          <kbd className="ml-3 px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </div>

        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
        >
          <BellOutlined />
        </button>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-[11px] font-black">
              {getUserInitials()}
            </div>
            <div className="flex flex-col text-left leading-tight pr-1">
              <span className="text-xs font-bold text-white capitalize">
                {user.username}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                {user.role || "ADMIN"}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default AppHeader;
