import {
  CheckCircle,
  Clock,
  Phone,
  RotateCcw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ModuleService, ProgressService } from "../../../service/service";
import ReusableModal from "../../../utility/modal";
import QuizMaterial from "../../../utility/quizMaterial/quizMaterial";
import QuizPage from "../../quiz/quiz";

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
  const [checkedSymptoms, setCheckedSymptoms] = useState(new Set());
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

  // Intersection animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleSymptomCheck = (symptomId: string) => {
    setCheckedSymptoms((prev) => {
      const newSet = new Set(prev);
      newSet.has(symptomId) ? newSet.delete(symptomId) : newSet.add(symptomId);
      return newSet;
    });
  };

  const resetChecklist = () => setCheckedSymptoms(new Set());

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
    <div
      className="min-h-screen bg-gray-50"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      {/* Progress Indicator */}
      {/* <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Module 3 of 4</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-red-400 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">75%</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Hero Section */}
      <section
        id="hero"
        data-animate
        className={`relative overflow-hidden transition-all duration-1000 ${
          visibleSections.has("hero")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* Fading alert background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-orange-50 to-transparent opacity-60"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-16 h-16 bg-amber-200 rounded-full opacity-30 animate-pulse"></div>
          <div
            className="absolute top-20 right-20 w-12 h-12 bg-red-200 rounded-full opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-8 h-8 bg-orange-200 rounded-full opacity-25 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-red-400 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
              ⚠️
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Recognising Symptoms
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Learn to identify the warning signs of high and low blood sugar to
            take action quickly
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-red-400 mx-auto rounded-full"></div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
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
                    <strong>Action:</strong> 15g fast carbs, retest in 15 min
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

        {/* Interactive Checklist */}
        <section
          id="checklist"
          data-animate
          className={`transition-all duration-1000 delay-600 ${
            visibleSections.has("checklist")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-red-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Personal Symptom Tracker
                  </h2>
                  <p className="text-gray-600">
                    Check symptoms you've experienced
                  </p>
                </div>
              </div>
              <button
                onClick={resetChecklist}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">Reset</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-4">
                  High Blood Sugar Symptoms
                </h3>
                <div className="space-y-2">
                  {highBloodSugarSymptoms.map((symptom) => (
                    <label
                      key={symptom.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checkedSymptoms.has(symptom.id)}
                        onChange={() => handleSymptomCheck(symptom.id)}
                        className="w-5 h-5 text-red-500 rounded focus:ring-red-400"
                      />
                      <span className="text-lg">{symptom.icon}</span>
                      <span
                        className={`${
                          checkedSymptoms.has(symptom.id)
                            ? "text-red-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {symptom.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-700 mb-4">
                  Low Blood Sugar Symptoms
                </h3>
                <div className="space-y-2">
                  {lowBloodSugarSymptoms.map((symptom) => (
                    <label
                      key={symptom.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-amber-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checkedSymptoms.has(symptom.id)}
                        onChange={() => handleSymptomCheck(symptom.id)}
                        className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                      />
                      <span className="text-lg">{symptom.icon}</span>
                      <span
                        className={`${
                          checkedSymptoms.has(symptom.id)
                            ? "text-amber-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {symptom.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {checkedSymptoms.size > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  <strong>
                    You've checked {checkedSymptoms.size} symptoms.
                  </strong>
                  {checkedSymptoms.size >= 3 &&
                    " Consider discussing these with your healthcare provider."}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Lessons</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedLesson?.id === lesson.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-400"
                  }`}
                >
                  {lesson.title}
                </div>
              ))}
            </div>
            {selectedLesson && (
              <p className="mt-2 text-sm text-amber-700">
                Selected: {selectedLesson.title}
              </p>
            )}
          </div>
        </section>

        {/* Materials */}
        {selectedLesson && (
          <QuizMaterial
            category="symptoms"
            slug={module.slug}
            lessonId={selectedLesson.id}
          />
        )}

        {/* Quiz */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-red-400 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Scenario Quiz
              </h2>
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
        </section>
      </div>
      {/* Modal */}
      {selectedLesson && (
        <ReusableModal open={modalOpen} onClose={() => setModalOpen(false)}>
          <QuizPage
            slug="recognising-symptoms"
            lessonId={selectedLesson.id}
            onClose={() => setModalOpen(false)}
          />
        </ReusableModal>
      )}
    </div>
  );
};

export default RecognisingSymptoms;
