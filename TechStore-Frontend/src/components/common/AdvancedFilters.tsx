import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

export type FilterFieldType =
  | "text"
  | "select"
  | "date"
  | "dateRange"
  | "number";

export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  options?: Array<{ label: string; value: string | number }>;
  placeholder?: string;
}

export interface AdvancedFiltersProps {
  fields: FilterField[];
  onFilter: (values: Record<string, unknown>) => void;
  onReset: () => void;
  loading?: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  fields,
  onFilter,
  onReset,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: Record<string, unknown>) => {
    onFilter(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            placeholder={
              field.placeholder || `Buscar ${field.label.toLowerCase()}`
            }
            allowClear
          />
        );
      case "select":
        return (
          <Select
            placeholder={
              field.placeholder || `Seleccionar ${field.label.toLowerCase()}`
            }
            allowClear
            showSearch
            optionFilterProp="children"
            className="w-full"
          >
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      case "date":
        return <DatePicker className="w-full" />;
      case "dateRange":
        return <RangePicker className="w-full" />;
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder || field.label}
            allowClear
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  {field.label}
                </span>
              }
              className="!mb-0"
            >
              {renderField(field)}
            </Form.Item>
          ))}
        </div>

        <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer border border-slate-700"
          >
            <ReloadOutlined /> Limpiar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer"
          >
            <SearchOutlined /> Buscar
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AdvancedFilters;
