import React, { useEffect } from "react";
import "./styles.css";

const AboutPage = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".section").forEach((section) => {
      observer.observe(section);
    });

    const cards = document.querySelectorAll(
      ".value-card, .team-card, .tech-card"
    );
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        (card as HTMLElement).style.transform = "translateY(-10px) scale(1.02)";
      });
      card.addEventListener("mouseleave", () => {
        (card as HTMLElement).style.transform = "translateY(0) scale(1)";
      });
    });

    const onScroll = () => {
      const scrolled = window.pageYOffset;
      const heroSection = document.querySelector(
        ".hero-section"
      ) as HTMLElement;
      if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const exploreModules = () => {
    alert("Redirecting to learning modules...");
  };

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">L.I.V.E</h1>
            <p className="hero-subtitle">Diabetes Education Platform</p>
            <p className="hero-acronym">
              Learn • Improve • Visualise • Empower
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">About L.I.V.E</h2>
          <div className="about-content">
            <p>
              L.I.V.E is an innovative interactive educational platform designed
              specifically for individuals living with diabetes...
            </p>
          </div>
        </div>
      </section>

      <section className="section mission-section">
        <div className="container">
          <h2 className="section-title">Our Mission</h2>
          <div className="mission-content">
            <p>
              Our mission is to revolutionize diabetes education by making
              management accessible, engaging, and effective for everyone...
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">📚</span>
              <h3 className="value-title">Learn</h3>
              <p className="value-description">
                Access comprehensive, evidence-based educational content...
              </p>
            </div>
            <div className="value-card">
              <span className="value-icon">📈</span>
              <h3 className="value-title">Improve</h3>
              <p className="value-description">
                Track your progress, build healthy habits...
              </p>
            </div>
            <div className="value-card">
              <span className="value-icon">📊</span>
              <h3 className="value-title">Visualise</h3>
              <p className="value-description">
                Transform complex health data into clear insights...
              </p>
            </div>
            <div className="value-card">
              <span className="value-icon">💪</span>
              <h3 className="value-title">Empower</h3>
              <p className="value-description">
                Build confidence and independence in diabetes management...
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Meet the Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">AD</div>
              <h3 className="team-name">Alex Developer</h3>
              <p className="team-title">Lead Developer</p>
            </div>
            <div className="team-card">
              <div
                className="team-avatar"
                style={{
                  background: "linear-gradient(135deg, #ed8936, #f6ad55)",
                }}
              >
                SD
              </div>
              <h3 className="team-name">Sam Designer</h3>
              <p className="team-title">UI/UX Designer</p>
            </div>
            <div className="team-card">
              <div
                className="team-avatar"
                style={{
                  background: "linear-gradient(135deg, #9f7aea, #b794f6)",
                }}
              >
                MH
              </div>
              <h3 className="team-name">Dr. Maria Health</h3>
              <p className="team-title">Health Advisor</p>
            </div>
            <div className="team-card">
              <div
                className="team-avatar"
                style={{
                  background: "linear-gradient(135deg, #e53e3e, #fc8181)",
                }}
              >
                JM
              </div>
              <h3 className="team-name">Jordan Manager</h3>
              <p className="team-title">Project Manager</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tech-section">
        <div className="container">
          <h2 className="section-title">Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">⚛️</div>
              <div className="tech-name">React</div>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🟢</div>
              <div className="tech-name">Node.js</div>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🐘</div>
              <div className="tech-name">PostgreSQL</div>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🐙</div>
              <div className="tech-name">GitHub</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Start Your Journey Today</h2>
          <p className="cta-description">
            Join thousands of users who are taking control of their diabetes
            management...
          </p>
          <button className="cta-button" onClick={exploreModules}>
            Explore Modules
          </button>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
