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

// Brand-aligned desaturated status colors (Amber for New, Indigo/Blue for Contacted, Emerald for Resolved)
const STATUS_COLORS: Record<EnquiryStatus, string> = {
  NEW: "#F59E0B",
  CONTACTED: "#4F46E5",
  RESOLVED: "#10B981",
};

export function EnquiriesByStatusChart({ data = [], isLoading }: EnquiriesByStatusChartProps) {
  const { t } = useTranslation();

  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#0B2046]" />
          {t("analytics.enquiriesByStatus", "Enquiries by Status")}
        </CardTitle>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
          {total} Total
        </span>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col justify-center items-center min-h-[300px]">
        {isLoading ? (
          <div className="w-full h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
            Loading Chart Data...
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-48 flex items-center justify-center text-xs text-slate-400 font-medium">
            No enquiry status data available.
          </div>
        ) : (
          <div className="w-full h-[240px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 24, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  interval={0}
                  tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value ?? 0} Enquiries`,
                    item?.payload?.label || name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontSize: "12px",
                    padding: "8px 12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  }}
                  itemStyle={{ color: "#F8FAFC", fontWeight: 600 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={42}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || "#0B2046"}
                    />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fontSize: "11px", fontWeight: "bold", fill: "#1E293B" }}
                  />
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
