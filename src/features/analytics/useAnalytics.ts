import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsData, AnalyticsSummary } from "./analyticsApi";

export function useAnalytics() {
  return useQuery<AnalyticsSummary, Error>({
    queryKey: ["adminAnalytics"],
    queryFn: fetchAnalyticsData,
    staleTime: 60 * 1000, // 1 minute stale time
    refetchOnWindowFocus: false,
  });
}

export default useAnalytics;
