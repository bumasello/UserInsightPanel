import React, { useState, useEffect, useCallback } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { InsightsDashboard } from "./components/InsightsDashboard";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { torreApiService } from "./services/api";
import { Button } from "./components/Button";
import type { Insights, DataStats, PendingProfilesStatus } from "./types";

function App() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [stats, setStats] = useState<DataStats | null>(null);
  const [pendingStatus, setPendingStatus] =
    useState<PendingProfilesStatus | null>(null);
  const [isGloballyLoading, setIsGloballyLoading] = useState(true); // Initial loading
  const [isRefreshing, setIsRefreshing] = useState(false); // For subtle refresh
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async (isInitialLoad = false) => {
    if (!isInitialLoad) setIsRefreshing(true);
    else setIsGloballyLoading(true);
    setError(null);

    try {
      // Execute in parallel for better performance
      const [insightsRes, statsRes, pendingRes] = await Promise.all([
        torreApiService.getInsights(),
        torreApiService.getStats(),
        torreApiService.getPendingProfilesStatus(),
      ]);

      if (insightsRes.success && insightsRes.data)
        setInsights(insightsRes.data);
      else if (!insightsRes.success)
        throw new Error(
          insightsRes.error ||
            insightsRes.message ||
            "Failed to fetch insights",
        );

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      else if (!statsRes.success)
        throw new Error(
          statsRes.error || statsRes.message || "Failed to fetch statistics",
        );

      if (pendingRes.success && pendingRes.data)
        setPendingStatus(pendingRes.data);
      else if (!pendingRes.success)
        throw new Error(
          pendingRes.error ||
            pendingRes.message ||
            "Failed to fetch pending status",
        );
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(
        err.error ||
          err.message ||
          "Error loading data. Check if the backend is running and accessible.",
      );
      // Do not clear old data in case of refresh error, to maintain UI
      if (isInitialLoad) {
        setInsights(null);
        setStats(null);
        setPendingStatus(null);
      }
    } finally {
      if (!isInitialLoad) setIsRefreshing(false);
      else setIsGloballyLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchAllData(true);
  }, [fetchAllData]);

  // Auto-refresh every 30 seconds (if no global loading is active)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isGloballyLoading && !isRefreshing) {
        fetchAllData(false);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [isGloballyLoading, isRefreshing, fetchAllData]);

  // Critical error screen (e.g., backend offline on first load)
  if (isGloballyLoading && error) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 text-center">
        <div className="text-7xl mb-6">!</div>
        <h2 className="text-2xl font-semibold text-red-400 mb-3">
          Backend Connection Error
        </h2>
        <p className="text-text-dim mb-6 max-w-md">{error}</p>
        <Button
          onClick={() => fetchAllData(true)}
          loading={isGloballyLoading}
          size="lg"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Initial full page loading
  if (isGloballyLoading && !error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Torre Data Pipeline..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text-light">
      <header className="border-b border-gray-700 bg-secondary/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Torre Data Pipeline 📊
              </h1>
              <p className="text-text-dim text-sm md:text-base mt-1">
                Data engineering and professional profile analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isRefreshing && <LoadingSpinner size="sm" />}
              <div className="text-right hidden sm:block">
                <div className="text-xs text-text-dim">Last updated</div>
                <div className="text-accent font-medium text-sm">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
            <strong>Error updating data:</strong> {error} (Showing previous
            data)
          </div>
        )}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-4">
            <ControlPanel
              onDataUpdate={() => fetchAllData(false)} // Pass false to indicate it's not an initial load
              pendingStatus={pendingStatus}
              isAnyLoading={isGloballyLoading || isRefreshing} // Block buttons during any loading
            />
          </div>
          <div className="xl:col-span-8">
            <InsightsDashboard
              insights={insights}
              stats={stats}
              loading={isGloballyLoading && !insights} // Dashboard loads only if no old insights are present
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-700 bg-secondary/30 mt-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-text-dim text-sm">
              Torre Data Pipeline Project - Fullstack Internship Technical Test
            </div>
            <div className="flex items-center gap-4 text-sm text-text-dim">
              <span>
                Backend:{" "}
                {stats ? (
                  <span className="text-green-400">🟢 Online</span>
                ) : (
                  <span className="text-red-400">🔴 Offline</span>
                )}
              </span>
              <span>
                MongoDB:{" "}
                {stats ? (
                  <span className="text-green-400">🟢 Connected</span>
                ) : (
                  <span className="text-red-400">🔴 Disconnected</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
