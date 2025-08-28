import React, { useEffect, useState } from "react";
import "./styles.css";

export interface InfoCardProps {
  question: string;
  feedback: string;
  icons: string[]; // icon pool
  category: "activity" | "bloodGlucose" | "symptoms" | "healthyEating";
}

// Utility
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const InfoCard: React.FC<InfoCardProps> = ({
  question,
  feedback,
  icons,
  category,
}) => {
  const [icon, setIcon] = useState<string>("");

  useEffect(() => {
    setIcon(getRandomItem(icons));
  }, [icons]);

  return (
    <div className="material-card">
      <div className="card-container">
        <div
          className="info-card"
          tabIndex={0}
          role="article"
          aria-label={`Quiz material card about ${category}`}
        >
          <div className="card-question">{question}</div>
          <div className="card-icon" aria-hidden="true">
            {icon}
          </div>
          <div className="card-feedback">{feedback}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
