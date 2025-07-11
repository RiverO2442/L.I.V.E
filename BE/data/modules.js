// BE/data/modules.js
const modules = [
  {
    id: "healthy-eating",
    title: "Healthy Eating",
    description: "Learn how to manage diabetes with nutrition.",
    progress: 0,
    quiz: [
      {
        question: "Which of these is a healthy carb?",
        options: ["White bread", "Whole grain oats", "Soda", "Cake"],
        answer: "Whole grain oats",
      },
    ],
  },
  {
    id: "physical-activity",
    title: "Physical Activity",
    description: "Understand the role of exercise in blood sugar control.",
    progress: 0,
    quiz: [
      {
        question: "How much moderate exercise is recommended per week?",
        options: ["30 mins", "60 mins", "150 mins", "300 mins"],
        answer: "150 mins",
      },
    ],
  },
];

module.exports = modules;
