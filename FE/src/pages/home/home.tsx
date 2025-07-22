import React, { useEffect } from "react";
import "./styles.css";

const HomePage: React.FC = () => {
  useEffect(() => {
    const navLinks = document.getElementById("navLinks");
    const mobileMenu = document.getElementById("mobileMenu");
    const buttons = document.querySelectorAll(".module-button");

    mobileMenu?.addEventListener("click", () => {
      navLinks?.classList.toggle("active");
      if (mobileMenu) {
        mobileMenu.style.transform = navLinks?.classList.contains("active")
          ? "rotate(90deg)"
          : "rotate(0deg)";
      }
    });

    const moduleButtons =
      document.querySelectorAll<HTMLButtonElement>(".module-button");

    mobileMenu?.addEventListener("click", function () {
      navLinks?.classList.toggle("active");
      const rotation = navLinks?.classList.contains("active")
        ? "rotate(90deg)"
        : "rotate(0deg)";
      (this as HTMLElement).style.transform = rotation;
    });

    moduleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);

        const ripple = document.createElement("span");
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255,255,255,0.3)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple 0.6s linear";
        ripple.style.left = "50%";
        ripple.style.top = "50%";
        ripple.style.width = ripple.style.height = "100px";
        ripple.style.marginLeft = ripple.style.marginTop = "-50px";

        this.appendChild(ripple);
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

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

    const cards = document.querySelectorAll<HTMLElement>(".module-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.borderColor = "rgba(52, 152, 219, 0.3)";
      });
      card.addEventListener("mouseleave", function () {
        this.style.borderColor = "rgba(52, 152, 219, 0.1)";
      });
    });
  }, []);

  return (
    <div>
      <main>
        <div className="container">
          <section className="hero">
            <h1>Welcome to Your Health Journey</h1>
            <p>
              Learn, Improve, Visualise, and Empower yourself with comprehensive
              diabetes education tailored just for you.
            </p>
            <button className="cta-button">Start Learning</button>
          </section>
          <div className="modules-grid">
            {[
              {
                icon: "🥗",
                title: "Healthy Eating",
                desc: "Discover nutritious meal planning, carbohydrate counting, and how different foods affect your blood sugar levels.",
                progress: 75,
                class: "healthy-eating",
                button: "Continue",
                buttonClass: "continue-button",
              },
              {
                icon: "🏃‍♀️",
                title: "Physical Activity",
                desc: "Learn safe exercise routines, activity planning strategies, and how physical movement helps manage your diabetes.",
                progress: 45,
                class: "physical-activity",
                button: "Continue",
                buttonClass: "continue-button",
              },
              {
                icon: "📊",
                title: "Blood Glucose Monitoring",
                desc: "Master blood sugar testing techniques, understand your readings, and learn to track patterns effectively.",
                progress: 100,
                class: "glucose-monitoring",
                button: "Review",
                buttonClass: "review-button",
              },
              {
                icon: "⚠️",
                title: "Recognising Symptoms",
                desc: "Identify warning signs of complications, understand when to seek medical help, and manage emergency situations.",
                progress: 0,
                class: "symptoms",
                button: "Start",
                buttonClass: "start-button",
              },
            ].map((mod, i) => (
              <div key={i} className={`module-card ${mod.class}`}>
                <div className="module-icon">{mod.icon}</div>
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span className="progress-percentage">{mod.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      data-progress={mod.progress}
                    ></div>
                  </div>
                </div>
                <button className={`module-button ${mod.buttonClass}`}>
                  {mod.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
