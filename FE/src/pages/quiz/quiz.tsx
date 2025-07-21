import React, { useEffect, useState } from "react";
import "./styles.css";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    question: "Which type of carbohydrate is best for people with diabetes?",
    options: [
      "Simple carbohydrates like white bread and candy",
      "Complex carbohydrates like whole grains and vegetables",
      "All carbohydrates should be avoided completely",
      "Only fruits and fruit juices",
    ],
    correct: 1,
  },
  {
    question: "What is the recommended portion size for protein at each meal?",
    options: [
      "About the size of your palm",
      "Half of your plate",
      "As much as you want",
      "One small bite",
    ],
    correct: 0,
  },
  {
    question: "Which cooking method is healthiest for people with diabetes?",
    options: [
      "Deep frying",
      "Grilling, baking, or steaming",
      "Pan-frying with lots of oil",
      "Breading and frying",
    ],
    correct: 1,
  },
  {
    question: "How often should people with diabetes eat throughout the day?",
    options: [
      "One large meal per day",
      "Only when feeling hungry",
      "Regular, balanced meals and snacks",
      "Skip breakfast to reduce blood sugar",
    ],
    correct: 2,
  },
  {
    question: "What should you drink most often when you have diabetes?",
    options: [
      "Regular soda and fruit juices",
      "Water and unsweetened beverages",
      "Sports drinks for energy",
      "Diet soda exclusively",
    ],
    correct: 1,
  },
];

const QuizPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showSummary, setShowSummary] = useState(false);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleNext = () => {
    if (selected !== null) {
      setAnswers({ ...answers, [current]: selected });
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleRetake = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setShowSummary(false);
  };

  const score = Object.keys(answers).reduce((acc, key) => {
    const qIndex = parseInt(key);
    return answers[qIndex] === questions[qIndex].correct ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  return (
    <div className="quiz-container w-[100vw] min-h-[1000px] flex items-center justify-center">
      <div className="quiz-card">
        {showSummary ? (
          <div className="summary-screen">
            <div className="module-header">
              <div className="module-name">Healthy Eating</div>
              <div className="question-number">Quiz Complete!</div>
            </div>
            <div className="score-display">
              <div className="score-percentage">{percentage}%</div>
              <div className="score-raw">
                You scored {score} out of {questions.length} questions correctly
              </div>
            </div>
            <div className={`feedback ${passed ? "pass" : "fail"}`}>
              {passed
                ? "🎉 Congratulations! You passed the quiz."
                : "📚 Please review the material and try again."}
            </div>
            <div className="summary-buttons">
              <button className="summary-btn retake-btn" onClick={handleRetake}>
                Retake Quiz
              </button>
              <button
                className="summary-btn back-btn"
                onClick={() => alert("Back to module")}
              >
                Back to Module
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="module-header">
              <div className="module-name">Healthy Eating</div>
              <div className="question-number">
                Question {current + 1} of {questions.length}
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="question-text">{questions[current].question}</div>
            <div className="options">
              {questions[current].options.map((opt, index) => (
                <div
                  key={index}
                  className={`option ${selected === index ? "selected" : ""}`}
                  onClick={() => handleSelect(index)}
                >
                  <div className="option-text">{opt}</div>
                </div>
              ))}
            </div>
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={selected === null}
            >
              {current === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
