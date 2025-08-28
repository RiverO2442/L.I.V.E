import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ModuleService, ProgressService } from "../../../service/service";
import ReusableModal from "../../../utility/modal";
import QuizPage from "../../quiz/quiz";
import QuizMaterial from "../../../utility/quizMaterial/quizMaterial";
import { formatDate } from "../../../utility/dateFormat";

interface Module {
  id: string;
  slug: string;
  title: string;
  summary: string;
  lessons: { id: string; title: string; completed?: boolean }[];
}

interface Progress {
  moduleId: string;
  progress: number;
  timeSpentMin: number;
  quizAccuracy?: number;
  lastAccessed?: string;
  completed?: boolean;
}

const BloodGlucoseMonitoring: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<
    Module["lessons"][0] | null
  >(null);

  // Fetch module + progress
  useEffect(() => {
    (async () => {
      try {
        const [mod, progAll] = await Promise.all([
          ModuleService.getBySlug("blood-glucose"),
          ProgressService.myProgress(),
        ]);

        setModule(mod);
        const prog = progAll.find(
          (p: any) => p.module?.slug === "blood-glucose"
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
            📊
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
            <p className="text-gray-600 text-sm">
              Master the fundamentals of glucose tracking
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Lessons */}
            <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Why Monitoring Matters
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Regular blood glucose monitoring is your window into how
                    your body responds to food, exercise, stress, and
                    medication. It empowers you to make informed decisions and
                    maintain optimal health.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                      Better Control
                    </span>
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                      Prevent Complications
                    </span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                      Peace of Mind
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Target Range: 80-130 mg/dL
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Reduces HbA1c by 0.5-1%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Protects vital organs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* When & How to Test */}
            <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  When & How to Test
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    time: "Fasting",
                    icon: "🌅",
                    desc: "Before breakfast",
                    color: "from-orange-400 to-orange-500",
                  },
                  {
                    time: "Pre-meal",
                    icon: "🍽️",
                    desc: "Before eating",
                    color: "from-blue-400 to-blue-500",
                  },
                  {
                    time: "Post-meal",
                    icon: "⏰",
                    desc: "2 hours after",
                    color: "from-green-400 to-green-500",
                  },
                  {
                    time: "Bedtime",
                    icon: "🌙",
                    desc: "Before sleep",
                    color: "from-purple-400 to-purple-500",
                  },
                ].map((item, index) => (
                  <div key={index} className="group">
                    <div
                      className={`bg-gradient-to-r ${item.color} rounded-lg p-4 text-white text-center transform group-hover:scale-105 transition-transform duration-200`}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold">{item.time}</h3>
                      <p className="text-xs opacity-90">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Testing Steps:
                </h3>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Wash hands thoroughly with soap and water</li>
                  <li>2. Insert test strip into glucose meter</li>
                  <li>3. Use lancet to prick side of fingertip</li>
                  <li>4. Apply blood drop to test strip</li>
                  <li>5. Record result in your logbook or app</li>
                </ol>
              </div>
            </section>

            {/* Understanding Results */}
            <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Understanding Your Results
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-red-100 to-red-200 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-red-800">
                      Low (Hypoglycemia)
                    </h3>
                    <p className="text-red-700 text-sm">Below 70 mg/dL</p>
                    <p className="text-xs text-red-600 mt-1">
                      Immediate action needed
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-green-200 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-green-800">
                      Target Range
                    </h3>
                    <p className="text-green-700 text-sm">
                      80-130 mg/dL (fasting)
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Great control!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-100 to-orange-200 border-l-4 border-orange-500 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-orange-800">
                      High (Hyperglycemia)
                    </h3>
                    <p className="text-orange-700 text-sm">Above 180 mg/dL</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Review treatment plan
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-50 rounded-lg p-4">
                  <h3 className="font-semibold text-cyan-800 mb-2">
                    Post-Meal Targets:
                  </h3>
                  <p className="text-cyan-700 text-sm">
                    Less than 180 mg/dL (2 hours after eating)
                  </p>
                </div>
              </div>
            </section>

            {/* Danger Signs */}
            <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Recognize Danger Signs
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-red-200 rounded-lg p-6 hover:border-red-300 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      📉
                    </div>
                    <h3 className="font-semibold text-red-800">
                      Hypoglycemia (Low)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      "🥶 Shakiness, sweating",
                      "😵 Dizziness, confusion",
                      "❤️ Rapid heartbeat",
                      "😤 Irritability, anxiety",
                      "🍯 Intense hunger",
                    ].map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <span>{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-orange-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      📈
                    </div>
                    <h3 className="font-semibold text-orange-800">
                      Hyperglycemia (High)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      "🚰 Excessive thirst",
                      "🚻 Frequent urination",
                      "😴 Fatigue, weakness",
                      "👁️ Blurred vision",
                      "🤢 Nausea, vomiting",
                    ].map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <span>{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* How to Respond */}
            <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Quick Response Guide
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-4">
                    For LOW Blood Sugar:
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: "🍯", text: "Consume 15g fast-acting carbs" },
                      { icon: "⏱️", text: "Wait 15 minutes" },
                      { icon: "🩸", text: "Retest blood glucose" },
                      { icon: "🔄", text: "Repeat if still below 70 mg/dL" },
                      {
                        icon: "🍽️",
                        text: "Eat a snack if meal is >1 hour away",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-gray-700">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-4">
                    For HIGH Blood Sugar:
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: "💧", text: "Drink plenty of water" },
                      { icon: "💊", text: "Take prescribed medication" },
                      { icon: "🚶", text: "Light exercise if feeling well" },
                      { icon: "🩸", text: "Monitor ketones if >250 mg/dL" },
                      { icon: "🏥", text: "Contact healthcare provider" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-gray-700">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <div className="lessons-section">
              <h3 className="mb-4 font-bold text-lg">Lessons</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`p-4 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                      selectedLesson?.id === lesson.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-400"
                    }`}
                  >
                    <h4 className="font-medium">{lesson.title}</h4>
                    {lesson.completed && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Study Material for selected lesson */}
            {selectedLesson && (
              <QuizMaterial
                category="bloodGlucose"
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
                <div className="info-icon">🕐</div>
                <div className="info-content">
                  <div className="info-label">Estimated Time</div>
                  <div className="info-value">45 minutes</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <div className="info-label">Last Accessed</div>
                  <div className="info-value">
                    {(progress && formatDate(progress.lastAccessed)) || "Never"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
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
  );
};

export default BloodGlucoseMonitoring;
