import React from "react";
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardOutlined /> },
    { path: "/products", label: "Productos", icon: <AppstoreOutlined /> },
    { path: "/clients", label: "Clientes", icon: <UserOutlined /> },
    { path: "/categories", label: "Categorías", icon: <TagsOutlined /> },
    { path: "/sales", label: "Ventas", icon: <ShoppingCartOutlined /> },
    { path: "/reports", label: "Reportes", icon: <BarChartOutlined /> },
  ];

  return (
    <aside className="w-64 h-full bg-[#080d19] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div>
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            T
          </div>
          <div>
            <div className="text-white font-black tracking-tight text-base leading-none">
              TechStore
            </div>
            <div className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">
              HARDWARE HUB
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 py-1">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Estado
          </span>
          <span className="text-emerald-400 font-semibold text-[11px]">
            En línea
          </span>
        </div>
        <button
          type="button"
          className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs transition bg-transparent border-0 cursor-pointer"
        >
          <SettingOutlined /> Configuración
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
