import React, { useEffect, useState } from "react";
import "./styles.css";
import ReusableModal from "../../../utility/modal";
import QuizPage from "../../quiz/quiz";
import { ModuleService, ProgressService } from "../../../service/service";
import QuizMaterial from "../../../utility/quizMaterial/quizMaterial";

interface Module {
  id: string;
  slug: string;
  title: string;
  summary: string;
  lessons: { id: string; title: string }[];
}

interface Progress {
  moduleId: string;
  progress: number;
  timeSpentMin: number;
  quizAccuracy?: number;
  lastAccessed?: string;
}

const HealthyEatingModule: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<
    Module["lessons"][0] | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        const [mod, progAll] = await Promise.all([
          ModuleService.getBySlug("healthy-eating"),
          ProgressService.myProgress(),
        ]);

        setModule(mod);

        const prog = progAll.find(
          (p: any) => p.module?.slug === "healthy-eating"
        );
        setProgress(prog || null);
      } catch (err) {
        console.error("Failed to load module:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (progress) {
      const bar = document.querySelector(".progress-fill") as HTMLElement;
      if (bar) {
        setTimeout(() => {
          bar.style.width = `${progress.progress}%`;
        }, 800);
      }
    }
  }, [progress]);

  if (loading) return <p className="p-6">Loading module...</p>;
  if (!module) return <p className="p-6">Module not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl">
            🥗
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
            <p className="text-gray-600 text-sm">
              Master the fundamentals of your meal
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video */}
            <div className="video-section">
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="play-button">▶</div>
                  <p>Introduction to {module.title}</p>
                  <small>Duration: 12:45</small>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="summary-section">
              <h3>Learning Objectives</h3>
              <ul className="learning-objectives">
                <li>
                  Understand how different foods affect blood sugar levels and
                  make informed dietary choices.
                </li>
                <li>
                  Master carbohydrate counting and portion control strategies
                  for better glucose management.
                </li>
                <li>
                  Create balanced meal plans that incorporate all food groups.
                </li>
                <li>
                  Learn to read nutrition labels effectively and spot hidden
                  sugars.
                </li>
                <li>
                  Develop practical skills for dining out and social eating.
                </li>
              </ul>
            </div>

            {/* Lessons */}
            <div className="lessons-section">
              <h3 className="mb-4 font-bold text-lg">Lessons</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      selectedLesson?.id === lesson.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-400"
                    }`}
                  >
                    <h4 className="font-medium">{lesson.title}</h4>
                  </div>
                ))}
              </div>
              {selectedLesson && (
                <p className="text-sm text-teal-700 mt-2">
                  Selected lesson: {selectedLesson.title}
                </p>
              )}
            </div>

            {/* Study Materials */}
            {selectedLesson && (
              <QuizMaterial
                category="healthyEating"
                slug={module.slug}
                lessonId={selectedLesson.id}
              />
            )}

            {/* Progress + Quiz */}
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-title">Module Progress</span>
                <span className="progress-percentage">
                  {progress ? `${progress.progress}%` : "0%"}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress?.progress || 0}%` }}
                ></div>
              </div>
            </div>

            {selectedLesson && (
              <button
                className="quiz-button"
                onClick={() => setModalOpen(true)}
              >
                Take Quiz for {selectedLesson.title} 📝
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="info-card">
              <h4>Module Details</h4>
              <div className="info-item">
                <div className="info-icon time-icon">🕐</div>
                <div className="info-content">
                  <div className="info-label">Estimated Time</div>
                  <div className="info-value">45 minutes</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon access-icon">📅</div>
                <div className="info-content">
                  <div className="info-label">Last Accessed</div>
                  <div className="info-value">
                    {progress?.lastAccessed || "Never"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  ⚕️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Important Reminder
                  </h3>
                  <p className="text-sm text-gray-600">
                    This information is educational only. Always consult your
                    healthcare provider for personalized advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Quiz */}
        {selectedLesson && (
          <ReusableModal open={modalOpen} onClose={() => setModalOpen(false)}>
            <QuizPage
              slug={module.slug}
              lessonId={selectedLesson.id}
              onClose={() => setModalOpen(false)}
            />
          </ReusableModal>
        )}
      </div>
    </div>
  );
};

export default HealthyEatingModule;
