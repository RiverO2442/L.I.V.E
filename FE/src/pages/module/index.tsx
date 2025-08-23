import React, { useEffect, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { navigatePath } from "../../utility/router-config";
import { ModuleService, ProgressService } from "../../service/service";

type Module = {
  id: string; // e.g. "healthy-eating"
  title: string;
  slug: string;
  summary: string;
  lessons: { id: string; title: string }[];
};

type Progress = {
  moduleId: string;
  progress: number;
  timeSpentMin: number;
};

const ModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);

  // Map ids → icons, UI classes, navigate paths
  const moduleUI: Record<
    string,
    { icon: string; class: string; path: string }
  > = {
    "healthy-eating": {
      icon: "🥗",
      class: "healthy-eating",
      path: navigatePath.eating,
    },
    "physical-activity": {
      icon: "🏃‍♀️",
      class: "physical-activity",
      path: navigatePath.activity,
    },
    "blood-glucose": {
      icon: "📊",
      class: "glucose-monitoring",
      path: navigatePath.glucose,
    },
    "recognising-symptoms": {
      icon: "⚠️",
      class: "symptoms",
      path: navigatePath.symptom,
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
        prog.forEach((p: any) => {
          progMap[p.moduleId] = p;
        });
        setProgress(progMap);
      } catch (err) {
        console.error("Failed to load modules:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Ripple + animation
  useEffect(() => {
    const animateProgressBars = () => {
      const bars = document.querySelectorAll<HTMLElement>(".progress-fill");
      bars.forEach((bar, index) => {
        const targetProgress = bar.getAttribute("data-progress");
        setTimeout(() => {
          if (targetProgress) bar.style.width = targetProgress + "%";
        }, index * 200 + 800);
      });
    };

    window.addEventListener("load", animateProgressBars);
  }, [modules]);

  return (
    <main>
      <div className="container">
        <section className="hero">
          <h1>Welcome to Your Health Journey</h1>
          <p>
            Learn, Improve, Visualise, and Empower yourself with comprehensive
            diabetes education tailored just for you.
          </p>
        </section>
        <div className="page-title">
          <h1>Your Learning Modules</h1>
          <p>
            Master diabetes self-management through interactive learning
            experiences designed just for you.
          </p>
        </div>
        {/* Stats (static for now) */}
        <div className="stats-summary">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <div className="stat-label">Completed Modules</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">0%</span>
              <div className="stat-label">Overall Progress</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <div className="stat-label">Hours Learning</div>
            </div>
          </div>
        </div>

        <div className="modules-grid">
          {loading ? (
            <p>Loading modules...</p>
          ) : (
            modules.map((mod) => {
              const ui = moduleUI[mod.slug] || {
                icon: "📘",
                class: "default",
                path: `/modules/${mod.slug}`,
              };
              const prog = progress[mod.slug];
              const pct = prog?.progress ?? 0;

              let buttonLabel = "Start";
              if (pct > 0 && pct < 100) buttonLabel = "Continue";
              if (pct === 100) buttonLabel = "Review";

              return (
                <div key={mod.id} className={`module-card ${ui.class}`}>
                  <div className="module-icon">{ui.icon}</div>
                  <h3>{mod.title}</h3>
                  <p>{mod.summary}</p>
                  <div className="progress-container">
                    <div className="progress-label">
                      <span>Progress</span>
                      <span className="progress-percentage">{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" data-progress={pct}></div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/${ui.path}`)}
                    className={`module-button ${
                      buttonLabel === "Start"
                        ? "start-button"
                        : buttonLabel === "Continue"
                        ? "continue-button"
                        : "review-button"
                    }`}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default ModulesPage;
