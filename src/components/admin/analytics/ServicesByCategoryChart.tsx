import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart as PieIcon } from "lucide-react";

interface ServicesByCategoryChartProps {
  data?: { name: string; count: number }[];
  isLoading?: boolean;
}

// Brand-aligned color palette (Navy, Gold/Amber, Indigo, Emerald, Slate, Rose)
const BRAND_COLORS = ["#0B2046", "#F59E0B", "#4F46E5", "#10B981", "#64748B", "#F43F5E"];

export function ServicesByCategoryChart({ data = [], isLoading }: ServicesByCategoryChartProps) {
  const { t } = useTranslation();

  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-[#0B2046]" />
          {t("analytics.servicesByCategory", "Services by Category")}
        </CardTitle>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
          {total} Total
        </span>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col justify-between min-h-[300px]">
        {isLoading ? (
          <div className="w-full h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
            Loading Chart Data...
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-48 flex items-center justify-center text-xs text-slate-400 font-medium">
            No service category data available.
          </div>
        ) : (
          <>
            {/* Donut Chart with Hover Tooltip only - NO static overlapping on-chart labels */}
            <div className="w-full h-[180px] my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                    label={false} /* Disabled static on-chart labels to prevent container overflow */
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BRAND_COLORS[index % BRAND_COLORS.length]}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      const val = Number(value) || 0;
                      const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
                      return [`${val} Services (${pct}%)`, name];
                    }}
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
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Clean Bounded Legend Grid below chart */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
              {data.map((item, index) => {
                const pct = total > 0 ? ((item.count / total) * 100).toFixed(0) : "0";
                const color = BRAND_COLORS[index % BRAND_COLORS.length];
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs py-0.5 hover:bg-slate-50 px-1.5 rounded transition-colors"
                  >
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-slate-700 truncate">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {item.count}{" "}
                      <span className="text-[11px] font-normal text-slate-400">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ServicesByCategoryChart;
