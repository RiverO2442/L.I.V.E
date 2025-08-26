import React, { useEffect, useState } from "react";
import "./styles.css";
import { QuizService } from "../../service/service";

interface Question {
  id: string;
  question: string;
  options: string[];
  feedback: string;
}

interface Lesson {
  id: string;
  title: string;
  questions: Question[];
}

interface QuizPageProps {
  slug: string; // 👈 module slug
  lessonId: string; // 👈 selected lesson
  onClose: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ slug, lessonId, onClose }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number }[]
  >([]);
  const [showSummary, setShowSummary] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await QuizService.getByModuleSlug(slug);
        const lessonData = data.lessons.find((l: Lesson) => l.id === lessonId);
        setLesson(lessonData || null);
      } catch (err) {
        console.error("Failed to load lesson quiz:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, lessonId]);

  const currentQuestion = lesson?.questions[questionIndex];

  const handleNext = async () => {
    if (selected !== null && currentQuestion) {
      const newAnswers = [
        ...answers,
        { questionId: currentQuestion.id, selectedIndex: selected },
      ];
      setAnswers(newAnswers);
      setSelected(null);

      // Next question in lesson
      if (questionIndex + 1 < (lesson?.questions.length || 0)) {
        setQuestionIndex(questionIndex + 1);
        return;
      }

      // Finished this lesson
      try {
        const submission = await QuizService.submit(
          slug,
          newAnswers,
          Date.now()
        );
        setResult(submission.result);
      } catch (err) {
        console.error("Failed to submit quiz:", err);
      }
      setShowSummary(true);
    }
  };

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleRetake = () => {
    setQuestionIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowSummary(false);
    setResult(null);
  };

  if (loading) return <div className="quiz-container">Loading quiz...</div>;
  if (!lesson) return <div className="quiz-container">Lesson not found.</div>;

  return (
    <div className="quiz-container absolute top-0 left-0 w-[100vw] min-h-[1000px] flex items-center justify-center">
      <div className="quiz-card">
        {showSummary ? (
          <div className="summary-screen">
            <div className="module-header">
              <div className="module-name">{lesson.title}</div>
              <div className="question-number">Lesson Complete!</div>
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
                ? "🎉 Great job on this lesson!"
                : "📚 Please review the lesson and try again."}
            </div>
            <div className="summary-buttons">
              <button className="summary-btn retake-btn" onClick={handleRetake}>
                Retake Lesson Quiz
              </button>
              <button className="summary-btn back-btn" onClick={onClose}>
                Back to Lessons
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="module-header">
              <div className="module-name">{lesson.title}</div>
              <div className="question-number">
                Question {questionIndex + 1} of {lesson.questions.length}
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((questionIndex + 1) / lesson.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <div className="question-text">{currentQuestion?.question}</div>
            <div className="options">
              {currentQuestion?.options.map((opt, index) => (
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
              {questionIndex === lesson.questions.length - 1
                ? "Finish Lesson"
                : "Next Question"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
