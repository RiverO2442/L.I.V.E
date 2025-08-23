import React, { useState, useEffect } from "react";
import {
  Heart,
  Target,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import ReusableModal from "../../../utility/modal";
import QuizPage from "../../quiz/quiz";

const PhysicalActivityModule = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  // Intersection Observer for scroll animations
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section
        id="hero"
        data-animate
        className={`relative overflow-hidden bg-gradient-to-r from-sky-400 to-indigo-500 py-16 transition-all duration-1000 ${
          visibleSections.has("hero")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div
            className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-32 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <span className="text-6xl">🏃‍♀️</span>
              {/* Motion trail effect */}
              <div className="absolute -right-2 top-2 flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
                <div
                  className="w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Physical Activity
          </h1>
          <p className="text-xl md:text-2xl font-light mb-6">
            Move Your Way to Better Health
          </p>
          <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section
          id="intro"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-200 ${
            visibleSections.has("intro")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Why Exercise Matters
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Regular physical activity is one of the most powerful tools
                  for managing diabetes. Exercise helps your muscles use glucose
                  more effectively, improves insulin sensitivity, and can
                  significantly lower your blood sugar levels.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Beyond glucose control, staying active strengthens your heart,
                  boosts energy, improves mood, and helps maintain a healthy
                  weight – all crucial for long-term diabetes management.
                </p>
              </div>

              <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl p-6">
                <h3 className="font-semibold text-indigo-800 mb-4">
                  Exercise Benefits:
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      icon: "📉",
                      text: "Lowers blood glucose",
                      color: "text-green-600",
                    },
                    {
                      icon: "💪",
                      text: "Improves insulin sensitivity",
                      color: "text-blue-600",
                    },
                    {
                      icon: "❤️",
                      text: "Strengthens heart health",
                      color: "text-red-500",
                    },
                    {
                      icon: "😊",
                      text: "Boosts mood & energy",
                      color: "text-yellow-600",
                    },
                    {
                      icon: "⚖️",
                      text: "Helps weight management",
                      color: "text-purple-600",
                    },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-lg">{benefit.icon}</span>
                      <span className={`text-sm font-medium ${benefit.color}`}>
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Motivational Quote */}
        <section
          id="quote"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-300 ${
            visibleSections.has("quote")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-gradient-to-r from-sky-400 to-indigo-500 rounded-2xl p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-4 left-8 text-4xl opacity-30">"</div>
            <div className="absolute bottom-4 right-8 text-4xl opacity-30">
              "
            </div>
            <blockquote className="text-xl md:text-2xl font-light italic mb-4">
              The groundwork for all happiness is good health
            </blockquote>
            <cite className="text-sky-100 text-sm">— Leigh Hunt</cite>
          </div>
        </section>

        {/* Types of Exercise */}
        <section
          id="exercise-types"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-400 ${
            visibleSections.has("exercise-types")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Types of Exercise
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Cardio",
                icon: "🚴‍♀️",
                description: "Aerobic activities that get your heart pumping",
                examples: ["Walking", "Swimming", "Cycling", "Dancing"],
                color: "from-sky-400 to-sky-500",
                bgColor: "from-sky-50 to-sky-100",
              },
              {
                title: "Strength Training",
                icon: "💪",
                description: "Building muscle to improve glucose uptake",
                examples: [
                  "Weight lifting",
                  "Resistance bands",
                  "Push-ups",
                  "Squats",
                ],
                color: "from-indigo-400 to-indigo-500",
                bgColor: "from-indigo-50 to-indigo-100",
              },
              {
                title: "Flexibility",
                icon: "🧘‍♀️",
                description: "Stretching and balance for overall wellness",
                examples: ["Yoga", "Tai Chi", "Stretching", "Pilates"],
                color: "from-purple-400 to-purple-500",
                bgColor: "from-purple-50 to-purple-100",
              },
            ].map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`bg-gradient-to-r ${type.bgColor} p-6 text-center`}
                >
                  <div className="text-4xl mb-3">{type.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {type.title}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="space-y-2">
                    {type.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${type.color} rounded-full`}
                        ></div>
                        <span className="text-sm text-gray-700">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Tips */}
        <section
          id="tips"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-500 ${
            visibleSections.has("tips")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Starting Safely
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Before You Begin:
                </h3>
                {[
                  {
                    icon: "👩‍⚕️",
                    text: "Consult your healthcare provider",
                    desc: "Get clearance, especially if you have complications",
                  },
                  {
                    icon: "🩸",
                    text: "Check blood glucose",
                    desc: "Test before, during, and after exercise",
                  },
                  {
                    icon: "👟",
                    text: "Wear proper footwear",
                    desc: "Protect your feet with supportive, well-fitting shoes",
                  },
                  {
                    icon: "💧",
                    text: "Stay hydrated",
                    desc: "Drink water before, during, and after activity",
                  },
                ].map((tip, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{tip.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{tip.text}</h4>
                      <p className="text-sm text-gray-600">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-l-4 border-red-400">
                <h3 className="text-lg font-semibold text-red-800 mb-4">
                  ⚠️ Stop Exercise If:
                </h3>
                <div className="space-y-2">
                  {[
                    "Blood glucose drops below 70 mg/dL",
                    "You feel dizzy or lightheaded",
                    "Experience chest pain or pressure",
                    "Have trouble breathing",
                    "Feel nauseous or extremely fatigued",
                  ].map((warning, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-700">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progressive Plan */}
        <section
          id="plan"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-600 ${
            visibleSections.has("plan")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Your 4-Week Progressive Plan
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  week: "Week 1",
                  title: "Getting Started",
                  activities: [
                    "10-min walks daily",
                    "Light stretching",
                    "Check glucose patterns",
                  ],
                  color: "from-green-400 to-green-500",
                },
                {
                  week: "Week 2",
                  title: "Building Habits",
                  activities: [
                    "15-min walks",
                    "Add basic strength",
                    "Monitor responses",
                  ],
                  color: "from-blue-400 to-blue-500",
                },
                {
                  week: "Week 3",
                  title: "Increasing Intensity",
                  activities: [
                    "20-min activities",
                    "2x strength training",
                    "Try new exercises",
                  ],
                  color: "from-purple-400 to-purple-500",
                },
                {
                  week: "Week 4",
                  title: "Full Routine",
                  activities: [
                    "30-min sessions",
                    "3x strength training",
                    "Plan next month",
                  ],
                  color: "from-indigo-400 to-indigo-500",
                },
              ].map((week, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`w-full h-2 bg-gradient-to-r ${week.color} rounded-full mb-4`}
                  ></div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">
                    {week.week}
                  </h3>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    {week.title}
                  </h4>
                  <div className="space-y-2">
                    {week.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">
                          {activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section
          id="quiz"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-700 ${
            visibleSections.has("quiz")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Knowledge Check
              </h2>
            </div>
            <button className="quiz-button" onClick={() => setModalOpen(true)}>
              Take Quiz 📝
            </button>
          </div>
        </section>

        {/* Continue Button */}
        <section
          id="continue"
          data-animate
          className={`text-center transition-all duration-1000 delay-800 ${
            visibleSections.has("continue")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <button className="group bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto">
            <span>Continue to Next Module</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Great progress! Keep up the momentum.
          </p>
        </section>
      </div>
      <ReusableModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <QuizPage
          onClose={() => {
            setModalOpen(false);
          }}
        />
      </ReusableModal>
    </div>
  );
};

export default PhysicalActivityModule;
