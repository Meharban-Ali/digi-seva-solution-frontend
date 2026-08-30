import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { EnquiryStatus } from "@/types/adminEnquiry.types";

interface EnquiriesByStatusChartProps {
  data?: { status: EnquiryStatus; label: string; count: number }[];
  isLoading?: boolean;
}

const STATUS_COLORS: Record<EnquiryStatus, string> = {
  NEW: "#F59E0B",
  CONTACTED: "#3B82F6",
  RESOLVED: "#10B981",
};

export function EnquiriesByStatusChart({ data = [], isLoading }: EnquiriesByStatusChartProps) {
  const { t } = useTranslation();

  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <Card className="border border-slate-200 shadow-xs bg-white rounded-xl flex flex-col">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          {t("analytics.enquiriesByStatus", "Enquiries by Status")}
        </CardTitle>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
          Total: {total}
        </span>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col justify-center items-center min-h-[260px]">
        {isLoading ? (
          <div className="w-full h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
            Loading Chart Data...
          </div>
        ) : data.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium">No enquiry status data available.</p>
        ) : (
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value ?? 0} Enquiries`, "Count"]}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || "#0B2046"}
                    />
                  ))}
                  <LabelList dataKey="count" position="top" style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnquiriesByStatusChart;
