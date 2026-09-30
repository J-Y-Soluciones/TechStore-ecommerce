import React, { useState } from "react";
import { Form, Input, message, Row, Col, Checkbox } from "antd";
import {
  LockOutlined,
  UserOutlined,
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
  ThunderboltFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [demoRoleLoading, setDemoRoleLoading] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Función principal de envío
  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success("¡Bienvenido de nuevo!");
      navigate("/");
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      message.error(msg);
    } finally {
      setLoading(false);
      setDemoRoleLoading(null);
    }
  };

  // Función de 1-Click Login para las credenciales Demo
  const handleQuickDemo = async (
    username: string,
    pass: string,
    roleName: string,
  ) => {
    setDemoRoleLoading(roleName);
    form.setFieldsValue({ username, password: pass });
    await onFinish({ username, password: pass });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4">
      <Row
        gutter={[48, 24]}
        justify="center"
        align="middle"
        className="w-full max-w-5xl"
      >
        {/* Columna izquierda - Marca */}
        <Col xs={24} lg={12} className="hidden lg:block">
          <div className="pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                T
              </div>
              <div>
                <div className="text-white font-black tracking-tight text-3xl leading-none">
                  TechStore
                </div>
                <div className="text-xs text-cyan-400 font-semibold tracking-widest uppercase mt-1">
                  HARDWARE HUB
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Gestión inteligente de inventario y ventas
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Control de hardware, catálogo de SKUs, emisión de boletas,
              facturas y auditoría contable en tiempo real.
            </p>

            <div className="p-4 rounded-2xl bg-[#0f172a]/60 border border-slate-800 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold">● Core v2.4</span> ·
              Sistema de operaciones comerciales conectado.
            </div>
          </div>
        </Col>

        {/* Columna derecha - Formulario */}
        <Col xs={24} lg={12}>
          <div className="bg-[#0f172a]/80 backdrop-blur border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Iniciar Sesión
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Ingresa tus credenciales o accede con una cuenta demo
              </p>
            </div>

            {/* ACCESO RÁPIDO DEMO ÚNICO */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <ThunderboltFilled className="text-xs" /> Acceso Demo Rápido
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  1-Click Login
                </span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleQuickDemo("admin", "Password123!", "ADMIN")
                }
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 text-left transition group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SafetyCertificateOutlined className="text-cyan-400 text-base" />
                    <div>
                      <div className="text-white text-xs font-bold group-hover:text-cyan-300 transition">
                        Entrar como Administrador
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {demoRoleLoading === "ADMIN"
                          ? "Ingresando a la terminal..."
                          : "admin / Password123!"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-0.5 transition">
                    Acceder →
                  </span>
                </div>
              </button>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Por favor ingresa tu usuario" },
                  { min: 3, message: "Mínimo 3 caracteres" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-slate-500 mr-1" />}
                  placeholder="Usuario"
                  className="!bg-slate-900 !border-slate-800 !text-slate-100 rounded-xl h-11 text-xs"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu contraseña",
                  },
                  { min: 6, message: "Mínimo 6 caracteres" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-500 mr-1" />}
                  placeholder="Contraseña"
                  className="!bg-slate-900 !border-slate-800 !text-slate-100 rounded-xl h-11 text-xs"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-6 text-xs">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-slate-400">Recordarme</Checkbox>
                </Form.Item>
                <span className="text-cyan-400 hover:underline cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              <Form.Item>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Accediendo..." : "Iniciar Sesión"}
                </button>
              </Form.Item>
            </Form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative bg-[#0f172a] px-3 text-[11px] text-slate-500 font-mono">
                O continúa con
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <GoogleOutlined /> Google
              </button>
              <button
                type="button"
                className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <GithubOutlined /> GitHub
              </button>
              <button
                type="button"
                className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <FacebookOutlined /> Meta
              </button>
            </div>

            <div className="text-center mt-6 text-xs text-slate-400">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-cyan-400 font-bold hover:underline"
              >
                Regístrate aquí
              </Link>
            </div>
          </div>

          <div className="text-center mt-6 text-[11px] text-slate-600 font-mono">
            © 2026 TechStore Hardware Hub. Todos los derechos reservados.
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
