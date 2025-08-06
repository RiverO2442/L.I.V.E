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

interface ModuleData {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string[];
  progress: number;
  timeSpent: string;
  lastAccessed: string;
  quizAccuracy: number;
  gradientFrom: string;
  gradientTo: string;
}

const ProgressPage: React.FC = () => {
  const [animateProgress, setAnimateProgress] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const modulesData: ModuleData[] = [
    {
      id: "healthy-eating",
      title: "Healthy Eating",
      icon: <Apple size={32} className="text-white" />,
      description: [
        "Learn about balanced nutrition and meal planning",
        "Master carbohydrate counting and portion control",
      ],
      progress: 85,
      timeSpent: "22 mins",
      lastAccessed: "2 days ago",
      quizAccuracy: 89,
      gradientFrom: "#81C784",
      gradientTo: "#4CAF50",
    },
    {
      id: "physical-activity",
      title: "Physical Activity",
      icon: <Activity size={32} className="text-white" />,
      description: [
        "Discover safe exercise routines for diabetes",
        "Understand how activity affects blood sugar",
      ],
      progress: 45,
      timeSpent: "15 mins",
      lastAccessed: "5 days ago",
      quizAccuracy: 72,
      gradientFrom: "#4FC3F7",
      gradientTo: "#0288D1",
    },
    {
      id: "blood-glucose",
      title: "Blood Glucose Monitoring",
      icon: <Droplets size={32} className="text-white" />,
      description: [
        "Master blood sugar testing techniques",
        "Learn to interpret and respond to results",
      ],
      progress: 100,
      timeSpent: "28 mins",
      lastAccessed: "1 day ago",
      quizAccuracy: 94,
      gradientFrom: "#26A69A",
      gradientTo: "#00897B",
    },
    {
      id: "recognising-symptoms",
      title: "Recognising Symptoms",
      icon: <AlertCircle size={32} className="text-white" />,
      description: [
        "Identify early warning signs of complications",
        "Know when and how to seek medical help",
      ],
      progress: 30,
      timeSpent: "8 mins",
      lastAccessed: "1 week ago",
      quizAccuracy: 65,
      gradientFrom: "#FFC107",
      gradientTo: "#EF5350",
    },
  ];

  // Animate progress bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 500);

    // Staggered card animations
    const cardTimers: NodeJS.Timeout[] = [];
    modulesData.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleCards((prev) => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, 200 * index);
      cardTimers.push(timer);
    });

    return () => {
      clearTimeout(timer);
      cardTimers.forEach(clearTimeout);
    };
  }, []);

  const handleModuleClick = (moduleId: string, progress: number) => {
    if (progress === 100) {
      console.log(`Reviewing ${moduleId} module`);
      alert(`Opening ${moduleId} module for review...`);
    } else {
      console.log(`Continuing ${moduleId} module`);
      alert(`Continuing ${moduleId} module...`);
    }
  };

  const calculateSummaryStats = () => {
    const completed = modulesData.filter((m) => m.progress === 100).length;
    const totalMinutes = modulesData.reduce(
      (acc, m) => acc + parseInt(m.timeSpent),
      0
    );
    const avgAccuracy = Math.round(
      modulesData.reduce((acc, m) => acc + m.quizAccuracy, 0) /
        modulesData.length
    );
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

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {modulesData.map((module, index) => (
            <div
              key={module.id}
              className={`transform transition-all duration-700 ease-out ${
                visibleCards[index]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Card Header */}
                <div
                  className="px-6 py-8 text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${module.gradientFrom} 0%, ${module.gradientTo} 100%)`,
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        {module.icon}
                      </div>
                      <h2 className="text-2xl font-bold">{module.title}</h2>
                    </div>
                    <div className="space-y-1">
                      {module.description.map((line, i) => (
                        <p
                          key={i}
                          className="text-white text-opacity-90 text-sm"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {module.progress}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: animateProgress ? `${module.progress}%` : "0%",
                          background: `linear-gradient(90deg, ${module.gradientFrom}, ${module.gradientTo})`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock size={16} className="text-gray-500 mr-1" />
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {module.timeSpent}
                      </div>
                      <div className="text-xs text-gray-500">Time Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target size={16} className="text-gray-500 mr-1" />
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {module.quizAccuracy}%
                      </div>
                      <div className="text-xs text-gray-500">Quiz Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp size={16} className="text-gray-500 mr-1" />
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {module.lastAccessed}
                      </div>
                      <div className="text-xs text-gray-500">Last Access</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() =>
                      handleModuleClick(module.id, module.progress)
                    }
                    className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background:
                        module.progress === 100
                          ? `linear-gradient(135deg, ${module.gradientFrom}20 0%, ${module.gradientTo}20 100%)`
                          : `linear-gradient(135deg, ${module.gradientFrom} 0%, ${module.gradientTo} 100%)`,
                      color:
                        module.progress === 100 ? module.gradientTo : "white",
                      border:
                        module.progress === 100
                          ? `2px solid ${module.gradientTo}`
                          : "none",
                    }}
                  >
                    {module.progress === 100 ? (
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
          ))}
        </div>

        {/* Summary Section */}
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
                {stats.completed}/4
              </div>
              <div className="text-gray-600">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" size={28} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stats.totalMinutes}
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

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl shadow-lg p-8 text-center text-white">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">
            You're making great progress!
          </h3>
          <p className="text-lg opacity-90 mb-4">
            {stats.completed === 4
              ? "Congratulations! You've completed all modules. Keep reviewing to maintain your knowledge!"
              : `You've completed ${stats.completed} out of 4 modules. Keep going - you're doing amazing!`}
          </p>
          <div className="inline-flex items-center gap-2 bg-black/20 rounded-full px-6 py-3 backdrop-blur-sm cursor-pointer">
            <TrendingUp size={20} />
            <span className="font-semibold">Keep Learning!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
