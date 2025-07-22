import React, { useEffect } from "react";
import "./styles.css";

const ProgressPage: React.FC = () => {
  useEffect(() => {
    const progressBars =
      document.querySelectorAll<HTMLElement>(".progress-fill");
    setTimeout(() => {
      progressBars.forEach((bar) => {
        const progress = bar.dataset.progress;
        if (progress) {
          bar.style.width = `${progress}%`;
        }
      });
    }, 500);
  }, []);

  const handleContinue = (moduleId: string) => {
    alert(`Continuing ${moduleId.replace("-", " ")} module...`);
  };

  const handleReview = (moduleId: string) => {
    alert(`Reviewing ${moduleId.replace("-", " ")} module...`);
  };

  const modules = [
    {
      id: "healthy-eating",
      icon: "🥗",
      title: "Healthy Eating",
      progress: 85,
      timeSpent: "22 mins",
      lastAccessed: "2 days ago",
      action: "Continue",
    },
    {
      id: "physical-activity",
      icon: "🏃‍♀️",
      title: "Physical Activity",
      progress: 60,
      timeSpent: "18 mins",
      lastAccessed: "1 week ago",
      action: "Continue",
    },
    {
      id: "glucose-monitoring",
      icon: "📊",
      title: "Blood Glucose Monitoring",
      progress: 100,
      timeSpent: "35 mins",
      lastAccessed: "3 days ago",
      action: "Review",
    },
    {
      id: "symptoms",
      icon: "⚠️",
      title: "Recognising Symptoms",
      progress: 30,
      timeSpent: "12 mins",
      lastAccessed: "5 days ago",
      action: "Continue",
    },
  ];

  return (
    <div className="dashboard-container w-[100%]">
      <h1 className="main-title">Your Progress Overview</h1>
      <div className="summary-section">
        <div className="summary-grid">
          <div className="summary-stat">
            <div className="summary-number">1</div>
            <div className="summary-label">Modules Completed</div>
          </div>
          <div className="summary-stat">
            <div className="summary-number">87</div>
            <div className="summary-label">Total Minutes</div>
          </div>
          <div className="summary-stat">
            <div className="summary-number">78%</div>
            <div className="summary-label">Average Quiz Accuracy</div>
          </div>
        </div>
      </div>
      <div className="motivational-message">
        You're making great progress! 🎉 Keep going!
      </div>
      <div className="progress-grid">
        {modules.map((module, idx) => (
          <div key={module.id} className="module-card">
            <div className="module-header">
              <div className="module-icon">{module.icon}</div>
              <div className="module-title">{module.title}</div>
            </div>
            <div className="progress-section">
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    data-progress={module.progress}
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <div className="progress-text">{module.progress}% Complete</div>
              </div>
            </div>
            <div className="module-stats">
              <div className="stat-item">
                <div className="stat-label">Time Spent</div>
                <div className="stat-value">{module.timeSpent}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Last Accessed</div>
                <div className="stat-value">{module.lastAccessed}</div>
              </div>
            </div>
            <button
              className={`action-btn ${
                module.action === "Review" ? "review-btn" : "continue-btn"
              }`}
              onClick={() =>
                module.action === "Review"
                  ? handleReview(module.id)
                  : handleContinue(module.id)
              }
            >
              {module.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPage;
