import React, { useEffect, useState } from "react";
import "./styles.css";
import { QuizService } from "../../service/service";

interface Question {
  id: string;
  question: string;
  options: string[];
  feedback: string;
}

interface QuizPageProps {
  slug: string; // 👈 module slug
  onClose: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ slug, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number }[]
  >([]);
  const [showSummary, setShowSummary] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime, setStartTime] = useState<number>(Date.now()); // 👈 track quiz start

  useEffect(() => {
    (async () => {
      try {
        const data = await QuizService.getByModuleSlug(slug);
        setQuestions(data.questions);
        setStartTime(Date.now()); // reset start when questions load
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleNext = async () => {
    if (selected !== null && questions[current]) {
      const newAnswers = [
        ...answers,
        { questionId: questions[current].id, selectedIndex: selected },
      ];
      setAnswers(newAnswers);
      setSelected(null);

      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        try {
          // 👇 send startTime + answers
          const submission = await QuizService.submit(
            slug,
            newAnswers,
            startTime
          );
          setResult(submission.result);
        } catch (err) {
          console.error("Failed to submit quiz:", err);
        }
        setShowSummary(true);
      }
    }
  };

  const handleSelect = (index: number) => {
    setSelected(index);
  };
  const handleRetake = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowSummary(false);
    setResult(null);
  };

  if (loading) return <div className="quiz-container">Loading quiz...</div>;
  if (!questions.length)
    return <div className="quiz-container">No questions available.</div>;

  return (
    <div className="quiz-container absolute top-0 left-0 w-[100vw] min-h-[1000px] flex items-center justify-center">
      <div className="quiz-card">
        {showSummary ? (
          <div className="summary-screen">
            <div className="module-header">
              <div className="module-name">{slug.replace("-", " ")}</div>
              <div className="question-number">Quiz Complete!</div>
            </div>
            <div className="score-display">
              <div className="score-percentage">{result?.accuracy ?? 0}%</div>
              <div className="score-raw">
                You scored {result?.correct ?? 0} out of {result?.total ?? 0}{" "}
                questions correctly
              </div>
            </div>
            <div
              className={`feedback ${
                result && result.accuracy >= 70 ? "pass" : "fail"
              }`}
            >
              {result && result.accuracy >= 70
                ? "🎉 Congratulations! You passed the quiz."
                : "📚 Please review the material and try again."}
            </div>
            <div className="summary-buttons">
              <button className="summary-btn retake-btn" onClick={handleRetake}>
                Retake Quiz
              </button>
              <button className="summary-btn back-btn" onClick={onClose}>
                Back to Module
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="module-header">
              <div className="module-name">{slug.replace("-", " ")}</div>
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
