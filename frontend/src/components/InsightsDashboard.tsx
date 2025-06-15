import { Card } from "./Card";
import { LoadingSpinner } from "./LoadingSpinner";
import type { Insights, DataStats } from "../types";
import type React from "react";

interface InsightsDashboardProps {
  insights: Insights | null;
  stats: DataStats | null;
  loading: boolean;
}

export const InsightsDashboard: React.FC<InsightsDashboardProps> = ({
  insights,
  stats,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading insights..." />
      </div>
    );
  }

  if (!insights || !stats) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          No data available
        </h3>
        <p className="text-gray-500">
          Collect some data first to see the insights
        </p>
      </div>
    );
  }

  const {
    topSkills,
    languageDistribution,
    seniorityDistribution,
    topProfiles,
  } = insights;

  return (
    <div className="space-y-6">
      {/* Main metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-secondary rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {stats.totalPeople}
          </div>
          <div className="text-sm text-gray-400">People</div>
        </div>
        <div className="bg-secondary rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {stats.totalProfiles}
          </div>
          <div className="text-sm text-gray-400">Profiles</div>
        </div>
        <div className="bg-secondary rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {stats.verificationRate}%
          </div>
          <div className="text-sm text-gray-400">Verified</div>
        </div>
        <div className="bg-secondary rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats.averageCompletion}%
          </div>
          <div className="text-sm text-gray-400">Completion</div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <Card title="🚀 Top Demanded Skills">
          {topSkills.length > 0 ? (
            <div className="space-y-3">
              {topSkills.slice(0, 8).map((skill, index) => (
                <div
                  key={skill.skill}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-black text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white">{skill.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{
                          width: `${(skill.count / topSkills[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-accent font-semibold text-sm w-6">
                      {skill.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No skills found</p>
          )}
        </Card>

        {/* Language Distribution */}
        <Card title="🌍 Language Distribution">
          {languageDistribution.length > 0 ? (
            <div className="space-y-3">
              {languageDistribution.slice(0, 6).map((lang, index) => (
                <div
                  key={lang.language}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent-dark rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white">{lang.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-accent-dark h-2 rounded-full"
                        style={{
                          width: `${(lang.count / languageDistribution[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-accent-dark font-semibold text-sm w-6">
                      {lang.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No languages found</p>
          )}
        </Card>

        {/* Seniority Distribution */}
        <Card title="👨 Seniority Distribution">
          <div className="space-y-4">
            {Object.entries(seniorityDistribution).map(([level, count]) => {
              const total = Object.values(seniorityDistribution).reduce(
                (a, b) => a + b,
                0,
              );
              const percentage =
                total > 0 ? Math.round((count / total) * 100) : 0;

              const levelLabels: Record<string, string> = {
                junior: "Junior",
                mid: "Mid-level",
                senior: "Senior",
                lead: "Lead",
              };

              const levelColors: Record<string, string> = {
                junior: "bg-blue-500",
                mid: "bg-yellow-500",
                senior: "bg-green-500",
                lead: "bg-purple-500",
              };

              return (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white">{levelLabels[level]}</span>
                    <span className="text-accent font-semibold">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${levelColors[level]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Profiles */}
        <Card title="🏆 Top Profiles (Completion Score)">
          {topProfiles.length > 0 ? (
            <div className="space-y-4">
              {topProfiles.slice(0, 5).map((profile, index) => (
                <div
                  key={profile.username}
                  className="flex items-center gap-3 p-3 bg-primary rounded-lg border border-gray-700"
                >
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-black font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {profile.name}
                    </div>
                    <div className="text-gray-400 text-sm truncate">
                      @{profile.username}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-accent font-bold">
                      {profile.completion}%
                    </div>
                    {profile.verified && (
                      <div className="text-green-400 text-xs">✓ Verified</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No profiles found</p>
          )}
        </Card>
      </div>

      {/* Data Quality */}
      <Card title="📈 Data Quality">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {stats.processingRate}%
            </div>
            <div className="text-sm text-gray-400">Processing Rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-accent h-2 rounded-full"
                style={{ width: `${stats.processingRate}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stats.verificationRate}%
            </div>
            <div className="text-sm text-gray-400">Verification Rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{ width: `${stats.verificationRate}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {stats.averageCompletion}%
            </div>
            <div className="text-sm text-gray-400">Average Completion</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: `${stats.averageCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
