import React, { useEffect, useState } from "react";
import "./styles.css";
import BasicModal from "../../../utility/modal";
import ReusableModal from "../../../utility/modal";
import QuizPage from "../../quiz/quiz";

const HealthyEatingModule: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const progressFill = document.querySelector(
      ".progress-fill"
    ) as HTMLElement;
    setTimeout(() => {
      if (progressFill) progressFill.style.width = "75%";
    }, 800);

    const quizButton = document.querySelector(".quiz-button") as HTMLElement;
    quizButton?.addEventListener("click", () => {
      quizButton.style.transform = "translateY(-1px) scale(0.98)";
      setTimeout(() => {
        quizButton.style.transform = "";
      }, 150);
    });

    const playButton = document.querySelector(".play-button") as HTMLElement;
    playButton?.addEventListener("click", () => {
      playButton.style.transform = "scale(0.9)";
      setTimeout(() => {
        playButton.style.transform = "scale(1.1)";
      }, 150);
    });
  }, []);

  return (
    <div className="detail-container">
      <div className="detail-main-content">
        <div className="flex gap-[1rem] pt-[12px] justify-start items-center">
          <div className="module-icon">🥗</div>
          <h1 className="module-title">Healthy Eating</h1>
        </div>

        <div className="video-section">
          <div className="video-container">
            <div className="video-placeholder">
              <div className="play-button">▶</div>
              <p>Introduction to Healthy Eating for Diabetes</p>
              <small>Duration: 12:45</small>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>Learning Objectives</h3>
          <ul className="learning-objectives">
            <li>
              Understand how different foods affect blood sugar levels and learn
              to make informed dietary choices.
            </li>
            <li>
              Master carbohydrate counting techniques and portion control
              strategies for better glucose management.
            </li>
            <li>
              Create balanced meal plans that incorporate all food groups while
              maintaining stable blood sugar.
            </li>
            <li>
              Learn to read nutrition labels effectively and identify hidden
              sugars in processed foods.
            </li>
            <li>
              Develop practical skills for dining out and social eating while
              managing diabetes.
            </li>
          </ul>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-title">Module Progress</span>
            <span className="progress-percentage">75%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "0%" }}></div>
          </div>
        </div>

        <button className="quiz-button" onClick={() => setModalOpen(true)}>
          Take Quiz 📝
        </button>
      </div>

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
          <div className="info-icon difficulty-icon">📊</div>
          <div className="info-content">
            <div className="info-label">Difficulty Level</div>
            <div className="info-value difficulty-easy">Easy</div>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon access-icon">📅</div>
          <div className="info-content">
            <div className="info-label">Last Accessed</div>
            <div className="info-value">Today, 2:30 PM</div>
          </div>
        </div>
      </div>
      <ReusableModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <QuizPage />
      </ReusableModal>
    </div>
  );
};

export default HealthyEatingModule;
