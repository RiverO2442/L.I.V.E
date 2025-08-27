import React, { useEffect, useState } from "react";
import { QuizService } from "../../service/service";
import "./styles.css";
import InfoCard, { InfoCardProps } from "../infoCard/infoCard";

const ICONS = {
  healthyEating: ["🥗", "🍎", "🌾", "🥦", "🍞", "🥬", "🥒", "🍊", "🍌", "🍇"],
  activity: ["🏃", "💪", "🚴", "🏊", "🧘", "🏋️", "🤸", "🚶", "🏃‍♀️", "🧗"],
  bloodGlucose: ["🩸", "📊", "🎯", "💉", "📱", "⏰", "📋", "🔍", "📈"],
  symptoms: ["⚠️", "🤒", "🚑", "😰", "🏥", "😵", "🤕", "🤧", "😴"],
};

interface QuizMaterialProps {
  slug: string; // module slug
  category: keyof typeof ICONS;
  lessonId: string;
}

const QuizMaterial: React.FC<QuizMaterialProps> = ({
  slug,
  category,
  lessonId,
}) => {
  const [cards, setCards] = useState<InfoCardProps[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await QuizService.getByModuleSlug(slug);

        // Find the lesson by ID
        const lesson = data.lessons?.find((l: any) => l.id === lessonId);
        if (!lesson) {
          setCards([]);
          return;
        }

        const mapped = lesson.questions.map((q: any) => ({
          question: q.question,
          feedback: q.feedback,
          category,
          icons: ICONS[category],
        }));
        setCards(mapped);
      } catch (err) {
        console.error("Failed to load quiz material:", err);
      }
    })();
  }, [slug, category, lessonId]);

  return (
    <div className="scroll-container">
      <button className="scroll-header" onClick={() => setOpen(!open)}>
        📜 Lesson Material
      </button>

      <div className={`scroll-content ${open ? "open" : ""}`}>
        <div className="card-grid">
          {cards.map((card, idx) => (
            <InfoCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizMaterial;
