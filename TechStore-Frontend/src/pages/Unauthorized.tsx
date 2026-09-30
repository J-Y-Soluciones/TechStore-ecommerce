import React from "react";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined, LockOutlined } from "@ant-design/icons";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#090d16] p-4">
      <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
        <Result
          icon={<LockOutlined className="text-rose-500 text-5xl" />}
          title={
            <span className="text-white font-extrabold text-2xl">
              403 - Acceso Denegado
            </span>
          }
          subTitle={
            <span className="text-slate-400 text-xs">
              No tienes permisos administrativos para ingresar a esta terminal.
            </span>
          }
          extra={[
            <button
              key="home"
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer mr-2"
            >
              <HomeOutlined /> Volver al Inicio
            </button>,
            <button
              key="back"
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer border border-slate-700"
            >
              Regresar
            </button>,
          ]}
        />
      </div>
    </div>
  );
};

export default Unauthorized;
