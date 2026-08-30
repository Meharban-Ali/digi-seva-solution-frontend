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

// Custom rotated tick component to prevent horizontal label collisions
const AngledXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={8}
        dx={-4}
        textAnchor="end"
        fill="#475569"
        fontSize={10}
        fontWeight={600}
        transform="rotate(-30)"
      >
        {payload.value}
      </text>
    </g>
  );
};

export function ContentBySectionChart({ data = [], isLoading }: ContentBySectionChartProps) {
  const { t } = useTranslation();

  const total = data.reduce((acc, item) => acc + item.draft + item.published, 0);

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#0B2046]" />
          {t("analytics.contentBySection", "Content by Section")}
        </CardTitle>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
          {total} Total
        </span>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col justify-center items-center min-h-[310px]">
        {isLoading ? (
          <div className="w-full h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
            Loading Chart Data...
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-48 flex items-center justify-center text-xs text-slate-400 font-medium">
            No content section data available.
          </div>
        ) : (
          <div className="w-full h-[250px] pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  height={50}
                  interval={0}
                  tick={<AngledXAxisTick />}
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
                    `${value ?? 0} Blocks`,
                    `${item?.payload?.label || ""} (${name})`,
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
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={28}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingBottom: "4px" }}
                />
                <Bar
                  dataKey="draft"
                  name={t("analytics.draft", "Draft")}
                  stackId="a"
                  fill="#94A3B8"
                  barSize={28}
                />
                <Bar
                  dataKey="published"
                  name={t("analytics.published", "Published")}
                  stackId="a"
                  fill="#0B2046"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
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
