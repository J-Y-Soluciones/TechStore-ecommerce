import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#090d16]">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-[#090d16] p-6 text-slate-100">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
