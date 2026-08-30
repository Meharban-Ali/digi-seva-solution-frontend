import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { ContentSection } from "@/types/adminContent.types";

interface ContentBySectionChartProps {
  data?: { section: ContentSection; label: string; draft: number; published: number }[];
  isLoading?: boolean;
}

export function ContentBySectionChart({ data = [], isLoading }: ContentBySectionChartProps) {
  const { t } = useTranslation();

  const total = data.reduce((acc, item) => acc + item.draft + item.published, 0);

  return (
    <Card className="border border-slate-200 shadow-xs bg-white rounded-xl flex flex-col">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-600" />
          {t("analytics.contentBySection", "Content by Section")}
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
          <p className="text-xs text-slate-400 font-medium">No content section data available.</p>
        ) : (
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={24}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px" }}
                />
                <Bar
                  dataKey="draft"
                  name={t("analytics.draft", "Draft")}
                  stackId="a"
                  fill="#94A3B8"
                  radius={[0, 0, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="published"
                  name={t("analytics.published", "Published")}
                  stackId="a"
                  fill="#0B2046"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ContentBySectionChart;
