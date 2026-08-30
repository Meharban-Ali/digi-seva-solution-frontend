import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart as PieIcon } from "lucide-react";

interface ServicesByCategoryChartProps {
  data?: { name: string; count: number }[];
  isLoading?: boolean;
}

const COLORS = ["#0B2046", "#F95700", "#64748B", "#4F46E5", "#10B981", "#E11D48"];

export function ServicesByCategoryChart({ data = [], isLoading }: ServicesByCategoryChartProps) {
  const { t } = useTranslation();

  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <Card className="border border-slate-200 shadow-xs bg-white rounded-xl flex flex-col">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-primary" />
          {t("analytics.servicesByCategory", "Services by Category")}
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
          <p className="text-xs text-slate-400 font-medium">No service category data available.</p>
        ) : (
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value ?? 0} Services`, "Count"]}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ServicesByCategoryChart;
