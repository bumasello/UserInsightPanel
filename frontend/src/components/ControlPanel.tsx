import { useState } from "react";

import { Button } from "./Button";
import { torreApiService } from "../services/api";
import { Card } from "./Card";

import type React from "react";
import type { PendingProfilesStatus } from "../types";

interface ControlPanelProps {
  onDataUpdate: () => void;
  pendingStatus: PendingProfilesStatus | null;
  isAnyLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onDataUpdate,
  pendingStatus,
  isAnyLoading,
}) => {
  const [currentLoading, setCurrentLoading] = useState<string | null>(null);
  const [query, setQuery] = useState("javascript developer");
  const [limit, setLimit] = useState(5);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 7000);
  };

  const handleOperation = async (
    operation: () => Promise<any>,
    operationName: string,
    successMessage: string,
  ) => {
    setCurrentLoading(operationName);

    try {
      const response = await operation();
      if (response.success) {
        showMessage(successMessage, "success");
        onDataUpdate();
      } else {
        showMessage(
          `Error at "${operationName}": ${response.error || response.message || "Unknown error"}`,
          "error",
        );
      }
    } catch (error: any) {
      console.error(`Error at ${operationName}:`, error);
      showMessage(
        `Error at "${operationName}": ${error.error || error.message || "Check console."}`,
        "error",
      );
    } finally {
      setCurrentLoading(null);
    }
  };

  const handleCollectPeople = () => {
    handleOperation(
      () => torreApiService.collectPeople({ query, limit }),
      "Collect People",
      `People with query “${query}” (limit ${limit}) being collected.`,
    );
  };

  const handleCollectProfiles = () => {
    if (!pendingStatus || pendingStatus.pendingProfiles === 0) {
      showMessage("There are no pending profiles to collect.", "success");
      return;
    }
    handleOperation(
      () => torreApiService.collectPendingProfiles(),
      "Collect Pending Profiles",
      `Collection of ${pendingStatus.pendingProfiles} pending profiles started.`,
    );
  };

  const handleProcessProfiles = () => {
    handleOperation(
      () => torreApiService.processProfiles(),
      "Process Profiles",
      "Profile processing started.",
    );
  };

  return (
    <Card title="⚙ Pipeline Control Panel" className="sticky top-8">
      {/* 1. Collect People */}
      <div className="mb-6 border-b border-gray-700 pb-6">
        <h3 className="text-md font-semibold mb-3 text-text-light">
          1. Collect People from Torre API
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g.: python developer"
            className="flex-1 placeholder-dim"
            disabled={isAnyLoading}
          />
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Math.max(1, Number(e.target.value)))}
            min="1"
            max="50"
            className="w-16 placeholder-dim"
            disabled={isAnyLoading}
          />
        </div>
        <Button
          onClick={handleCollectPeople}
          loading={currentLoading === "Collect People"}
          disabled={!query.trim() || isAnyLoading}
          className="w-full"
        >
          Start Collecting People
        </Button>
      </div>

      {/* 2. Collect Pending Profiles */}
      <div className="mb-6 border-b border-gray-700 pb-6">
        <h3 className="text-md font-semibold mb-3 text-text-light">
          2. Collect Complete Profiles (Genomes)
        </h3>
        {pendingStatus && (
          <div className="text-sm text-text-dim mb-3">
            Status: {pendingStatus.totalProfiles} of {pendingStatus.totalPeople}{" "}
            profiles collected ({pendingStatus.completionRate}%).
            <span
              className={
                pendingStatus.pendingProfiles > 0
                  ? "text-yellow-400"
                  : "text-green-400"
              }
            >
              {" "}
              {pendingStatus.pendingProfiles} pending.
            </span>
          </div>
        )}
        <Button
          onClick={handleCollectProfiles}
          loading={currentLoading === "Collect Pending Profiles"}
          disabled={
            (pendingStatus?.pendingProfiles === 0 && pendingStatus !== null) ||
            isAnyLoading
          }
          variant={
            (pendingStatus?.pendingProfiles ?? 0) > 0 ? "primary" : "secondary"
          }
          className="w-full"
        >
          Collect {pendingStatus?.pendingProfiles ?? "..."} Pending Profiles
        </Button>
      </div>

      {/* 3. Process Collected Profiles */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3 text-text-light">
          3. Process Collected Profiles
        </h3>
        <Button
          onClick={handleProcessProfiles}
          loading={currentLoading === "Process Profiles"}
          disabled={isAnyLoading}
          variant="secondary"
          className="w-full"
        >
          Start Profile Processing
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === "error"
              ? "bg-red-900/30 border border-red-700 text-red-300"
              : "bg-green-900/30 border border-green-700 text-green-300"
          }`}
        >
          {message.text}
        </div>
      )}
    </Card>
  );
};
