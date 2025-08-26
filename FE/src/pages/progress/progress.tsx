import React, { useState, useEffect } from "react";
import {
  Apple,
  Activity,
  Droplets,
  AlertCircle,
  Clock,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { ModuleService, ProgressService } from "../../service/service";
import { useNavigate } from "react-router-dom";
import { navigatePath } from "../../utility/router-config";

interface Module {
  id: string;
  title: string;
  slug: string;
  summary: string;
}

interface Progress {
  moduleId: string;
  progress: number;
  timeSpentMin: number;
  lastAccessed?: string;
  quizAccuracy?: number;
  module?: { slug: string; title: string };
}

const ProgressPage: React.FC = () => {
  const [animateProgress, setAnimateProgress] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // UI config mapping (icons + gradients)
  const moduleUI: Record<
    string,
    {
      icon: React.ReactNode;
      gradientFrom: string;
      gradientTo: string;
    }
  > = {
    "healthy-eating": {
      icon: <Apple size={32} className="text-white" />,
      gradientFrom: "#81C784",
      gradientTo: "#4CAF50",
    },
    "physical-activity": {
      icon: <Activity size={32} className="text-white" />,
      gradientFrom: "#4FC3F7",
      gradientTo: "#0288D1",
    },
    "blood-glucose": {
      icon: <Droplets size={32} className="text-white" />,
      gradientFrom: "#26A69A",
      gradientTo: "#00897B",
    },
    "recognising-symptoms": {
      icon: <AlertCircle size={32} className="text-white" />,
      gradientFrom: "#FFC107",
      gradientTo: "#EF5350",
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const [mods, prog] = await Promise.all([
          ModuleService.list(),
          ProgressService.myProgress(),
        ]);

        setModules(mods);

        const progMap: Record<string, Progress> = {};
        prog.forEach((p: Progress) => {
          const slug = p.module?.slug || "";
          if (slug) progMap[slug] = p;
        });
        setProgress(progMap);

        // Prepare animation slots
        setVisibleCards(new Array(mods.length).fill(false));
      } catch (err) {
        console.error("Failed to load progress page:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Animate progress bars + stagger cards
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 500);

    const cardTimers: any[] = [];
    modules.forEach((_, index) => {
      const t = setTimeout(() => {
        setVisibleCards((prev) => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, 200 * index);
      cardTimers.push(t);
    });

    return () => {
      clearTimeout(timer);
      cardTimers.forEach(clearTimeout);
    };
  }, [modules]);

  const handleModuleClick = (slug: string) => {
    navigate(`/${slug}`);
  };

  const calculateSummaryStats = () => {
    if (modules.length === 0)
      return { completed: 0, totalMinutes: 0, avgAccuracy: 0 };
    const completed = modules.filter(
      (m) => progress[m.slug]?.progress === 100
    ).length;
    const totalMinutes = modules.reduce(
      (acc, m) => acc + (progress[m.slug]?.timeSpentMin || 0),
      0
    );
    const avgAccuracy =
      Math.round(
        modules.reduce(
          (acc, m) => acc + (progress[m.slug]?.quizAccuracy || 0),
          0
        ) / modules.length
      ) || 0;
    return { completed, totalMinutes, avgAccuracy };
  };

  const stats = calculateSummaryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🎯</span>
            Your Progress Overview
          </h1>
          <p className="text-xl text-gray-600">
            Track your journey through the L.I.V.E diabetes education modules
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {loading ? (
            <p>Loading progress...</p>
          ) : (
            modules.map((mod, index) => {
              const prog = progress[mod.slug] || {};
              const pct = prog.progress ?? 0;
              const ui = moduleUI[mod.slug] || {
                icon: <TrendingUp size={32} />,
                gradientFrom: "#ddd",
                gradientTo: "#aaa",
              };

              return (
                <div
                  key={mod.id}
                  className={`transform transition-all duration-700 ease-out ${
                    visibleCards[index]
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    {/* Header */}
                    <div
                      className="px-6 py-8 text-white relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${ui.gradientFrom} 0%, ${ui.gradientTo} 100%)`,
                      }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            {ui.icon}
                          </div>
                          <h2 className="text-2xl font-bold">{mod.title}</h2>
                        </div>
                        <p className="text-white text-opacity-90 text-sm">
                          {mod.summary}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Progress bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            {pct}%
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: animateProgress ? `${pct}%` : "0%",
                              background: `linear-gradient(90deg, ${ui.gradientFrom}, ${ui.gradientTo})`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <Clock
                            size={16}
                            className="text-gray-500 mx-auto mb-1"
                          />
                          <div className="text-lg font-bold text-gray-800">
                            {prog.timeSpentMin || 0}m
                          </div>
                          <div className="text-xs text-gray-500">
                            Time Spent
                          </div>
                        </div>
                        <div className="text-center">
                          <Target
                            size={16}
                            className="text-gray-500 mx-auto mb-1"
                          />
                          <div className="text-lg font-bold text-gray-800">
                            {prog.quizAccuracy || 0}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Quiz Accuracy
                          </div>
                        </div>
                        <div className="text-center">
                          <TrendingUp
                            size={16}
                            className="text-gray-500 mx-auto mb-1"
                          />
                          <div className="text-sm font-bold text-gray-800">
                            {prog.lastAccessed
                              ? new Date(prog.lastAccessed).toLocaleDateString()
                              : "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Last Access
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={() => handleModuleClick(mod.slug)}
                        className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background:
                            pct === 100
                              ? `linear-gradient(135deg, ${ui.gradientFrom}20 0%, ${ui.gradientTo}20 100%)`
                              : `linear-gradient(135deg, ${ui.gradientFrom} 0%, ${ui.gradientTo} 100%)`,
                          color: pct === 100 ? ui.gradientTo : "white",
                          border:
                            pct === 100 ? `2px solid ${ui.gradientTo}` : "none",
                        }}
                      >
                        {pct === 100 ? (
                          <span className="flex items-center justify-center gap-2">
                            <Trophy size={18} />
                            Review Module
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Activity size={18} />
                            Continue Learning
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Your Learning Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-white" size={28} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stats.completed}/{modules.length}
              </div>
              <div className="text-gray-600">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" size={28} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stats.totalMinutes}m
              </div>
              <div className="text-gray-600">Minutes Learned</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-white" size={28} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stats.avgAccuracy}%
              </div>
              <div className="text-gray-600">Average Quiz Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
