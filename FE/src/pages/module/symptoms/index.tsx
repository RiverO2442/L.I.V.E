import { CheckCircle, Phone, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { ModuleService, ProgressService } from "../../../service/service";
import ReusableModal from "../../../utility/modal";
import QuizMaterial from "../../../utility/quizMaterial/quizMaterial";
import QuizPage from "../../quiz/quiz";
import { formatDate } from "../../../utility/dateFormat";

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

const RecognisingSymptoms = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
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
          ModuleService.getBySlug("recognising-symptoms"),
          ProgressService.myProgress(),
        ]);
        setModule(mod);

        const prog = progAll.find(
          (p: any) => p.module?.slug === "recognising-symptoms"
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

  // Fixed intersection observer with robust approach
  useEffect(() => {
    if (loading || !module) return; // Don't run until module is loaded

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const sectionId = entry.target.id;
            if (sectionId) {
              setVisibleSections((prev) => {
                const newSet = new Set(prev);
                if (entry.isIntersecting) {
                  newSet.add(sectionId);
                }
                // Keep sections visible once they've been seen
                return newSet;
              });
            }
          });
        },
        {
          threshold: 0.15, // Trigger when 15% of element is visible
          rootMargin: "-20px 0px -20px 0px", // Add some margin for better UX
        }
      );

      // Use a more reliable way to get sections
      const sectionsToObserve = [
        "high-symptoms",
        "low-symptoms",
        "comparison",
        "emergency",
      ];

      // Add a small delay to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        sectionsToObserve.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            observer.observe(element);
          }
        });
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    } catch (error) {
      console.error("Error setting up intersection observer:", error);
    }
  }, [loading, module]); // Re-run when loading changes or module is loaded

  const getSeverityColor = (severity: any) => {
    switch (severity) {
      case "common":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "moderate":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "severe":
        return "bg-red-100 border-red-300 text-red-800";
      case "emergency":
        return "bg-red-200 border-red-400 text-red-900";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  if (loading) return <p className="p-6">Loading module...</p>;
  if (!module) return <p className="p-6">Module not found.</p>;

  const highBloodSugarSymptoms = [
    { id: "thirst", text: "Excessive thirst", icon: "🚰", severity: "common" },
    {
      id: "urination",
      text: "Frequent urination",
      icon: "🚻",
      severity: "common",
    },
    { id: "fatigue", text: "Extreme fatigue", icon: "😴", severity: "common" },
    { id: "blurred", text: "Blurred vision", icon: "👁️", severity: "moderate" },
    { id: "headache", text: "Headaches", icon: "🤕", severity: "moderate" },
    { id: "nausea", text: "Nausea/vomiting", icon: "🤢", severity: "severe" },
    {
      id: "breath",
      text: "Fruity breath odor",
      icon: "👃",
      severity: "severe",
    },
    { id: "confusion", text: "Confusion", icon: "😵", severity: "severe" },
  ];

  const lowBloodSugarSymptoms = [
    {
      id: "shaking",
      text: "Shakiness/trembling",
      icon: "🫨",
      severity: "common",
    },
    {
      id: "sweating",
      text: "Excessive sweating",
      icon: "💧",
      severity: "common",
    },
    { id: "hunger", text: "Sudden hunger", icon: "🍯", severity: "common" },
    {
      id: "dizziness",
      text: "Dizziness/lightheaded",
      icon: "😵‍💫",
      severity: "moderate",
    },
    {
      id: "irritable",
      text: "Irritability/mood changes",
      icon: "😤",
      severity: "moderate",
    },
    { id: "rapid", text: "Rapid heartbeat", icon: "❤️‍🔥", severity: "severe" },
    {
      id: "difficulty",
      text: "Difficulty concentrating",
      icon: "🤔",
      severity: "severe",
    },
    {
      id: "unconscious",
      text: "Loss of consciousness",
      icon: "😵",
      severity: "emergency",
    },
  ];

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
              Learn to recognise high and low blood sugar symptoms Master the
              fundamentals of glucose tracking
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* High Blood Sugar Symptoms */}
            <section
              id="high-symptoms"
              data-animate
              className={`transition-all duration-1000 delay-200 ${
                visibleSections.has("high-symptoms")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      High Blood Sugar Symptoms
                    </h2>
                    <p className="text-gray-600">Hyperglycemia warning signs</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {highBloodSugarSymptoms.map((symptom, index) => (
                    <div
                      key={symptom.id}
                      className={`border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-md ${getSeverityColor(
                        symptom.severity
                      )}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{symptom.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold">{symptom.text}</h3>
                          <span className="text-xs opacity-75 capitalize">
                            {symptom.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Low Blood Sugar Symptoms */}
            <section
              id="low-symptoms"
              data-animate
              className={`transition-all duration-1000 delay-300 ${
                visibleSections.has("low-symptoms")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      Low Blood Sugar Symptoms
                    </h2>
                    <p className="text-gray-600">Hypoglycemia warning signs</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowBloodSugarSymptoms.map((symptom, index) => (
                    <div
                      key={symptom.id}
                      className={`border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-md ${getSeverityColor(
                        symptom.severity
                      )}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{symptom.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold">{symptom.text}</h3>
                          <span className="text-xs opacity-75 capitalize">
                            {symptom.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Symptom Comparison Grid */}
            <section
              id="comparison"
              data-animate
              className={`transition-all duration-1000 delay-400 ${
                visibleSections.has("comparison")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
                  Quick Comparison
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-l-4 border-red-400">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-red-600" />
                      <h3 className="text-xl font-bold text-red-800">
                        High Blood Sugar
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-red-700">
                        <strong>Key signs:</strong> Thirst, frequent urination,
                        fatigue
                      </p>
                      <p className="text-red-700">
                        <strong>Timeline:</strong> Develops gradually over
                        hours/days
                      </p>
                      <p className="text-red-700">
                        <strong>Action:</strong> Check glucose, hydrate, contact
                        doctor
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-l-4 border-amber-400">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingDown className="w-6 h-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-amber-800">
                        Low Blood Sugar
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-amber-700">
                        <strong>Key signs:</strong> Shaking, sweating, hunger
                      </p>
                      <p className="text-amber-700">
                        <strong>Timeline:</strong> Develops quickly over minutes
                      </p>
                      <p className="text-amber-700">
                        <strong>Action:</strong> 15g fast carbs, retest in 15
                        min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* When to Seek Help */}
            <section
              id="emergency"
              data-animate
              className={`transition-all duration-1000 delay-500 ${
                visibleSections.has("emergency")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <Phone className="w-8 h-8" />
                  <h2 className="text-2xl md:text-3xl font-bold">
                    When to Seek Immediate Help
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      🚨 Call 911 if experiencing:
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Loss of consciousness</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Severe confusion or disorientation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Difficulty breathing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Persistent vomiting</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      📞 Contact your doctor if:
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>{`Blood glucose consistently > 250 mg/dL`}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Frequent hypoglycemic episodes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Symptoms don't improve with treatment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>Any concerning changes in symptoms</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Lessons */}
            <div className="lessons-section">
              <h3 className="mb-4 font-bold text-lg">Lessons</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {module.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`p-4 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                      selectedLesson?.id === lesson.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-amber-400"
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

            {/* Study Material */}
            {selectedLesson && (
              <QuizMaterial
                category="symptoms"
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

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
              <h3 className="font-semibold text-gray-800 mb-2">
                Important Reminder
              </h3>
              <p className="text-sm text-gray-600">
                This information is educational only. Always consult your
                healthcare provider for personalised advice.
              </p>
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

export default RecognisingSymptoms;
